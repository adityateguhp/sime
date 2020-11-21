import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, Text } from 'react-native';
import { useLazyQuery } from '@apollo/react-hooks';

import {
    FETCH_PICS_QUERY,
    FETCH_COMMITTEES_QUERY,
} from '../../util/graphql';
import Task from '../task/Task';

const CreatedByMe = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const [personInChargesValue, setPersonInChargesValue] = useState([]);
    const [committeesValue, setCommitteesValue] = useState([]);

    const [loadPersonInChargesData, { data: personInCharges, error: errorPersonInCharges, loading: loadingPersonInCharges }] = useLazyQuery(
        FETCH_PICS_QUERY,
        {
            variables: { projectId: props.project.id },
            notifyOnNetworkStatusChange: true
        }
    );

    const [loadCommitteesData, { data: committees, error: errorCommittees, loading: loadingCommittees }] = useLazyQuery(
        FETCH_COMMITTEES_QUERY,
        {
            variables: { projectId: props.project.id },
            notifyOnNetworkStatusChange: true
        }
    );

    useEffect(() => {
        if (props.project.id) {
            loadPersonInChargesData();
            loadCommitteesData();
        }
    }, [props.project])

    useEffect(() => {
        if (personInCharges) {
            personInCharges.getPersonInCharges.sort(function (a, b) {
                var textA = a.order;
                var textB = b.order;

                return textA.localeCompare(textB)
            });
            setPersonInChargesValue(personInCharges.getPersonInCharges)
        }
    }, [personInCharges])

    useEffect(() => {
        if (committees) {
            setCommitteesValue(committees.getPersonInCharges)
        }
    }, [committees])

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
                personInCharges={personInChargesValue}
                committees={committeesValue}
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