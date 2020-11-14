import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, ScrollView } from 'react-native';
import { Divider, Provider, Text, Snackbar } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';

import FABbutton from '../../components/common/FABbutton';
import FormTask from '../../components/event/FormTask';
import { SimeContext } from '../../context/SimePovider';
import Task from '../../components/event/Task';
import { theme } from '../../constants/Theme';
import {
    FETCH_TASKS_QUERY,
    FETCH_COMMITTEES_QUERY,
    FETCH_DIVISIONS_QUERY,
    FETCH_ROADMAP_QUERY
} from '../../util/graphql';


const TaskScreen = ({ navigation }) => {
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
    const [divisionsValue, setDivisionsValue] = useState([]);
    const [roadmapValue, setRoadmapValue] = useState(null);

    const { data: committees, error: errorCommittees, loading: loadingCommittees, refetch: refetchCommittees } = useQuery(
        FETCH_COMMITTEES_QUERY,
        {
            variables: { projectId: sime.project_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                committees.getCommittees.sort(function (a, b) {
                    var textA = a.order;
                    var textB = b.order;

                    return textA.localeCompare(textB)
                });
                setCommitteesValue(committees.getCommittees)
            }
        }
    );

    const { data: tasks, error: errorTasks, loading: loadingTasks, refetch } = useQuery(
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

    const { data: roadmap, error: errorRoadmap, loading: loadingRoadmap, refetch: refetchRoadmap } = useQuery(
        FETCH_ROADMAP_QUERY,
        {
            variables: { roadmapId: sime.roadmap_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setRoadmapValue(roadmap.getRoadmap)
            }
        });

    const { data: divisions, error: errorDivisions, loading: loadingDivisions, refetch: refetchDivisions } = useQuery(
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
        refetchDivisions();
        refetchRoadmap();
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

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

    let incompletedTask = tasksValue.filter((t) => t.completed === false);

    let completedTask = tasksValue.filter((t) => t.completed === true);

    if (errorTasks) {
        console.error(errorTasks);
        return <Text>errorTasks</Text>;
    }

    if (errorCommittees) {
        console.error(errorCommittees);
        return <Text>errorCommittees</Text>;
    }

    if (errorRoadmap) {
        console.error(errorRoadmap);
        return <Text>errorRoadmap</Text>;
    }

    if (errorDivisions) {
        console.error(errorDivisions);
        return <Text>errorDivisions</Text>;
    }


    if (tasksValue.length === 0) {
        return (
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingTasks && loadingCommittees && loadingRoadmap && loadingDivisions}
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

    return (
        <Provider theme={theme}>
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={loadingTasks && loadingCommittees && loadingRoadmap && loadingDivisions}
                        onRefresh={onRefresh} />
                }
                ListHeaderComponentStyle={styles.screen}
                data={tasksValue}
                keyExtractor={item => item.id}
                ListHeaderComponent={
                    <View style={styles.taskStatusContainer}>
                        <View style={styles.incompleted}>
                            <Text style={styles.textStatus}>Incompleted: {incompletedTask.length} Tasks</Text>
                        </View>
                        <Divider style={[styles.dividerStatus, {
                            transform: [
                                { rotate: "90deg" }
                            ]
                        }]} />
                        <View style={styles.completed}>
                            <Text style={styles.textStatus}>Completed: {completedTask.length} Tasks</Text>
                        </View>
                    </View>
                }
                renderItem={itemData => (
                    <Task
                        tasks={tasksValue}
                        committees={committeesValue}
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
                        priority={itemData.item.priority}
                        completed_date={itemData.item.completed_date}
                        createdAt={itemData.item.createdAt}
                        createdBy={itemData.item.createdBy}
                        roadmap={roadmapValue}
                        onRefresh={onRefresh}
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
    incompleted: {
        backgroundColor: 'white',
        marginLeft: 40,
        marginVertical: 10
    },
    completed: {
        backgroundColor: 'white',
        marginRight: 40,
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