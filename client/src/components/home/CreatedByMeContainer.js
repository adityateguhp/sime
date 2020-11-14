import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, FlatList, Text } from 'react-native';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';

import {
    FETCH_ROADMAP_QUERY,
    FETCH_EVENT_QUERY,
    FETCH_PROJECT_QUERY
} from '../../util/graphql';
import CreatedByMe from './CreatedByMe'

const CreatedByMeContainer = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

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

    const { data: roadmap, error: errorRoadmap, loading: loadingRoadmap, refetch } = useQuery(
        FETCH_ROADMAP_QUERY,
        {
            variables: { roadmapId: props.task.roadmap_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                if (roadmap.getRoadmap === null) {
                    setEventValue({
                        id: '',
                        name: '',
                        project_id: ''
                    });
                } else {
                    setRoadmapValue({
                        id: roadmap.getRoadmap.id,
                        name: roadmap.getRoadmap.name,
                        event_id: roadmap.getRoadmap.event_id,
                        start_date: roadmap.getRoadmap.start_date,
                        end_date: roadmap.getRoadmap.end_date,
                        createdAt: roadmap.getRoadmap.createdAt
                    })
                    loadEventData();
                    if (event) {
                        setEventValue({
                            id: event.getEvent.id,
                            name: event.getEvent.name,
                            project_id: event.getEvent.project_id
                        })
                        loadProjectData();
                    }
                }
            }
        });

    const [loadEventData, { data: event, error: errorEvent, loading: loadingEvent }] = useLazyQuery(
        FETCH_EVENT_QUERY,
        {
            variables: { eventId: roadmapValue.event_id },
            notifyOnNetworkStatusChange: true
        });


    const [loadProjectData, { data: project, error: errorProject, loading: loadingProject }] = useLazyQuery(
        FETCH_PROJECT_QUERY,
        {
            variables: { projectId: eventValue.project_id },
            notifyOnNetworkStatusChange: true
        });

    useEffect(() => {
        if (event) {
            setEventValue({
                id: event.getEvent.id,
                name: event.getEvent.name,
                project_id: event.getEvent.project_id
            })
            loadProjectData();
        }
    }, [event])

    useEffect(() => {
        if (project) {
            setProjectValue({
                id: project.getProject.id,
                name: project.getProject.name,
                organization_id: project.getProject.organization_id
            })
        }
    }, [project])

    const onRefresh = () => {
        refetch();
    }

    useEffect(() => {
        onRefresh();
    }, [props.onRefresh]);

    return (
        <CreatedByMe
            tasks={props.tasks}
            task={props.task}
            roadmap={roadmapValue}
            event={eventValue}
            project={projectValue}
            onRefresh={props.onRefresh}
            completedTasksStateUpdate={props.completedTasksStateUpdate}
            deleteTasksStateUpdate={props.deleteTasksStateUpdate}
            updateTasksStateUpdate={props.updateTasksStateUpdate}
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


export default CreatedByMeContainer;