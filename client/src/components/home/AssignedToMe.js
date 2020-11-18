import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, FlatList, Text } from 'react-native';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';

import {
    FETCH_ROADMAP_QUERY,
    FETCH_TASKS_QUERY,
    FETCH_TASK_QUERY,
    FETCH_EVENT_QUERY,
    FETCH_PROJECT_QUERY
} from '../../util/graphql';
import Task from '../event/Task';
import CenterSpinnerSmall from '../common/CenterSpinnerSmall';

const AssignedToMe = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const [taskValue, setTaskValue] = useState({
        id: '',
        name: '',
        description: '',
        completed: '',
        due_date: '',
        completed_date: '',
        priority: '',
        roadmap_id: '',
        createdAt: '',
        createdBy: ''
    });
    const [roadmapValue, setRoadmapValue] = useState({
        id: '',
        name: '',
        event_id: '',
        start_date: '',
        end_date: '',
        createdAt: ''
    });

    const [eventValue, setEventValue] = useState({
        id: '',
        name: '',
        project_id: ''
    });

    const [projectValue, setProjectValue] = useState({
        id: '',
        name: '',
        organization_id: ''
    });

    const { data: task, error: errorTask, loading: loadingTask, refetch: refetchTask } = useQuery(
        FETCH_TASK_QUERY,
        {
            variables: { taskId: props.taskId },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                if (task.getTask === null || props.deleteCalled) {
                    setRoadmapValue({
                        id: '',
                        name: '',
                        event_id: '',
                        start_date: '',
                        end_date: '',
                        createdAt: ''
                    });
                } else {
                    setTaskValue({
                        id: task.getTask.id,
                        name: task.getTask.name,
                        description: task.getTask.description,
                        completed: task.getTask.completed,
                        due_date: task.getTask.due_date,
                        completed_date: task.getTask.completed_date,
                        priority: task.getTask.priority,
                        roadmap_id: task.getTask.roadmap_id,
                        createdAt: task.getTask.createdAt,
                        createdBy: task.getTask.createdBy
                    })
                    loadRoadmapData();
                    if (roadmap) {
                        setRoadmapValue({
                            id: roadmap.getRoadmap.id,
                            name: roadmap.getRoadmap.name,
                            event_id: roadmap.getRoadmap.event_id,
                            start_date: roadmap.getRoadmap.start_date,
                            end_date: roadmap.getRoadmap.end_date,
                            createdAt: roadmap.getRoadmap.createdAt
                        })
                        loadEventData();
                    }
                }
            }
        });

    const { data: project, error: errorProject, loading: loadingProject, refetch: refetchProject } = useQuery(
        FETCH_PROJECT_QUERY,
        {
            variables: { projectId: props.projectId },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setProjectValue({
                    id: project.getProject.id,
                    name: project.getProject.name,
                    organization_id: project.getProject.organization_id
                })
            }
        });

    const [loadRoadmapData, { data: roadmap, error: errorRoadmap, loading: loadingRoadmap }] = useLazyQuery(
        FETCH_ROADMAP_QUERY,
        {
            variables: { roadmapId: taskValue.roadmap_id },
            notifyOnNetworkStatusChange: true
        });

    const [loadEventData, { data: event, error: errorEvent, loading: loadingEvent }] = useLazyQuery(
        FETCH_EVENT_QUERY,
        {
            variables: { eventId: roadmapValue.event_id },
            notifyOnNetworkStatusChange: true
        });

    useEffect(() => {
        if (roadmap) {
            setRoadmapValue({
                id: roadmap.getRoadmap.id,
                name: roadmap.getRoadmap.name,
                event_id: roadmap.getRoadmap.event_id,
                start_date: roadmap.getRoadmap.start_date,
                end_date: roadmap.getRoadmap.end_date,
                createdAt: roadmap.getRoadmap.createdAt
            })
            loadEventData();
        }
    }, [roadmap])

    useEffect(() => {
        if (event) {
            setEventValue({
                id: event.getEvent.id,
                name: event.getEvent.name,
                project_id: event.getEvent.project_id
            })
        }
    }, [event])


    const completedTasksStateUpdate = (e) => {
        setTaskValue(e)
    }

    const deleteTaskStateUpdate = () => {
        setTaskValue({
            id: '',
            name: '',
            description: '',
            completed: '',
            due_date: '',
            completed_date: '',
            priority: '',
            roadmap_id: '',
            createdAt: '',
            createdBy: ''
        });
    }

    const deleteTasksStateUpdate = (e) => {
        deleteTaskStateUpdate();
        props.deleteStateUpdate(e);
        props.onToggleSnackBarDelete();
    }

    const updateTasksStateUpdate = (e) => {
        setTaskValue(e);
        props.onToggleSnackBarUpdate();
    }

    const onRefresh = () => {
        refetchTask();
        refetchProject();
    }

    useEffect(() => {
        onRefresh();
    }, [props.onRefresh]);

    if (task === undefined || taskValue.id === '') {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.breadcrumbContainer}>
                <TouchableCmp>
                    <Text>{projectValue.name}</Text>
                </TouchableCmp>
                <Text>{' > '}</Text>
                <TouchableCmp>
                    <Text>{eventValue.name}</Text>
                </TouchableCmp>
                <Text>{' > '}</Text>
                <TouchableCmp>
                    <Text>{roadmapValue.name}</Text>
                </TouchableCmp>
            </View>
            <Task
                project_name={projectValue.name}
                committees={props.committees}
                divisions={props.divisions}
                task={taskValue}
                completedTasksStateUpdate={completedTasksStateUpdate}
                deleteTasksStateUpdate={deleteTasksStateUpdate}
                updateTasksStateUpdate={updateTasksStateUpdate}
                roadmap={roadmapValue}
                onRefresh={props.onRefresh}
                taskScreen={false}
                setDeleteCalled={props.setDeleteCalled}
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
    breadcrumbContainer:{
        flexDirection: 'row',
        alignItems: 'center'
    }
});


export default AssignedToMe;