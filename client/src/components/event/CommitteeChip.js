import React, { useState, useContext, useEffect } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, Image } from 'react-native';
import { Chip, List, Caption, Provider, Portal, Title, Text } from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { FETCH_STAFF_QUERY, DELETE_ASSIGNED_TASK, FETCH_ASSIGNED_TASKS_QUERY } from '../../util/graphql';
import CenterSpinner from '../common/CenterSpinner';
import { theme } from '../../constants/Theme';

const CommitteeChip = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const { data: staff, error: errorStaff, loading: loadingStaff } = useQuery(
        FETCH_STAFF_QUERY,
        {
            variables: { staffId: props.staffId }
        }
    );

    const [deleteAssignedTask] = useMutation(DELETE_ASSIGNED_TASK, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_ASSIGNED_TASKS_QUERY,
                variables: {roadmapId: props.roadmapId }
            });
            data.getAssignedTasks = data.getAssignedTasks.filter((e) => e.id !== props.assignedId);
            props.deleteAssignedTasksStateUpdate(props.assignedId)
            proxy.writeQuery({ query: FETCH_ASSIGNED_TASKS_QUERY, data, variables: { roadmapId: props.roadmapId } });
        },
        variables: {
            assignedId: props.assignedId
        }
    });

    if (errorStaff) {
        console.error(errorStaff);
        return <Text>errorStaff</Text>;
    }


    if (loadingStaff) {
        return <CenterSpinner />;
    }

    return (
        <Chip avatar={<Image source={staff.getStaff.picture === null || staff.getStaff.picture === '' ? require('../../assets/avatar.png') : { uri: staff.getStaff.picture }} />} onPress={() => console.log('Pressed')} onClose={() => {deleteAssignedTask()}}>{staff.getStaff.name}</Chip>
    );
};

const styles = StyleSheet.create({

});


export default CommitteeChip;