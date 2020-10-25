import React, { useContext, useState } from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
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
import { FETCH_TASKS_QUERY, FETCH_TASK_QUERY, DELETE_TASK, COMPLETED_TASK } from '../../util/graphql';
import CenterSpinner from '../../components/common/CenterSpinner';

const TaskScreen = ({ route }, props) => {
    const sime = useContext(SimeContext);


    const [visibleAdd, setVisibleAdd] = useState(false);

    const onToggleSnackBarAdd = () => setVisibleAdd(!visibleAdd);

    const onDismissSnackBarAdd = () => setVisibleAdd(false);

    const [tasksValue, setTasksValue] = useState([]);

    const { data: tasks, error: errorTasks, loading: loadingTasks, refetch, networkStatus } = useQuery(
        FETCH_TASKS_QUERY,
        {
            variables: { roadmapId: sime.roadmap_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setTasksValue(tasks.getTasks) }
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
    };

    const addTasksStateUpdate = (e) => {
        setTasksValue([e, ...tasksValue]);
        onToggleSnackBarAdd();
    }

    const headerTask = () => {
        let pendingTask = tasksValue.filter((t) => t.completed === false);
        let completeTask = tasksValue.filter((t) => t.completed === true);
        return (
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
        )
    }

    if (tasks.getTasks.length === 0) {
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
            </ScrollView>
        );
    }

    if (networkStatus === NetworkStatus.refetch) return console.log('Refetching tasks!');

    if (errorTasks) {
        console.error(errorTasks);
        return <Text>errorTasks</Text>;
    }

    if (loadingTasks) {
        return <CenterSpinner />;
    }

    return (
        <Provider theme={theme}>
            <FlatList
                ListHeaderComponentStyle={styles.screen}
                data={tasksValue}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingTasks}
                        onRefresh={onRefresh} />
                }
                keyExtractor={item => item.id}
                ListHeaderComponent={headerTask()}
                renderItem={itemData => (
                    <Task
                        name={itemData.item.name}
                        due_date={itemData.item.due_date}
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
        </Provider>

    );
}

const styles = StyleSheet.create({
    screen: {
        marginBottom: 5
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