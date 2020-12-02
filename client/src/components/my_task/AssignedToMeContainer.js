import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import {
    FETCH_PIC_QUERY,
    FETCH_PICS_QUERY,
    FETCH_TASKS_QUERY,
    FETCH_EVENT_QUERY,
    FETCH_PROJECT_QUERY,
    FETCH_ROADMAP_QUERY,
    FETCH_ASSIGNED_TASKS_QUERY,
    FETCH_TASK_QUERY
} from '../../util/graphql';
import AssignedToMe from './AssignedToMe'
import CenterSpinnerSmall from '../common/CenterSpinnerSmall';

const AssignedToMeContainer = props => {
    const [tasksValue, setTasksValue] = useState([]);
    const [taskValue, setTaskValue] = useState(null);
    const [personInChargesValue, setPersonInChargesValue] = useState([]);
    const [personInChargeValue, setPersonInChargeValue] = useState(null);
    const [roadmapValue, setRoadmapValue] = useState(null);
    const [assignedTasksValue, setAssignedTasksValue] = useState([]);
    const [projectValue, setProjectValue] = useState(null);
    const [eventValue, setEventValue] = useState(null);


    const { data: personInCharges, error: errorPersonInCharges, loading: loadingPersonInCharges, refetch: refetchPersonInCharges } = useQuery(
        FETCH_PICS_QUERY,
        {
            variables: { projectId: props.projectId },
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

    const { data: personInCharge, error: errorPersonInCharge, loading: loadingPersonInCharge, refetch: refetchPersonInCharge } = useQuery(
        FETCH_PIC_QUERY,
        {
            variables: { personInChargeId: props.personInChargeId },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setPersonInChargeValue(personInCharge.getPersonInCharge)
            }
        }
    );

    const { data: tasks, error: errorTasks, loading: loadingTasks, refetch: refetchTasks } = useQuery(
        FETCH_TASKS_QUERY,
        {
            variables: { roadmapId: props.roadmapId },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                tasks.getTasks.sort(function (x, y) {
                    return new Date(x.createdAt) - new Date(y.createdAt);
                }).reverse();
                tasks.getTasks.sort(function (x, y) {
                    return Number(x.completed) - Number(y.completed);
                });
                setTasksValue(tasks.getTasks)
            }
        }
    );


    const { data: task, error: errorTask, loading: loadingTask, refetch: refetchTask } = useQuery(
        FETCH_TASK_QUERY,
        {
            variables: { taskId: props.taskId },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setTaskValue(task.getTask)
            }
        }
    );


    const { data: assignedTasks, error: errorAssignedTasks, loading: loadingAssignedTasks, refetch: refetchAssignedTasks } = useQuery(
        FETCH_ASSIGNED_TASKS_QUERY,
        {
            variables: { roadmapId: props.roadmapId },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setAssignedTasksValue(assignedTasks.getAssignedTasks) }
        }
    );

    const { data: roadmap, error: errorRoadmap, loading: loadingRoadmap, refetch: refetchRoadmap } = useQuery(
        FETCH_ROADMAP_QUERY,
        {
            variables: { roadmapId: props.roadmapId },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setRoadmapValue(roadmap.getRoadmap)
            }
        });

    const { data: project, error: errorProject, loading: loadingProject, refetch: refetchProject } = useQuery(
        FETCH_PROJECT_QUERY,
        {
            variables: { projectId: props.projectId },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setProjectValue(project.getProject)
            }
        });

    const { data: event, error: errorEvent, loading: loadingEvent, refetch: refetchEvent } = useQuery(
        FETCH_EVENT_QUERY,
        {
            variables: { eventId: props.eventId },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setEventValue(event.getEvent)
            }
        });

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

    const completedTasksStateUpdate = (e) => {
        setTaskValue(e)
    }

    const deleteTaskStateUpdate = () => {
        setTaskValue(null);
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
        refetchTasks();
        refetchTask();
        refetchPersonInCharges();
        refetchRoadmap();
        refetchAssignedTasks();
        refetchPersonInCharge();
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

    if (loadingPersonInCharge) {
        
    }

    if (loadingPersonInCharges) {
        
    }

    if (loadingProject) {
        
    }

    if (loadingRoadmap) {
        
    }

    if (loadingTask) {
        
    }

    if (loadingTasks) {
        
    }

    return (
        <AssignedToMe
            personInCharges={personInChargesValue}
            userPersonInCharge={personInChargeValue}
            project={projectValue}
            event={eventValue}
            roadmap={roadmapValue}
            task={taskValue}
            tasks={tasksValue}
            assignedTasks={assignedTasksValue}
            onRefresh={props.onRefresh}
            completedTasksStateUpdate={completedTasksStateUpdate}
            deleteTasksStateUpdate={deleteTasksStateUpdate}
            updateTasksStateUpdate={updateTasksStateUpdate}
            assignedTasksStateUpdate={assignedTasksStateUpdate}
            deleteAssignedTasksStateUpdate={deleteAssignedTasksStateUpdate}
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