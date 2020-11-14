import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, FlatList, Text } from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import {
    FETCH_COMMITTEES_QUERY,
    FETCH_DIVISIONS_QUERY,
} from '../../util/graphql';
import Task from '../event/Task';

const CreatedByMe = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const [committeesValue, setCommitteesValue] = useState([]);
    const [divisionsValue, setDivisionsValue] = useState([]);

    const { data: committees, error: errorCommittees, loading: loadingCommittees, refetch: refetchCommittees } = useQuery(
        FETCH_COMMITTEES_QUERY,
        {
            variables: { projectId: props.project.id },
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
            variables: { projectId: props.project.id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setDivisionsValue(divisions.getDivisions) }
        }
    );


    const onRefresh = () => {
        refetchCommittees();
        refetchDivisions();
    }

    useEffect(() => {
        onRefresh();
    }, [props.onRefresh]);

    return (
        <View style={styles.container}>
            <View style={styles.breadcrumbContainer}>
                <TouchableCmp>
                    <Text>{props.project.name}</Text>
                </TouchableCmp>
                <Text>{' > '}</Text>
                <TouchableCmp>
                    <Text>{props.event.name}</Text>
                </TouchableCmp>
                <Text>{' > '}</Text>
                <TouchableCmp>
                    <Text>{props.roadmap.name}</Text>
                </TouchableCmp>
            </View>
            <Task
                tasks={props.tasks}
                committees={committeesValue}
                divisions={divisionsValue}
                task={props.task}
                taskId={props.task.id}
                roadmapId={props.task.roadmap_id}
                name={props.task.name}
                project_name={props.project.name}
                due_date={props.task.due_date}
                completed={props.task.completed}
                completedTasksStateUpdate={props.completedTasksStateUpdate}
                deleteTasksStateUpdate={props.deleteTasksStateUpdate}
                updateTasksStateUpdate={props.updateTasksStateUpdate}
                priority={props.task.priority}
                completed_date={props.task.completed_date}
                createdAt={props.task.createdAt}
                createdBy={props.task.createdBy}
                roadmap={props.roadmap}
                onRefresh={props.onRefresh}
            />
        </View>
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
    breadcrumbContainer:{
        flexDirection: 'row',
        alignItems: 'center'
    }
});


export default CreatedByMe;