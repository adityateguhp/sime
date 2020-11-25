import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, Text } from 'react-native';
import { useLazyQuery } from '@apollo/react-hooks';

import {
    FETCH_PICS_QUERY,
    FETCH_COMMITTEE_QUERY,
} from '../../util/graphql';
import Task from '../task/Task';

const CreatedByMe = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    const [committeeValue, setCommitteeValue] = useState(null);
    const [projectName, setProjectName] = useState('');
    const [eventName, setEventName] = useState('');
    const [roadmapName, setRoadmapName] = useState('');
    const [committeeId, setCommiteeId] = useState('');

    const [loadData, { data: committee, error: errorCommittee, loading: loadingCommittee }] = useLazyQuery(
        FETCH_COMMITTEE_QUERY,
        {
            variables: { committeeId },
            notifyOnNetworkStatusChange: true
        }
    );

    useEffect(() => {
        if (props.project) {
            setProjectName(props.project.name)
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.project])

    useEffect(() => {
        if (props.event) {
            setEventName(props.event.name)
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.event])

    useEffect(() => {
        if (props.roadmap) {
            setRoadmapName(props.roadmap.name);
            setCommiteeId(props.roadmap.committee_id);
            loadData();
            if (committee) {
                setCommitteeValue(committee.getCommittee)
            }
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.roadmap, committee])
    if (props.task === null) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.breadcrumbContainer}>
                <TouchableCmp>
                    <Text>{projectName}</Text>
                </TouchableCmp>
                <Text>{' > '}</Text>
                <TouchableCmp>
                    <Text>{eventName}</Text>
                </TouchableCmp>
                <Text>{' > '}</Text>
                <TouchableCmp>
                    <Text>{roadmapName}</Text>
                </TouchableCmp>
            </View>
            <Task
                tasks={props.tasks}
                personInCharges={props.personInCharges}
                userPersonInCharge={props.userPersonInCharge}
                committee={committeeValue}
                assignedTasks={props.assignedTasks}
                task={props.task}
                completedTasksStateUpdate={props.completedTasksStateUpdate}
                deleteTasksStateUpdate={props.deleteTasksStateUpdate}
                updateTasksStateUpdate={props.updateTasksStateUpdate}
                assignedTasksStateUpdate={props.assignedTasksStateUpdate}
                deleteAssignedTasksStateUpdate={props.deleteAssignedTasksStateUpdate}
                roadmap={props.roadmap}
                taskScreen={false}
                createdByMe={true}
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