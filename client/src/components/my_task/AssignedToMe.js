import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, Text } from 'react-native';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
    FETCH_COMMITTEE_QUERY,
    FETCH_TASK_QUERY,
    FETCH_EVENT_QUERY,
    FETCH_PROJECT_QUERY
} from '../../util/graphql';
import Task from '../task/Task';
import CenterSpinnerSmall from '../common/CenterSpinnerSmall';
import Colors from '../../constants/Colors';

const AssignedToMe = props => {
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
                <View style={styles.breadcrumb}>
                    <Button color={Colors.primaryColor} labelStyle={{ fontSize: 12 }} uppercase={false} mode="text" compact={true} onPress={()=>{}} >{projectName}</Button>
                    <Icon name="chevron-right" size={16} color="grey" />
                    <Button color={Colors.primaryColor} labelStyle={{ fontSize: 12 }} uppercase={false} mode="text" compact={true} onPress={()=>{}} >{eventName}</Button>
                    <Icon name="chevron-right" size={16} color="grey" />
                    <Button color={Colors.primaryColor} labelStyle={{ fontSize: 12 }} uppercase={false} mode="text" compact={true} onPress={()=>{}} >{roadmapName}</Button>
                </View>
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
                createdByMe={false}
                radiusTopZero={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
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
    breadcrumb: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    breadcrumbContainer: {
        marginTop: 10,
        marginHorizontal: 10,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        backgroundColor: "white",
        elevation: 3
    },
});


export default AssignedToMe;