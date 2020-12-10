import React, { useState, useContext, useEffect } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, List, Caption, Provider, Portal, Text, Chip } from 'react-native-paper';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';;
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import {
    FETCH_STAFF_QUERY,
    FETCH_POSITION_QUERY,
    FETCH_PIC_QUERY,
    FETCH_PICS_QUERY,
    DELETE_PIC,
    DELETE_ASSIGNED_TASK_BYPIC
} from '../../util/graphql';
import CenterSpinnerSmall from '../common/CenterSpinnerSmall';
import ProfileModal from '../common/ProfileModal';
import FormEditPic from './FormEditPic';
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';
import LoadingModal from '../common/LoadingModal';
import OptionModal from '../common/OptionModal';
import Colors from '../../constants/Colors';

const PicList = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const [staffValue, setStaffValue] = useState({
        name: '',
        picture: '',
        isAdmin: false,
        email: '',
        phone_number: ''
    })

    const [positionName, setPositionName] = useState('')

    const { data: staff, error: errorStaff, loading: loadingStaff, refetch: refetchStaff } = useQuery(
        FETCH_STAFF_QUERY,
        {
            variables: { staffId: props.staff_id },
            onCompleted: () => {
                if (staff.getStaff) {
                    setStaffValue({
                        name: staff.getStaff.name,
                        picture: staff.getStaff.picture,
                        isAdmin: staff.getStaff.isAdmin,
                        email: staff.getStaff.email,
                        phone_number: staff.getStaff.phone_number
                    })
                } else {
                    setStaffValue({
                        name: '[staff not found]',
                        picture: '',
                        isAdmin: false,
                        email: '',
                        phone_number: ''
                    })
                }
            }
        }
    );

    useEffect(() => {
        if (staff) {
            if (staff.getStaff) {
                setStaffValue({
                    name: staff.getStaff.name,
                    picture: staff.getStaff.picture,
                    isAdmin: staff.getStaff.isAdmin,
                    email: staff.getStaff.email,
                    phone_number: staff.getStaff.phone_number
                })
            } else {
                setStaffValue({
                    name: '[staff not found]',
                    picture: '',
                    isAdmin: false,
                    email: '',
                    phone_number: ''
                })
            }
        }
    }, [staff])

    const { data: position, error: errorPosition, loading: loadingPosition, refetch: refetchPosition } = useQuery(
        FETCH_POSITION_QUERY,
        {
            variables: { positionId: props.position_id },
            onCompleted: () => {
                if (position.getPosition) {
                    setPositionName(position.getPosition.name)
                } else {
                    setPositionName('[position not found]')
                }
            }
        }
    );

    useEffect(() => {
        if (position) {
            if (position.getPosition) {
                setPositionName(position.getPosition.name)
            } else {
                setPositionName('[position not found]')
            }
        }
    }, [position])

    const [loadExistData, { called, data: personInCharge, error: errorCommittee }] = useLazyQuery(
        FETCH_PIC_QUERY,
        {
            variables: { personInChargeId: sime.person_in_charge_id }
        });

    const [personInChargeVal, setCommitteeVal] = useState(null);
    const [visible, setVisible] = useState(false);
    const [visibleProfileModal, setVisibleProfileModal] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);

    useEffect(() => {
        if (personInCharge) setCommitteeVal(personInCharge.getPersonInCharge);
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [personInCharge])

    const [deleteAssignedTaskByPersonInCharge] = useMutation(DELETE_ASSIGNED_TASK_BYPIC);

    const [deletePersonInCharge, { loading: loadingDelete }] = useMutation(DELETE_PIC, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_PICS_QUERY,
                variables: { projectId: sime.project_id }
            });
            data.getPersonInCharges = data.getPersonInCharges.filter((e) => e.id !== sime.person_in_charge_id);
            props.deletePersonInChargesStateUpdate(sime.person_in_charge_id);
            deleteAssignedTaskByPersonInCharge({ variables: { personInChargeId: sime.person_in_charge_id } });
            proxy.writeQuery({ query: FETCH_PICS_QUERY, data, variables: { projectId: sime.project_id } });
        },
        variables: {
            personInChargeId: sime.person_in_charge_id
        }
    });

    const closeModal = () => {
        setVisible(false);
    }

    const closeProfileModal = () => {
        setVisibleProfileModal(false);
    }

    const closeModalFormEdit = () => {
        setVisibleFormEdit(false);
    }

    const longPressHandler = (person_in_charge_id, staff_id, name) => {
        setVisible(true);
        sime.setPerson_in_charge_id(person_in_charge_id);
        sime.setStaff_name(name);
        sime.setStaff_id(staff_id);
        loadExistData();
    }

    const openFormEdit = () => {
        closeModal();
        setVisibleFormEdit(true);
    }

    const selectItemHandler = () => {
        sime.setPerson_in_charge_id(props.person_in_charge_id);
        setVisibleProfileModal(true);
    }

    const updatePersonInChargeStateUpdate = (e) => {
        setCommitteeVal(e)
    }

    const deleteHandler = () => {
        closeModal();
        closeModalFormEdit();
        Alert.alert('Are you sure?', 'Do you really want to delete this person in charge?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: confirmToDeleteAll
            }
        ]);
    };


    const confirmToDeleteAll = () => {
        Alert.alert('Wait... are you really sure?', "By deleting this person in charge, it's also delete all related to this person in charge", [
            { text: 'Cancel', style: 'default' },
            {
                text: 'Agree',
                style: 'destructive',
                onPress: deletePersonInCharge
            }
        ]);
    };

    useEffect(() => {
        refetchStaff();
        refetchPosition();
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.onRefresh]);

    return (
        <Provider theme={theme}>
            <TouchableCmp
                onPress={() => { selectItemHandler() }}
                onLongPress={sime.user_type === 'Staff' && sime.order === '1' && sime.userPersonInChargeId !== props.person_in_charge_id ||
                    sime.user_type === 'Staff' && sime.order === '2' && sime.userPersonInChargeId !== props.person_in_charge_id && props.order !== '1' ||
                    sime.user_type === 'Staff' && sime.order === '3' && sime.userPersonInChargeId !== props.person_in_charge_id && props.order !== '1' && props.order !== '2' ||
                    sime.user_type === 'Staff' && sime.order === '6' && sime.userPersonInChargeId !== props.person_in_charge_id && sime.userPicCommittee === props.committee_id ||
                    sime.user_type === 'Staff' && sime.order === '7' && sime.userPersonInChargeId !== props.person_in_charge_id && sime.userPicCommittee === props.committee_id && props.order !== '6' ||
                    sime.user_type === "Organization" ? () => { longPressHandler(props.person_in_charge_id, props.staff_id, staffValue.name) } : null}
                useForeground>
                <View style={styles.wrap}>
                    <List.Item
                        style={styles.staffs}
                        title={staffValue.name}
                        description={<Caption>{positionName}</Caption>}
                        left={() => <Avatar.Image size={50} source={staffValue.picture ? { uri: staffValue.picture } : require('../../assets/avatar.png')} />}
                        right={() => staffValue.isAdmin ?
                            <View style={{ alignSelf: "center" }}>
                                <Chip mode="outlined" style={{ borderColor: Colors.primaryColor }} textStyle={{ color: Colors.secondaryColor }}>Admin</Chip>
                            </View>
                            : null}
                    />
                </View>
            </TouchableCmp>
            {sime.user_type === 'Staff' && sime.order === '1' && sime.userPersonInChargeId !== props.person_in_charge_id ||
                sime.user_type === 'Staff' && sime.order === '2' && sime.userPersonInChargeId !== props.person_in_charge_id && props.order !== '1' ||
                sime.user_type === 'Staff' && sime.order === '3' && sime.userPersonInChargeId !== props.person_in_charge_id && props.order !== '1' && props.order !== '2' ||
                sime.user_type === 'Staff' && sime.order === '6' && sime.userPersonInChargeId !== props.person_in_charge_id && sime.userPicCommittee === props.committee_id ||
                sime.user_type === 'Staff' && sime.order === '7' && sime.userPersonInChargeId !== props.person_in_charge_id && sime.userPicCommittee === props.committee_id && props.order !== '6' ||
                sime.user_type === "Organization" ?
                <Portal>
                    <OptionModal
                        visible={visible}
                        closeModal={closeModal}
                        title={sime.staff_name}
                        openFormEdit={openFormEdit}
                        deleteHandler={deleteHandler}
                    />
                    <FormEditPic
                        closeModalForm={closeModalFormEdit}
                        visibleForm={visibleFormEdit}
                        deleteButton={deleteHandler}
                        closeButton={closeModalFormEdit}
                        personInCharge={personInChargeVal}
                        staffs={props.staffs}
                        committees={props.committees}
                        positions={props.positions}
                        personInCharges={props.personInCharges}
                        updatePersonInChargesStateUpdate={props.updatePersonInChargesStateUpdate}
                        updatePersonInChargeStateUpdate={updatePersonInChargeStateUpdate}
                    />
                    <LoadingModal loading={loadingDelete} />
                </Portal> : null}
            {staffValue.name !== '[staff not found]' ?
                <ProfileModal
                    visible={visibleProfileModal}
                    onBackButtonPress={closeProfileModal}
                    onBackdropPress={closeProfileModal}
                    name={staffValue.name}
                    position_name={positionName}
                    email={staffValue.email}
                    phone_number={staffValue.phone_number}
                    picture={staffValue.picture}
                    positionName={true}
                    onPressInfo={props.onSelect}
                    onPressIn={closeProfileModal}
                /> : null}
        </Provider>
    );
};


const styles = StyleSheet.create({
    staffs: {

        elevation: 3,
        backgroundColor: 'white',
    },
    wrap: {
        marginHorizontal: 10,
    },
});


export default PicList;