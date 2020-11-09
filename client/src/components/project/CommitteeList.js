import React, { useState, useContext, useEffect } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, List, Caption, Provider, Portal, Title, Text } from 'react-native-paper';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { 
    FETCH_STAFF_QUERY, 
    FETCH_POSITION_QUERY, 
    FETCH_COMMITTEE_QUERY, 
    FETCH_COMMITTEES_QUERY,
    DELETE_COMMITTEE, 
    DELETE_ASSIGNED_TASK_BYCOMMITTEE
} from '../../util/graphql';
import CenterSpinner from '../common/CenterSpinner';
import ModalProfile from '../common/ModalProfile';
import FormEditCommittee from './FormEditCommittee';
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';

const CommitteeList = props => {
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

    const [loadExistData, { called, data: committee, error: errorCommittee }] = useLazyQuery(
        FETCH_COMMITTEE_QUERY,
        {
            variables: { committeeId: sime.committee_id }
        });

    const [committeeVal, setCommitteeVal] = useState(null);
    const [visible, setVisible] = useState(false);
    const [visibleModalProfile, setVisibleModalProfile] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);

    useEffect(() => {
        if (committee) setCommitteeVal(committee.getCommittee);
    }, [committee])

    const [deleteAssignedTaskByCommittee] = useMutation(DELETE_ASSIGNED_TASK_BYCOMMITTEE);

    const [deleteCommittee] = useMutation(DELETE_COMMITTEE, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_COMMITTEES_QUERY,
                variables: { projectId: sime.project_id }
            });
            data.getCommittees = data.getCommittees.filter((e) => e.id !== sime.committee_id);
            props.deleteCommitteesStateUpdate(sime.committee_id);
            deleteAssignedTaskByCommittee({variables: {committeeId: sime.committee_id}});
            proxy.writeQuery({ query: FETCH_COMMITTEES_QUERY, data, variables: { projectId: sime.project_id } });
        },
        variables: {
            committeeId: sime.committee_id
        }
    });

    const closeModal = () => {
        setVisible(false);
    }

    const closeModalProfile = () => {
        setVisibleModalProfile(false);
    }

    const closeModalFormEdit = () => {
        setVisibleFormEdit(false);
    }

    const longPressHandler = (committee_id, staff_id, name) => {
        setVisible(true);
        sime.setCommittee_id(committee_id);
        sime.setStaff_name(name);
        sime.setStaff_id(staff_id);
        loadExistData();
    }

    const openFormEdit = () => {
        closeModal();
        setVisibleFormEdit(true);
    }

    const selectItemHandler = () => {
        sime.setCommittee_id(props.committee_id);
        setVisibleModalProfile(true);
    }

    const updateCommitteeStateUpdate = (e) => {
        setCommitteeVal(e)
    }

    const deleteHandler = () => {
        closeModal();
        closeModalFormEdit();
        Alert.alert('Are you sure?', 'Do you really want to delete this committee?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: confirmToDeleteAll
            }
        ]);
    };


    const confirmToDeleteAll = () => {
        Alert.alert('Wait... are you really sure?', "By deleting this committee, it's also delete all related to this committee", [
            { text: 'Cancel', style: 'default' },
            {
                text: 'Agree',
                style: 'destructive',
                onPress: deleteCommittee
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
        return <CenterSpinner />;
    }

    if (loadingPosition) {
        return <CenterSpinner />;
    }

    return (
        <Provider theme={theme}>
            <TouchableCmp
                onPress={() => { selectItemHandler() }}
                onLongPress={sime.order === '1' && sime.userCommitteeId !== props.committee_id ||
                    sime.order === '2' && sime.userCommitteeId !== props.committee_id && props.order !== '1' ||
                    sime.user_type === "Organization" ? () => { longPressHandler(props.committee_id, props.staff_id, staff.getStaff.name) } : null}
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
            {sime.order === '1' && sime.userCommitteeId !== props.committee_id ||
                sime.order === '2' && sime.userCommitteeId !== props.committee_id && props.order !== '1' ||
                sime.user_type === "Organization" ?
                <Portal>
                    <Modal
                        useNativeDriver={true}
                        isVisible={visible}
                        animationIn="zoomIn"
                        animationOut="zoomOut"
                        onBackButtonPress={closeModal}
                        onBackdropPress={closeModal}
                        statusBarTranslucent>
                        <View style={styles.modalView}>
                            <Title style={{ marginTop: wp(4), marginHorizontal: wp(5), marginBottom: 5, fontSize: wp(4.86) }}>{sime.staff_name}</Title>
                            <TouchableCmp onPress={openFormEdit}>
                                <View style={styles.textView}>
                                    <Text style={styles.text}>Edit</Text>
                                </View>
                            </TouchableCmp>
                            <TouchableCmp onPress={deleteHandler}>
                                <View style={styles.textView}>
                                    <Text style={styles.text}>Delete</Text>
                                </View>
                            </TouchableCmp>
                        </View>
                    </Modal>
                    <FormEditCommittee
                        closeModalForm={closeModalFormEdit}
                        visibleForm={visibleFormEdit}
                        deleteButton={deleteHandler}
                        closeButton={closeModalFormEdit}
                        committee={committeeVal}
                        staffs={props.staffs}
                        divisions={props.divisions}
                        positions={props.positions}
                        committees={props.committees}
                        updateCommitteesStateUpdate={props.updateCommitteesStateUpdate}
                        updateCommitteeStateUpdate={updateCommitteeStateUpdate}
                    />
                </Portal> : null}
            <ModalProfile
                visible={visibleModalProfile}
                onBackButtonPress={closeModalProfile}
                onBackdropPress={closeModalProfile}
                name={staff.getStaff.name}
                position_name={position.getPosition.name}
                email={staff.getStaff.email}
                phone_number={staff.getStaff.phone_number}
                picture={staff.getStaff.picture}
                positionName={true}
                onPressInfo={props.onSelect}
                onPressIn={closeModalProfile}
            />
        </Provider>
    );
};

const modalMenuWidth = wp(77);
const modalMenuHeight = wp(35);

const styles = StyleSheet.create({
    staffs: {
        marginLeft: 10,
        marginTop: 3
    },
    wrap: {
        marginTop: 1
    },
    modalView: {
        backgroundColor: 'white',
        height: modalMenuHeight,
        width: modalMenuWidth,
        alignSelf: 'center',
        justifyContent: 'flex-start'
    },
    textView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        marginBottom: 5
    },
    text: {
        marginLeft: wp(5.6),
        fontSize: wp(3.65)
    }
});


export default CommitteeList;