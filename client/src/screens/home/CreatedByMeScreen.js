import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Provider, Text, Snackbar } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';

import { SimeContext } from '../../context/SimePovider';
import CreatedByMeContainer from '../../components/home/CreatedByMeContainer';
import { theme } from '../../constants/Theme';
import {
    FETCH_TASKS_CREATEDBY_QUERY,
} from '../../util/graphql';

const CreatedByMeScreen = ({ navigation }) => {
    const sime = useContext(SimeContext);

    const [visibleDelete, setVisibleDelete] = useState(false);

    const onToggleSnackBarDelete = () => setVisibleDelete(!visibleDelete);

    const onDismissSnackBarDelete = () => setVisibleDelete(false);


    const [visibleUpdate, setVisibleUpdate] = useState(false);

    const onToggleSnackBarUpdate = () => setVisibleUpdate(!visibleUpdate);

    const onDismissSnackBarUpdate = () => setVisibleUpdate(false);


    const [tasksCreatedByValue, setTasksCreatedByValue] = useState([]);

    const { data: tasksCreatedBy, error: error2, loading: loading2, refetch } = useQuery(
        FETCH_TASKS_CREATEDBY_QUERY,
        {
            variables: { createdBy: sime.user.id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setTasksCreatedByValue(tasksCreatedBy.getTasksCreatedBy)
            }
        });

    const completedTasksStateUpdate = (e) => {
        const temp = [...tasksCreatedByValue];
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
        setTasksCreatedByValue(temp)
    }

    const deleteTasksStateUpdate = (e) => {
        const temp = [...tasksCreatedByValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e);
        temp.splice(index, 1);
        setTasksCreatedByValue(temp);
        onToggleSnackBarDelete();
    }

    const updateTasksStateUpdate = (e) => {
        const temp = [...tasksCreatedByValue];
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
        setTasksCreatedByValue(temp);
        onToggleSnackBarUpdate();
    }

    const onRefresh = () => {
        refetch();
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    if (error2) {
        console.error(error2);
        return <Text>Error</Text>;
    }

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                refreshControl={
                    <RefreshControl
                        refreshing={loading2}
                        onRefresh={onRefresh} />
                }
                data={tasksCreatedByValue}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <CreatedByMeContainer
                        tasks={tasksCreatedByValue}
                        task={itemData.item}
                        onRefresh={onRefresh}
                        completedTasksStateUpdate={completedTasksStateUpdate}
                        deleteTasksStateUpdate={deleteTasksStateUpdate}
                        updateTasksStateUpdate={updateTasksStateUpdate}
                    />
                )}
            />
            <Snackbar
                visible={visibleUpdate}
                onDismiss={onDismissSnackBarUpdate}
            >
                Task updated!
            </Snackbar>
            <Snackbar
                visible={visibleDelete}
                onDismiss={onDismissSnackBarDelete}
            >
                Task deleted!
            </Snackbar>
        </Provider>
    );
}


const styles = StyleSheet.create({
    screen: {
        marginVertical: 5,
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

export default CreatedByMeScreen;