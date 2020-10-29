import React, { useContext, useState } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, ScrollView } from 'react-native';
import { Divider, Provider, Portal, Title, Text, Snackbar } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { NetworkStatus } from '@apollo/client';

import FABbutton from '../../components/common/FABbutton';
import FormTask from '../../components/event/FormTask';
import { SimeContext } from '../../context/SimePovider';
import Task from '../../components/event/Task';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';
import { FETCH_TASKS_QUERY, FETCH_COMMITTEES_QUERY, FETCH_ASSIGNED_TASKS_QUERY, FETCH_DIVISIONS_QUERY } from '../../util/graphql';
import CenterSpinner from '../../components/common/CenterSpinner';

const TaskScreen = props => {
    const sime = useContext(SimeContext);

    const [visibleAdd, setVisibleAdd] = useState(false);

    const onToggleSnackBarAdd = () => setVisibleAdd(!visibleAdd);

    const onDismissSnackBarAdd = () => setVisibleAdd(false);


    const [visibleDelete, setVisibleDelete] = useState(false);

    const onToggleSnackBarDelete = () => setVisibleDelete(!visibleDelete);

    const onDismissSnackBarDelete = () => setVisibleDelete(false);


    const [visibleUpdate, setVisibleUpdate] = useState(false);

    const onToggleSnackBarUpdate = () => setVisibleUpdate(!visibleUpdate);

    const onDismissSnackBarUpdate = () => setVisibleUpdate(false);


    const [tasksValue, setTasksValue] = useState([]);
    const [committeesValue, setCommitteesValue] = useState([]);
    const [assignedTasksValue, setAssignedTasksValue] = useState([]);
    const [divisionsValue, setDivisionsValue] = useState([]);

    const { data: committees, error: errorCommittees, loading: loadingCommittees, refetch: refetchCommittees, networkStatus: networkStatusCommittees } = useQuery(
        FETCH_COMMITTEES_QUERY,
        {
            variables: { projectId: sime.project_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setCommitteesValue(committees.getCommittees)
            }
        }
    );

    const { data: tasks, error: errorTasks, loading: loadingTasks, refetch, networkStatus } = useQuery(
        FETCH_TASKS_QUERY,
        {
            variables: { roadmapId: sime.roadmap_id },
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


    const { data: assignedTasks, error: errorAssignedTasks, loading: loadingAssignedTasks, refetch: refetchAssignedTasks, networkStatus: networkStatusAssignedTasks } = useQuery(
        FETCH_ASSIGNED_TASKS_QUERY,
        {
            variables: { roadmapId: sime.roadmap_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setAssignedTasksValue(assignedTasks.getAssignedTasks) }
        }
    );

    const { data: divisions, error: errorDivisions, loading: loadingDivisions, refetch: refetchDivisions, networkStatus: networkStatusDivisions } = useQuery(
        FETCH_DIVISIONS_QUERY,
        {
            variables: { projectId: sime.project_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setDivisionsValue(divisions.getDivisions) }
        }
    );

    const [visibleForm, setVisibleForm] = useState(false);

    const closeModalForm = () => {
        setVisibleForm(false);
    }

    const openForm = () => {
        setVisibleForm(true);
    }

    const onRefresh = () => {
        refetch();
        refetchCommittees();
        refetchAssignedTasks();
        refetchDivisions();
    };

    const addTasksStateUpdate = (e) => {
        setTasksValue([e, ...tasksValue]);
        onToggleSnackBarAdd();
    }

    const completedTasksStateUpdate = (e) => {
        const temp = [...tasksValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e.id);
        temp[index] = e
        temp.sort(function (x, y) {
            return new Date(x.createdAt) - new Date(y.createdAt);
        }).reverse();
        temp.sort(function (x, y) {
            return Number(x.completed) - Number(y.completed);
        });
        setTasksValue(temp)
    }

    const deleteTasksStateUpdate = (e) => {
        const temp = [...tasksValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e);
        temp.splice(index, 1);
        setTasksValue(temp);
        onToggleSnackBarDelete();
    }

    const updateTasksStateUpdate = (e) => {
        const temp = [...tasksValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e.id);
        temp[index] = e
        temp.sort(function (x, y) {
            return new Date(x.createdAt) - new Date(y.createdAt);
        }).reverse();
        temp.sort(function (x, y) {
            return Number(x.completed) - Number(y.completed);
        });
        setTasksValue(temp);
        onToggleSnackBarUpdate();
    }

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

    let pendingTask = tasksValue.filter((t) => t.completed === false);

    let completeTask = tasksValue.filter((t) => t.completed === true);

    if (errorTasks) {
        console.error(errorTasks);
        return <Text>errorTasks</Text>;
    }

    if (loadingTasks) {
        return <CenterSpinner />;
    }

    if (errorCommittees) {
        console.error(errorCommittees);
        return <Text>errorCommittees</Text>;
    }
    
    if (errorDivisions) {
        console.error(errorDivisions);
        return <Text>errorDivisions</Text>;
    }

    if (loadingCommittees) {
        return <CenterSpinner />;
    }

    if (errorAssignedTasks) {
        console.error(errorAssignedTasks);
        return <Text>errorAssignedTasks</Text>;
    }

    if (loadingAssignedTasks) {
        return <CenterSpinner />;
    }

    if (loadingDivisions) {
        return <CenterSpinner />;
    }


    if (tasksValue.length === 0) {
        return (
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingTasks}
                        onRefresh={onRefresh} />
                }
            >
                <Text>No tasks found, let's add tasks!</Text>
                <FABbutton Icon="plus" label="task" onPress={openForm} />
                <FormTask
                    closeModalForm={closeModalForm}
                    visibleForm={visibleForm}
                    closeButton={closeModalForm}
                    addTasksStateUpdate={addTasksStateUpdate}
                />
                <Snackbar
                    visible={visibleAdd}
                    onDismiss={onDismissSnackBarAdd}
                >
                    Task added!
            </Snackbar>
                <Snackbar
                    visible={visibleDelete}
                    onDismiss={onDismissSnackBarDelete}
                >
                    Task deleted!
            </Snackbar>
            </ScrollView>
        );
    }

    if (networkStatus === NetworkStatus.refetch) console.log('Refetching tasks!');
    if (networkStatusCommittees === NetworkStatus.refetch) console.log('Refetching committees!');
    if (networkStatusAssignedTasks === NetworkStatus.refetch) console.log('Refetching assigned tasks!');
    if (networkStatusDivisions === NetworkStatus.refetch) console.log('Refetching head divisions!');

    return (
        <Provider theme={theme}>
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={loadingTasks}
                        onRefresh={onRefresh} />
                }
                ListHeaderComponentStyle={styles.screen}
                data={tasksValue}
                keyExtractor={item => item.id}
                ListHeaderComponent={
                    <View style={styles.taskStatusContainer}>
                        <View style={styles.pending}>
                            <Text style={styles.textStatus}>Pending: {pendingTask.length} Task</Text>
                        </View>
                        <Divider style={[styles.dividerStatus, {
                            transform: [
                                { rotate: "90deg" }
                            ]
                        }]} />
                        <View style={styles.completed}>
                            <Text style={styles.textStatus}>Completed: {completeTask.length} Task</Text>
                        </View>
                    </View>
                }
                renderItem={itemData => (
                    <Task
                        tasks={tasksValue}
                        committees={committeesValue}
                        assignedTasks={assignedTasksValue}
                        divisions={divisionsValue}
                        task={itemData.item}
                        taskId={itemData.item.id}
                        roadmapId={itemData.item.roadmap_id}
                        name={itemData.item.name}
                        due_date={itemData.item.due_date}
                        completed={itemData.item.completed}
                        roadmapId={itemData.item.roadmap_id}
                        completedTasksStateUpdate={completedTasksStateUpdate}
                        deleteTasksStateUpdate={deleteTasksStateUpdate}
                        updateTasksStateUpdate={updateTasksStateUpdate}
                        deleteAssignedTasksStateUpdate={deleteAssignedTasksStateUpdate}
                        priority={itemData.item.priority}
                        completed_date={itemData.item.completed_date}
                        createdAt={itemData.item.createdAt}
                        createdBy={itemData.item.createdBy}
                        assignedTasksStateUpdate={assignedTasksStateUpdate}
                    >
                    </Task>
                )}
            />
            <FABbutton Icon="plus" label="task" onPress={openForm} />
            <FormTask
                closeModalForm={closeModalForm}
                visibleForm={visibleForm}
                closeButton={closeModalForm}
                addTasksStateUpdate={addTasksStateUpdate}
            />
            <Snackbar
                visible={visibleAdd}
                onDismiss={onDismissSnackBarAdd}
            >
                Task added!
            </Snackbar>
            <Snackbar
                visible={visibleDelete}
                onDismiss={onDismissSnackBarDelete}
            >
                Task deleted!
            </Snackbar>
            <Snackbar
                visible={visibleUpdate}
                onDismiss={onDismissSnackBarUpdate}
            >
                Task updated!
            </Snackbar>
        </Provider>

    );
}

const styles = StyleSheet.create({
    screen: {
        marginBottom: 5
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    pending: {
        backgroundColor: 'white',
        marginLeft: 55,
        marginVertical: 10
    },
    completed: {
        backgroundColor: 'white',
        marginRight: 55,
        marginVertical: 10
    },
    taskStatusContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        elevation: 3,
    },
    dividerStatus: {
        width: 25,
        height: 1
    },
    textStatus: {
        color: 'grey'
    }
});

export default TaskScreen;