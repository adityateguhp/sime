import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, Alert } from 'react-native';
import { Subheading, Checkbox, Caption, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { useQuery, useMutation } from '@apollo/react-hooks';

import {
    FETCH_TASKS_QUERY,
    DELETE_TASK,
    COMPLETED_TASK,
    DELETE_ASSIGNED_TASK_BYTASK,
    FETCH_TASKS_CREATEDBY_QUERY
} from '../../util/graphql';
import { theme } from '../../constants/Theme';
import TaskModal from './TaskModal';
import LoadingModal from '../common/LoadingModal';
import { SimeContext } from '../../context/SimePovider';

const Task = props => {

    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const [visible, setVisible] = useState(false);
    const [due_date, setDue_date] = useState('');
    const [completed_date, setCompleted_date] = useState('');
    const [completedValue, setCompletedValue] = useState({
        taskId: props.task.id,
        completed: props.task.completed,
        completed_date: props.task.completed_date
    });
    const [committeeId, setCommitteId] = useState(' ');
    const [userPersonInCharge, setUserPersonInCharge] = useState({
        id: '',
        order: '',
        committee_id: ''
    })

    useEffect(() => {
        if (props.committee) {
            setCommitteId(props.committee.id)
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.committee])

    useEffect(() => {
        if (props.userPersonInCharge) {
            setUserPersonInCharge({
                id: props.userPersonInCharge.id,
                order: props.userPersonInCharge.order,
                committee_id: props.userPersonInCharge.committee_id
            })
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.userPersonInCharge])

    const filterAssignedTask = props.assignedTasks.filter((e) => e.task_id === props.task.id)

    const checkAssignedTask = filterAssignedTask.filter((e) => e.person_in_charge_id === userPersonInCharge.id)

    const completeTaskScreen = (proxy, result) => {
        const data = proxy.readQuery({
            query: FETCH_TASKS_QUERY,
            variables: { roadmapId: props.task.roadmap_id },
        });
        props.completedTasksStateUpdate(result.data.completedTask);
        proxy.writeQuery({ query: FETCH_TASKS_QUERY, data, variables: { roadmapId: props.task.roadmap_id } });
    }

    const completeMyTaskScreen = (result) => {
        props.completedTasksStateUpdate(result.data.completedTask);
    }

    const completeCreatedByMeScreen = (proxy, result) => {
        const data = proxy.readQuery({
            query: FETCH_TASKS_CREATEDBY_QUERY,
            variables: { createdBy: sime.user.id }
        });
        props.completedTasksStateUpdate(result.data.completedTask);
        proxy.writeQuery({ query: FETCH_TASKS_CREATEDBY_QUERY, data, variables: { createdBy: sime.user.id } });
    }


    const [completedTask, { loading }] = useMutation(COMPLETED_TASK, {
        update(proxy, result) {
            props.taskScreen ? completeTaskScreen(proxy, result) : props.createdByMe ? completeCreatedByMeScreen(proxy, result) : completeMyTaskScreen(result);
        },
        onError(err) {
            console.log(err)
            return err;
        },
        variables: { ...completedValue, completed: !completedValue.completed, completed_date: completedValue.completed ? '' : new Date() }
    });

    const [deleteAssignedTaskByTask] = useMutation(DELETE_ASSIGNED_TASK_BYTASK);

    const deleteTaskScreen = (proxy) => {
        const data = proxy.readQuery({
            query: FETCH_TASKS_QUERY,
            variables: { roadmapId: props.task.roadmap_id }
        });
        props.tasks = props.tasks.filter((p) => p.id !== props.task.id);
        props.deleteTasksStateUpdate(props.task.id);
        deleteAssignedTaskByTask({ variables: { taskId: props.task.id } });
        proxy.writeQuery({ query: FETCH_TASKS_QUERY, data, variables: { roadmapId: props.task.roadmap_id } });
    }

    const deleteMyTaskScreen = () => {
        deleteAssignedTaskByTask({ variables: { taskId: props.task.id } });
        props.deleteTasksStateUpdate(props.task.id);
    }

    const deleteCreatedByMeScreen = (proxy) => {
        const data = proxy.readQuery({
            query: FETCH_TASKS_CREATEDBY_QUERY,
            variables: { createdBy: sime.user.id }
        });
        props.tasks = props.tasks.filter((p) => p.id !== props.task.id);
        props.deleteTasksStateUpdate(props.task.id);
        deleteAssignedTaskByTask({ variables: { taskId: props.task.id } });
        proxy.writeQuery({ query: FETCH_TASKS_CREATEDBY_QUERY, data, variables: { createdBy: sime.user.id } });
    }

    const [deleteTask, { loading: loadingDelete }] = useMutation(DELETE_TASK, {
        update(proxy) {
            props.taskScreen ? deleteTaskScreen(proxy) : props.createdByMe ? deleteCreatedByMeScreen(proxy) : deleteMyTaskScreen();
        },
        variables: {
            taskId: props.task.id
        }
    });

    const onDeleteTask = () => {
        closeModal();
        deleteTask();
    }

    const deleteHandler = () => {
        Alert.alert('Are you sure?', 'Do you really want to delete this task?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: onDeleteTask
            }
        ]);
    };

    const closeModal = () => {
        setVisible(false);
    }

    const openModal = () => {
        setVisible(true);
    }


    const onPressCheck = (event) => {
        event.preventDefault();
        setCompletedValue({ ...completedValue, completed: !completedValue.completed, completed_date: new Date() });
        completedTask();
    }

    function durationAsString(start, end) {
        const duration = moment.duration(moment(end).diff(moment(start)));
        //Get Days
        const days = Math.floor(duration.asDays()); // .asDays returns float but we are interested in full days only
        const daysFormatted = days ? `${days} Days ` : ''; // if no full days then do not display it at all

        //Get Hours
        const hours = duration.hours();
        const hoursFormatted = `${hours} Hours `;

        //Get Minutes
        const minutes = duration.minutes();
        const minutesFormatted = `${minutes} Minutes`;

        return [daysFormatted, hoursFormatted, minutesFormatted].join('');
    }

    const nowDate = new Date();
    const dueDate = new Date(props.task.due_date)

    useEffect(() => {
        if (props.task.due_date !== '') {
            if (dueDate > nowDate) {
                setDue_date(moment(props.task.due_date).format('ddd, MMM D YYYY h:mm a'));
            } else {
                setDue_date(durationAsString(props.task.due_date, nowDate));
            }
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.task.due_date])

    useEffect(() => {
        if (props.task.completed_date !== '') {
            setCompleted_date(moment(props.task.completed_date).format('ddd, MMM D YYYY h:mm a'))
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.task.completed_date])

    return (
        <Provider theme={theme}>
            <View style={{
                ...styles.container, ...{
                    borderTopLeftRadius: props.radiusZero ? 0 : 4,
                    borderBottomLeftRadius: props.radiusZero ? 0 : 4,
                    marginVertical: props.radiusZero ? 0 : 5,
                }
            }}>
                <View style={{
                    ...styles.taskContainer, ...{
                        borderTopLeftRadius: props.radiusZero ? 0 : 4,
                        borderBottomLeftRadius: props.radiusZero ? 0 : 4,
                        backgroundColor:
                            props.task.priority === "high" ? "#ff4943" :
                                props.task.priority === "medium" ? "#a3cd3b" :
                                    props.task.priority === "low" ? "#ffc916" : "#e2e2e2",
                    }
                }}>
                    <View style={styles.checkTask}>
                        {
                            sime.user_type === "Organization"
                                || userPersonInCharge.order === '1'
                                || userPersonInCharge.order === '2'
                                || userPersonInCharge.order === '3'
                                || userPersonInCharge.order === '6' && userPersonInCharge.committee_id === committeeId
                                || userPersonInCharge.order === '7' && userPersonInCharge.committee_id === committeeId
                                || checkAssignedTask.length > 0 ?
                                <Checkbox
                                    onPress={onPressCheck}
                                    status={props.task.completed ? 'checked' : 'unchecked'}
                                    color="white"
                                    uncheckedColor="white" />
                                :
                                <Checkbox
                                    disabled={true}
                                    status={props.task.completed ? 'checked' : 'unchecked'}
                                    color="white"
                                    uncheckedColor="white" />
                        }
                    </View>
                    <TouchableCmp onPress={openModal}>
                        <View style={{
                            ...styles.task, ...{
                                borderTopRightRadius: props.radiusZero ? 0 : 4,
                                borderBottomRightRadius: props.radiusZero ? 0 : 4,
                            }
                        }}>
                            <View>
                                <Subheading style={{ ...styles.nameTask, ...{ textDecorationLine: props.task.completed ? 'line-through' : 'none', opacity: props.task.completed ? 0.6 : 1 } }}>{props.task.name}</Subheading>
                                {props.task.completed ?
                                    <Caption style={{ ...styles.statusTask, ...{ opacity: props.task.completed ? 0.6 : 1 } }}>{"Completed on " + completed_date}</Caption>
                                    :
                                    dueDate > nowDate ?
                                        <Caption style={{ ...styles.statusTask, ...{ opacity: props.task.completed ? 0.6 : 1 } }}>{"Due on " + due_date}</Caption>
                                        :
                                        dueDate < nowDate ?
                                            <Caption style={{ ...styles.statusTask, ...{ opacity: props.task.completed ? 0.6 : 1, color: theme.colors.error } }}>{"Overdue by " + due_date}</Caption> :
                                            null}
                            </View>
                            <View style={styles.taskSub}>
                                <View style={{ ...styles.people, ...{ opacity: props.task.completed ? 0.6 : 1 } }}>
                                    <Icon name="account-multiple" size={16} color="grey" />
                                    <Caption style={{ marginLeft: 3 }}>{filterAssignedTask.length}</Caption>
                                </View>
                            </View>
                        </View>
                    </TouchableCmp>
                </View>
            </View>
            <TaskModal
                visible={visible}
                closeButton={closeModal}
                taskId={props.task.id}
                roadmapId={props.task.roadmap_id}
                eventId={props.task.event_id}
                projectId={props.task.project_id}
                committeeId={committeeId}
                name={props.task.name}
                assignedTasks={filterAssignedTask}
                checkAssignedTask={checkAssignedTask}
                personInCharges={props.personInCharges}
                userPersonInCharge={userPersonInCharge}
                committee={props.committee}
                roadmap={props.roadmap}
                createdBy={props.task.createdBy}
                createdAt={props.task.createdAt}
                completed={props.task.completed}
                checkButton={onPressCheck}
                deleteButton={deleteHandler}
                updateTasksStateUpdate={props.updateTasksStateUpdate}
                task={props.task}
                deleteAssignedTasksStateUpdate={props.deleteAssignedTasksStateUpdate}
                assignedTasksStateUpdate={props.assignedTasksStateUpdate}
            />
            <LoadingModal loading={loadingDelete} />
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        backgroundColor: 'white',
        elevation: 3,
        borderBottomLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4
    },
    taskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4
    },
    task: {
        flex: 1,
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingVertical: 10,
        borderBottomRightRadius: 4,
    },
    taskSub: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    comment: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    people: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    nameTask: {
        fontWeight: 'bold',
        color: 'black'
    },
    statusTask: {

    },
    checkTask: {
        marginHorizontal: 5
    }

});


export default Task;