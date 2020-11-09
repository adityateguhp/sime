import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, Image } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { FETCH_STAFF_QUERY, DELETE_ASSIGNED_TASK, FETCH_ASSIGNED_TASKS_QUERY } from '../../util/graphql';
import CenterSpinnerSmall from '../common/CenterSpinnerSmall';

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

    const deleteHandler = () => {
        Alert.alert('Are you sure?', 'Do you really want to delete this?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: deleteAssignedTask
            }
        ]);
    };

    if (errorStaff) {
        console.error(errorStaff);
        return <Text>errorStaff</Text>;
    }


    if (loadingStaff) {
        return <CenterSpinnerSmall />;
    }

    return (
        <Chip avatar={<Image source={staff.getStaff.picture? { uri: staff.getStaff.picture } : require('../../assets/avatar.png')} />} onClose={deleteHandler}>{staff.getStaff.name}</Chip>
    );
};

const styles = StyleSheet.create({

});


export default CommitteeChip;