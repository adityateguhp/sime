import React, { useState, useContext } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, List, Caption, Provider, Portal, Title, Text } from 'react-native-paper';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { FETCH_STAFF_QUERY, FETCH_POSITION_QUERY, FETCH_COMMITTEE_QUERY } from '../../util/graphql';
import CenterSpinner from '../common/CenterSpinner';
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';

const CommitteeList = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const selectItemHandler = (id, name) => {
        navigation.navigate('Event Detail');
        sime.setStaff_id(id);
        sime.setStaff_name(name);
    };

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

    const [loadExistData, { called, data: committee, error: errorCommittee, loading: loadingCommittee }] = useLazyQuery(
        FETCH_COMMITTEE_QUERY,
        {
            variables: { committeeId: sime.committee_id },
        });

    const [committeeVal, setCommitteeVal] = useState(null);
    const [visible, setVisible] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);

    const closeModal = () => {
        setVisible(false);
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
        setCommitteeVal(committee.getCommittee);
        console.log(committeeVal)
    }

    const deleteHandler = () => {
        closeModal();
        closeModalFormEdit();
        Alert.alert('Are you sure?', 'Do you really want to delete this?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: props.deleteFunction
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

    if (loadingCommittee) {

    }


    return (
        <Provider theme={theme}>
            <TouchableCmp 
            onPress={() => {selectItemHandler(props.staff_id)}} 
            onLongPress={() => {longPressHandler(props.committee_id, props.staff_id, staff.getStaff.name)}} 
            useForeground>
                <View style={styles.wrap}>
                    <List.Item
                        style={styles.staffs}
                        title={staff.getStaff.name}
                        description={<Caption>{position.getPosition.name}</Caption>}
                        left={() => <Avatar.Image size={50} source={staff.getStaff.picture === null || staff.getStaff.picture === '' ? require('../../assets/avatar.png') : { uri: staff.getStaff.picture }} />}
                    />
                </View>
            </TouchableCmp>
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
            </Portal>
            
        </Provider>
    );
};

const modalMenuWidth = wp(77);
const modalMenuHeight = wp(46.5);

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