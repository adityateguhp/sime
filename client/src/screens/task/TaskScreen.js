import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, ScrollView } from 'react-native';
import { Divider, Provider, Text, Snackbar } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';

import FABbutton from '../../components/common/FABbutton';
import FormTask from '../../components/task/FormTask';
import { SimeContext } from '../../context/SimePovider';
import Task from '../../components/task/Task';
import { theme } from '../../constants/Theme';
import {
    FETCH_TASKS_QUERY,
    FETCH_PICS_QUERY,
    FETCH_COMMITTEES_QUERY,
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
    const [personInChargesValue, setPersonInChargesValue] = useState([]);
    const [committeesValue, setCommitteesValue] = useState([]);
    const [roadmapValue, setRoadmapValue] = useState(null);

    const { data: personInCharges, error: errorPersonInCharges, loading: loadingPersonInCharges, refetch: refetchPersonInCharges } = useQuery(
        FETCH_PICS_QUERY,
        {
            variables: { projectId: sime.project_id },
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

    const { data: committees, error: errorCommittees, loading: loadingCommittees, refetch: refetchCommittees } = useQuery(
        FETCH_COMMITTEES_QUERY,
        {
            variables: { projectId: sime.project_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setCommitteesValue(committees.getCommittees) }
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
        refetchPersonInCharges();
        refetchCommittees();
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

    if (errorPersonInCharges) {
        console.error(errorPersonInCharges);
        return <Text>errorPersonInCharges</Text>;
    }

    if (errorRoadmap) {
        console.error(errorRoadmap);
        return <Text>errorRoadmap</Text>;
    }

    if (errorCommittees) {
        console.error(errorCommittees);
        return <Text>errorCommittees</Text>;
    }


    if (tasksValue.length === 0) {
        return (
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingTasks && loadingPersonInCharges && loadingRoadmap && loadingCommittees}
                        onRefresh={onRefresh} />
                }
            >
                <Text>No tasks found, let's add tasks!</Text>
                <FABbutton Icon="plus" onPress={openForm} />
                <FormTask
                    closeModalForm={closeModalForm}
                    visibleForm={visibleForm}
                    closeButton={closeModalForm}
                    addTasksStateUpdate={addTasksStateUpdate}
                />
                <Snackbar
                    visible={visibleAdd}
                 onDismiss={onDismissSnackBarAdd}
                action={{
                    label: 'dismiss',
                    onPress: () => {
                        onDismissSnackBarAdd();
                    },
                  }}>
                    Task added!
            </Snackbar>
                <Snackbar
                    visible={visibleDelete}
                    onDismiss={onDismissSnackBarDelete}
                action={{
                    label: 'dismiss',
                    onPress: () => {
                        onDismissSnackBarDelete();
                    },
                  }}>
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
                        refreshing={loadingTasks && loadingPersonInCharges && loadingRoadmap && loadingCommittees}
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
                        personInCharges={personInChargesValue}
                        committees={committeesValue}
                        task={itemData.item}
                        completedTasksStateUpdate={completedTasksStateUpdate}
                        deleteTasksStateUpdate={deleteTasksStateUpdate}
                        updateTasksStateUpdate={updateTasksStateUpdate}
                        roadmap={roadmapValue}
                        onRefresh={onRefresh}
                        taskScreen={true}
                    >
                    </Task>
                )}
            />
            <FABbutton Icon="plus" onPress={openForm} />
            <FormTask
                closeModalForm={closeModalForm}
                visibleForm={visibleForm}
                closeButton={closeModalForm}
                addTasksStateUpdate={addTasksStateUpdate}
            />
            <Snackbar
                visible={visibleAdd}
             onDismiss={onDismissSnackBarAdd}
                action={{
                    label: 'dismiss',
                    onPress: () => {
                        onDismissSnackBarAdd();
                    },
                  }}>
                Task added!
            </Snackbar>
            <Snackbar
                visible={visibleDelete}
               onDismiss={onDismissSnackBarDelete}
                action={{
                    label: 'dismiss',
                    onPress: () => {
                        onDismissSnackBarDelete();
                    },
                  }}>
                Task deleted!
            </Snackbar>
            <Snackbar
                visible={visibleUpdate}
                onDismiss={onDismissSnackBarUpdate}
                action={{
                    label: 'dismiss',
                    onPress: () => {
                        onDismissSnackBarUpdate();
                    },
                  }}>
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