import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, FlatList, Text } from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import {
    FETCH_ASSIGNED_TASKS_QUERY_BYCOMMITTEE,
    FETCH_COMMITTEES_QUERY,
    FETCH_DIVISIONS_QUERY,
} from '../../util/graphql';
import AssignedToMe from './AssignedToMe'

const AssignedToMeContainer = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const [assignedTasksValue, setAssignedTasksValue] = useState([]);
    const [committeesValue, setCommitteesValue] = useState([]);
    const [divisionsValue, setDivisionsValue] = useState([]);

    const { data: assignedTasksByCommittee, error: error1, loading: loading1, refetch } = useQuery(
        FETCH_ASSIGNED_TASKS_QUERY_BYCOMMITTEE,
        {
            variables: { committeeId: props.committeeId },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setAssignedTasksValue(assignedTasksByCommittee.getAssignedTasksByCommittee)
            }
        });

    const { data: committees, error: errorCommittees, loading: loadingCommittees, refetch: refetchCommittees } = useQuery(
        FETCH_COMMITTEES_QUERY,
        {
            variables: { projectId: props.projectId },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                committees.getCommittees.sort(function (a, b) {
                    var textA = a.order;
                    var textB = b.order;

                    return textA.localeCompare(textB)
                });
                setCommitteesValue(committees.getCommittees)
            }
        }
    );

    const { data: divisions, error: errorDivisions, loading: loadingDivisions, refetch: refetchDivisions } = useQuery(
        FETCH_DIVISIONS_QUERY,
        {
            variables: { projectId: props.projectId },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setDivisionsValue(divisions.getDivisions) }
        }
    );


    const deleteStateUpdate = (e) => {
        const temp = [...assignedTasksValue];
        const index = temp.map(function (item) {
            return item.task_id
        }).indexOf(e);
        temp.splice(index, 1);
        setAssignedTasksValue(temp);
    }

    const onRefresh = () => {
        refetch();
        refetchCommittees();
        refetchDivisions();
    }

    useEffect(() => {
        onRefresh();
    }, [props.onRefresh]);

    return (
        <FlatList
            style={styles.screen}
            data={assignedTasksValue}
            keyExtractor={item => item.id}
            renderItem={itemData => (
                <AssignedToMe
                    committees={committeesValue}
                    divisions={divisionsValue}
                    projectId={props.projectId}
                    taskId={itemData.item.task_id}
                    onRefresh={props.onRefresh}
                    deleteStateUpdate={deleteStateUpdate}
                    onToggleSnackBarDelete={props.onToggleSnackBarDelete}
                    onToggleSnackBarUpdate={props.onToggleSnackBarUpdate}
                />
            )}
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
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15
    },
});


export default AssignedToMeContainer;