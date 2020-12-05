import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, Text } from 'react-native';
import { useLazyQuery } from '@apollo/react-hooks';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
    FETCH_COMMITTEE_QUERY,
} from '../../util/graphql';
import Task from '../task/Task';
import Colors from '../../constants/Colors';
import { SimeContext } from '../../context/SimePovider';

const CreatedByMe = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const [committeeValue, setCommitteeValue] = useState(null);
    const [projectName, setProjectName] = useState('');
    const [projectId, setProjectId] = useState('');
    const [eventName, setEventName] = useState('');
    const [eventId, setEventId] = useState('');
    const [roadmapName, setRoadmapName] = useState('');
    const [roadmapId, setRoadmapId] = useState('');
    const [committeeId, setCommiteeId] = useState('');
    const [order, setOrder] = useState('');
    const [picId, setPicId] = useState('');
    const [userCommitteeId, setUserCommiteeId] = useState('');

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
            setProjectId(props.project.id)
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.project])

    useEffect(() => {
        if (props.event) {
            setEventName(props.event.name)
            setEventId(props.event.id)
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.event])

    useEffect(() => {
        if (props.roadmap) {
            setRoadmapName(props.roadmap.name);
            setCommiteeId(props.roadmap.committee_id);
            setRoadmapId(props.roadmap.id);
            loadData();
            if (committee) {
                setCommitteeValue(committee.getCommittee)
            }
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.roadmap, committee])

    useEffect(() => {
        if (props.userPersonInCharge) {
            setPicId(props.userPersonInCharge.id)
            setUserCommiteeId(props.userPersonInCharge.committee_id)
            setOrder(props.userPersonInCharge.order)
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.userPersonInCharge])

    const projectPressHandler = (id, name) => {
        props.navigation.navigate('Project Menu', {
            projectName: projectName
        }
        );
        sime.setProject_id(id);
        sime.setProject_name(name);
    };

    const eventPressHandler = (event_id, event_name, project_name, project_id, picId, userCommitteeId, order) => {
        props.navigation.navigate('Event Detail');
        sime.setEvent_id(event_id);
        sime.setEvent_name(event_name);
        sime.setProject_id(project_id);
        sime.setProject_name(project_name);
        sime.setOrder(order)
        sime.setUserPersonInChargeId(picId)
        sime.setUserPicCommittee(userCommitteeId)
    };

    const roadmapPressHandler = (roadmap_id, name, committee_id, event_id, event_name, project_name, project_id, picId, userCommitteeId, order) => {
        props.navigation.navigate('Task');
        sime.setRoadmap_id(roadmap_id);
        sime.setRoadmap_name(name);
        sime.setCommittee_id(committee_id);
        sime.setEvent_id(event_id);
        sime.setEvent_name(event_name);
        sime.setProject_id(project_id);
        sime.setProject_name(project_name);
        sime.setOrder(order)
        sime.setUserPersonInChargeId(picId)
        sime.setUserPicCommittee(userCommitteeId)
    };

    if (props.task === null) {
        return null;
    }

    return (
        <View style={{ ...styles.container, ...{ marginTop: props.projectBreadcrumb ? 10 : 0 } }}>
              <View style={styles.breadcrumbContainer}>
                <View style={styles.breadcrumb}>
                    {
                        props.projectBreadcrumb ?
                            <View style={styles.breadcrumb}>
                                <Button color={Colors.primaryColor} labelStyle={{ fontSize: 12 }} uppercase={false} mode="text" compact={true} onPress={() => { projectPressHandler(projectId, projectName) }} >{projectName}</Button>
                                <Icon name="chevron-right" size={16} color="grey" />
                            </View>
                            :
                            null
                    }
                    <Button color={Colors.primaryColor} labelStyle={{ fontSize: 12 }} uppercase={false} mode="text" compact={true} onPress={() => { eventPressHandler(eventId, eventName, projectName, projectId, picId, userCommitteeId, order) }} >{eventName}</Button>
                    <Icon name="chevron-right" size={16} color="grey" />
                    <Button color={Colors.primaryColor} labelStyle={{ fontSize: 12 }} uppercase={false} mode="text" compact={true} onPress={() => { roadmapPressHandler(roadmapId, roadmapName, committeeId, eventId, eventName, projectName, projectId, picId, userCommitteeId, order) }} >{roadmapName}</Button>
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
                createdByMe={true}
                radiusZero={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
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
        marginHorizontal: 10,
        backgroundColor: "white",
        elevation: 3
    },
});


export default CreatedByMe;