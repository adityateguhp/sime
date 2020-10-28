import React, { useState, useContext, useEffect } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, List, Caption, Provider, Portal, Title, Text } from 'react-native-paper';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { FETCH_STAFF_QUERY, FETCH_POSITION_QUERY, FETCH_COMMITTEE_QUERY } from '../../util/graphql';
import CenterSpinner from '../common/CenterSpinner';
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';

const AssignedToCommitteeList = props => {
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

    
    if (errorStaff) {
        console.error(errorStaff);
        return <Text>errorStaff</Text>;
    }

    if (errorPosition) {
        console.error(errorPosition);
        return <Text>errorPosition</Text>;
    }

    if (loadingStaff) {
        return <CenterSpinner />;
    }

    if (loadingPosition) {
        return <CenterSpinner />;
    }

    return (
        <Provider theme={theme}>
            <TouchableCmp>
                <View style={styles.wrap}>
                    <List.Item
                        style={styles.staffs}
                        title={staff.getStaff.name}
                        description={<Caption>{position.getPosition.name}</Caption>}
                        left={() => <Avatar.Image size={50} source={staff.getStaff.picture === null || staff.getStaff.picture === '' ? require('../../assets/avatar.png') : { uri: staff.getStaff.picture }} />}
                    />
                </View>
            </TouchableCmp>
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


export default AssignedToCommitteeList;