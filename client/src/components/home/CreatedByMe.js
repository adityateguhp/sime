import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, FlatList, Text } from 'react-native';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';

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

    const [loadCommitteesData, { data: committees, error: errorCommittees, loading: loadingCommittees }] = useLazyQuery(
        FETCH_COMMITTEES_QUERY,
        {
            variables: { projectId: props.project.id },
            notifyOnNetworkStatusChange: true
        }
    );

    const [loadDivisionsData, { data: divisions, error: errorDivisions, loading: loadingDivisions }] = useLazyQuery(
        FETCH_DIVISIONS_QUERY,
        {
            variables: { projectId: props.project.id },
            notifyOnNetworkStatusChange: true
        }
    );

    useEffect(() => {
        if (props.project.id) {
            loadCommitteesData();
            loadDivisionsData();
        }
    }, [props.project])

    useEffect(() => {
        if (committees) {
            committees.getCommittees.sort(function (a, b) {
                var textA = a.order;
                var textB = b.order;

                return textA.localeCompare(textB)
            });
            setCommitteesValue(committees.getCommittees)
        }
    }, [committees])

    useEffect(() => {
        if (divisions) {
            setDivisionsValue(divisions.getDivisions)
        }
    }, [divisions])

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
                project_name={props.project.name}
                tasks={props.tasks}
                committees={committeesValue}
                divisions={divisionsValue}
                task={props.task}
                completedTasksStateUpdate={props.completedTasksStateUpdate}
                deleteTasksStateUpdate={props.deleteTasksStateUpdate}
                updateTasksStateUpdate={props.updateTasksStateUpdate}
                roadmap={props.roadmap}
                onRefresh={props.onRefresh}
                taskScreen={true}
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
    breadcrumbContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});


export default CreatedByMe;