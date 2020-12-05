import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, ScrollView } from 'react-native';
import { Divider, Provider, Text, Snackbar, Portal } from 'react-native-paper';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';

import FABbutton from '../../components/common/FABbutton';
import FormTask from '../../components/task/FormTask';
import { SimeContext } from '../../context/SimePovider';
import Task from '../../components/task/Task';
import { theme } from '../../constants/Theme';
import {
    FETCH_TASKS_QUERY,
    FETCH_PICS_QUERY,
    FETCH_COMMITTEE_QUERY,
    FETCH_ROADMAP_QUERY,
    FETCH_ASSIGNED_TASKS_QUERY,
    FETCH_PIC_QUERY
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
    const [personInChargeValue, setPersonInChargeValue] = useState([]);
    const [committeeValue, setCommitteeValue] = useState(null);
    const [roadmapValue, setRoadmapValue] = useState(null);
    const [assignedTasksValue, setAssignedTasksValue] = useState([]);

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

    const [loadPic, { data: personInCharge, error: errorPersonInCharge, loading: loadingPersonInCharge }] = useLazyQuery(
        FETCH_PIC_QUERY,
        {
            variables: { personInChargeId: sime.userPersonInChargeId },
            notifyOnNetworkStatusChange: true
        }
    );

    useEffect(() => {
        if (sime.user_type !== "Organization") {
            loadPic();
            if (personInCharge) {
                setPersonInChargeValue(personInCharge.getPersonInCharge)
            }
        }
    }, [sime.user_type, personInCharge])

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



    const { data: assignedTasks, error: errorAssignedTasks, loading: loadingAssignedTasks, refetch: refetchAssignedTasks } = useQuery(
        FETCH_ASSIGNED_TASKS_QUERY,
        {
            variables: { roadmapId: sime.roadmap_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setAssignedTasksValue(assignedTasks.getAssignedTasks) }
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

    const { data: committee, error: errorCommittee, loading: loadingCommittee, refetch: refetchCommittee } = useQuery(
        FETCH_COMMITTEE_QUERY,
        {
            variables: { committeeId: sime.committee_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                if (committee.getCommittee) {
                    setCommitteeValue(committee.getCommittee)
                } else {
                    setCommitteeValue(sime.committee_id)
                }
            }
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
        refetchCommittee();
        refetchRoadmap();
        refetchAssignedTasks();
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

    if (errorCommittee) {
        console.error(errorCommittee);
        return <Text>errorCommittee</Text>;
    }

    if (errorAssignedTasks) {
        console.error(errorAssignedTasks);
        return <Text>errorAssignedTasks</Text>;
    }

    if (errorPersonInCharge) {
        console.error(errorPersonInCharge);
        return <Text>errorPersonInCharge</Text>;
    }


    if (tasksValue.length === 0) {
        return (
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingTasks && loadingPersonInCharges && loadingRoadmap && loadingCommittee && loadingAssignedTasks && loadingPersonInCharge}
                        onRefresh={onRefresh} />
                }
            >
                <Text>No tasks found, let's add tasks!</Text>
                {  sime.user_type === "Organization"
                    || sime.user_type === 'Staff' && sime.order === '1'
                    || sime.user_type === 'Staff' && sime.order === '2'
                    || sime.user_type === 'Staff' && sime.order === '3'
                    || sime.user_type === 'Staff' && sime.order === '6' && sime.userPicCommittee === sime.committee_id
                    || sime.user_type === 'Staff' && sime.order === '7' && sime.userPicCommittee === sime.committee_id ?
                    <FABbutton Icon="plus" onPress={openForm} /> : null}
                <FormTask
                    closeModalForm={closeModalForm}
                    visibleForm={visibleForm}
                    closeButton={closeModalForm}
                    addTasksStateUpdate={addTasksStateUpdate}
                />
                <Portal>
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
                </Portal>
            </ScrollView>
        );
    }

    return (
        <Provider theme={theme}>
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={loadingTasks && loadingPersonInCharges && loadingRoadmap && loadingCommittee && loadingPersonInCharge}
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
                        userPersonInCharge={personInChargeValue}
                        committee={committeeValue}
                        assignedTasks={assignedTasksValue}
                        task={itemData.item}
                        completedTasksStateUpdate={completedTasksStateUpdate}
                        deleteTasksStateUpdate={deleteTasksStateUpdate}
                        updateTasksStateUpdate={updateTasksStateUpdate}
                        assignedTasksStateUpdate={assignedTasksStateUpdate}
                        deleteAssignedTasksStateUpdate={deleteAssignedTasksStateUpdate}
                        roadmap={roadmapValue}
                        taskScreen={true}
                        createdByMe={false}
                    >
                    </Task>
                )}
            />
            {  sime.user_type === "Organization"
                || sime.user_type === 'Staff' && sime.order === '1'
                || sime.user_type === 'Staff' && sime.order === '2'
                || sime.user_type === 'Staff' && sime.order === '3'
                || sime.user_type === 'Staff' && sime.order === '6' && sime.userPicCommittee === sime.committee_id
                || sime.user_type === 'Staff' && sime.order === '7' && sime.userPicCommittee === sime.committee_id ?
                <FABbutton Icon="plus" onPress={openForm} /> : null}
            <FormTask
                closeModalForm={closeModalForm}
                visibleForm={visibleForm}
                closeButton={closeModalForm}
                addTasksStateUpdate={addTasksStateUpdate}
            />
            <Portal>
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
            </Portal>
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