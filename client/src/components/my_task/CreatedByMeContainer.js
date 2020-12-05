import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';

import {
    FETCH_ROADMAP_QUERY,
    FETCH_EVENT_QUERY,
    FETCH_PROJECT_QUERY,
    FETCH_ASSIGNED_TASKS_QUERY,
    FETCH_PICS_BYSTAFF_PROJECT_QUERY,
    FETCH_PICS_QUERY
} from '../../util/graphql';
import CreatedByMe from './CreatedByMe'
import { SimeContext } from '../../context/SimePovider';

const CreatedByMeContainer = props => {

    const sime = useContext(SimeContext);

    const [roadmapValue, setRoadmapValue] = useState(null);

    const [eventValue, setEventValue] = useState(null);

    const [projectValue, setProjectValue] = useState(null);

    const [assignedTasksValue, setAssignedTasksValue] = useState([]);

    const [personInChargeValue, setPersonInChargeValue] = useState(null);

    const [personInChargesValue, setPersonInChargesValue] = useState([]);

    const { data: roadmap, error: errorRoadmap, loading: loadingRoadmap, refetch: refetchRoadmap } = useQuery(
        FETCH_ROADMAP_QUERY,
        {
            variables: { roadmapId: props.task.roadmap_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setRoadmapValue(roadmap.getRoadmap)
            }
        });

    const { data: event, error: errorEvent, loading: loadingEvent, refetch: refetchEvent } = useQuery(
        FETCH_EVENT_QUERY,
        {
            variables: { eventId: props.task.event_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setEventValue(event.getEvent)
            }
        });


    const { data: project, error: errorProject, loading: loadingProject, refetch: refetchProject } = useQuery(
        FETCH_PROJECT_QUERY,
        {
            variables: { projectId: props.task.project_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setProjectValue(project.getProject)
            }
        });

    const { data: assignedTasks, error: errorAssignedTasks, loading: loadingAssignedTasks, refetch: refetchAssignedTasks } = useQuery(
        FETCH_ASSIGNED_TASKS_QUERY,
        {
            variables: { roadmapId: props.task.roadmap_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setAssignedTasksValue(assignedTasks.getAssignedTasks) }
        }
    );

    const [loadPic, { data: picStaff, error: error1, loading: loading1 }] = useLazyQuery(
        FETCH_PICS_BYSTAFF_PROJECT_QUERY,
        {
            variables: { staffId: props.createdBy, projectId: props.task.project_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setPersonInChargeValue(picStaff.getPersonInChargesByStaffProject)
            }
        });

    useEffect(() => {
        if (sime.user_type !== "Organization") {
            loadPic();
            if (picStaff) {
                setPersonInChargeValue(picStaff.getPersonInChargesByStaffProject)
            }
        }
    }, [sime.user_type, picStaff])

    const { data: personInCharges, error: errorPersonInCharges, loading: loadingPersonInCharges, refetch: refetchPersonInCharges } = useQuery(
        FETCH_PICS_QUERY,
        {
            variables: { projectId: props.task.project_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                personInCharges.getPersonInCharges.sort(function (a, b) {
                    var textA = a.order;
                    var textB = b.order;

                    return textA.localeCompare(textB)
                });
                setPersonInChargesValue(personInCharges.getPersonInCharges)
            }
        }
    );

    const deleteAssignedTasksStateUpdate = (e) => {
        const temp = [...assignedTasksValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e);
        temp.splice(index, 1);
        setAssignedTasksValue(temp);
    }

    const assignedTasksStateUpdate = (e) => {
        setAssignedTasksValue([e, ...assignedTasksValue]);
    }

    const onRefresh = () => {
        refetchRoadmap();
        refetchPersonInCharges();
        refetchAssignedTasks();
        refetchProject();
        refetchEvent();
    };

    useEffect(() => {
        onRefresh();
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.onRefresh]);

    if (loadingAssignedTasks) {

    }

    if (loadingEvent) {

    }

    if (loading1) {

    }

    if (loadingPersonInCharges) {

    }

    if (loadingProject) {

    }

    if (loadingRoadmap) {

    }

    return (
        <CreatedByMe
            projectBreadcrumb={props.projectBreadcrumb}
            tasks={props.tasks}
            task={props.task}
            roadmap={roadmapValue}
            event={eventValue}
            project={projectValue}
            personInCharges={personInChargesValue}
            userPersonInCharge={personInChargeValue}
            assignedTasks={assignedTasksValue}
            onRefresh={props.onRefresh}
            completedTasksStateUpdate={props.completedTasksStateUpdate}
            deleteTasksStateUpdate={props.deleteTasksStateUpdate}
            updateTasksStateUpdate={props.updateTasksStateUpdate}
            deleteAssignedTasksStateUpdate={deleteAssignedTasksStateUpdate}
            assignedTasksStateUpdate={assignedTasksStateUpdate}
            navigation={props.navigation}
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