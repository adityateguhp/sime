import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, Text } from 'react-native';
import { Avatar, List, Caption } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';

import { FETCH_STAFF_QUERY, FETCH_POSITION_QUERY, FETCH_COMMITTEES_IN_DIVISION_QUERY } from '../../util/graphql';
import CenterSpinner from '../common/CenterSpinner';


const CommitteeList = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

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
        <List.Item
            style={styles.staffs}
            title={staff.getStaff.name}
            description={<Caption>{position.getPosition.name}</Caption>}
            left={() => <Avatar.Image size={50} source={{ uri: staff.getStaff.picture }} />}
        />
    );
};

const styles = StyleSheet.create({
    staffs: {
        marginLeft: 10,
        marginTop: 3
    },
    wrap: {
        marginTop: 1
    }
});


export default CommitteeList;