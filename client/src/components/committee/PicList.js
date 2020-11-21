import React, { useState, useContext, useEffect } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, List, Caption, Provider, Portal, Text } from 'react-native-paper';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';;

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

const PicList = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const { data: staff, error: errorStaff, loading: loadingStaff } = useQuery(
        FETCH_STAFF_QUERY,
        {
            variables: { staffId: props.staff_id }
        }
    );

    const { data: position, error: errorPosition, loading: loadingPosition } = useQuery(
        FETCH_POSITION_QUERY,
        {
            variables: { positionId: props.position_id }
        }
    );

    const [loadExistData, { called, data: personInCharge, error: errorCommittee }] = useLazyQuery(
        FETCH_PIC_QUERY,
        {
            variables: { personInChargeId: sime.personInCharge_id }
        });

    const [personInChargeVal, setCommitteeVal] = useState(null);
    const [visible, setVisible] = useState(false);
    const [visibleProfileModal, setVisibleProfileModal] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);

    useEffect(() => {
        if (personInCharge) setCommitteeVal(personInCharge.getPersonInCharge);
    }, [personInCharge])

    const [deleteAssignedTaskByPersonInCharge] = useMutation(DELETE_ASSIGNED_TASK_BYPIC);

    const [deletePersonInCharge, { loading: loadingDelete }] = useMutation(DELETE_PIC, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_PICS_QUERY,
                variables: { projectId: sime.project_id }
            });
            data.getPersonInCharges = data.getPersonInCharges.filter((e) => e.id !== sime.personInCharge_id);
            props.deletePersonInChargesStateUpdate(sime.personInCharge_id);
            deleteAssignedTaskByPersonInCharge({ variables: { personInChargeId: sime.personInCharge_id } });
            proxy.writeQuery({ query: FETCH_PICS_QUERY, data, variables: { projectId: sime.project_id } });
        },
        variables: {
            personInChargeId: sime.personInCharge_id
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

    const longPressHandler = (personInCharge_id, staff_id, name) => {
        setVisible(true);
        sime.setPersonInCharge_id(personInCharge_id);
        sime.setStaff_name(name);
        sime.setStaff_id(staff_id);
        loadExistData();
    }

    const openFormEdit = () => {
        closeModal();
        setVisibleFormEdit(true);
    }

    const selectItemHandler = () => {
        sime.setPersonInCharge_id(props.personInCharge_id);
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


    if (errorStaff) {
        console.error(errorStaff);
        return <Text>errorStaff</Text>;
    }

    if (errorPosition) {
        console.error(errorPosition);
        return <Text>errorPosition</Text>;
    }

    if (called & errorCommittee) {
        console.error(errorCommittee);
        return <Text>errorCommittee</Text>;
    }

    if (loadingStaff) {
        return <CenterSpinnerSmall />;
    }

    if (loadingPosition) {
        return <CenterSpinnerSmall />;
    }

    return (
        <Provider theme={theme}>
            <TouchableCmp
                onPress={() => { selectItemHandler() }}
                onLongPress={sime.order === '1' && sime.userPersonInChargeId !== props.personInCharge_id ||
                    sime.order === '2' && sime.userPersonInChargeId !== props.personInCharge_id && props.order !== '1' ||
                    sime.order === '3' && sime.userPersonInChargeId !== props.personInCharge_id && props.order !== '1' && props.order !== '2' ||
                    sime.order === '6' && sime.userPersonInChargeId !== props.personInCharge_id && sime.userPicCommittee === props.committee_id ||
                    sime.order === '7' && sime.userPersonInChargeId !== props.personInCharge_id && sime.userPicCommittee === props.committee_id && props.order !== '6' ||
                    sime.user_type === "Organization" ? () => { longPressHandler(props.personInCharge_id, props.staff_id, staff.getStaff.name) } : null}
                useForeground>
                <View style={styles.wrap}>
                    <List.Item
                        style={styles.staffs}
                        title={staff.getStaff.name}
                        description={<Caption>{position.getPosition.name}</Caption>}
                        left={() => <Avatar.Image size={50} source={staff.getStaff.picture ? { uri: staff.getStaff.picture } : require('../../assets/avatar.png')} />}
                    />
                </View>
            </TouchableCmp>
            {sime.order === '1' && sime.userPersonInChargeId !== props.personInCharge_id ||
                sime.order === '2' && sime.userPersonInChargeId !== props.personInCharge_id && props.order !== '1' ||
                sime.order === '3' && sime.userPersonInChargeId !== props.personInCharge_id && props.order !== '1' && props.order !== '2' ||
                sime.order === '6' && sime.userPersonInChargeId !== props.personInCharge_id && sime.userPicCommittee === props.committee_id ||
                sime.order === '7' && sime.userPersonInChargeId !== props.personInCharge_id && sime.userPicCommittee === props.committee_id && props.order !== '6' ||
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
            <ProfileModal
                visible={visibleProfileModal}
                onBackButtonPress={closeProfileModal}
                onBackdropPress={closeProfileModal}
                name={staff.getStaff.name}
                position_name={position.getPosition.name}
                email={staff.getStaff.email}
                phone_number={staff.getStaff.phone_number}
                picture={staff.getStaff.picture}
                positionName={true}
                onPressInfo={props.onSelect}
                onPressIn={closeProfileModal}
            />
        </Provider>
    );
};


const styles = StyleSheet.create({
    staffs: {
        marginLeft: 10,
        marginTop: 3
    },
    wrap: {
        marginTop: 1
    },
});


export default PicList;