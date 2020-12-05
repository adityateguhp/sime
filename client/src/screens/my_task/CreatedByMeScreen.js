import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, SectionList, View, RefreshControl } from 'react-native';
import { Provider, Text, Snackbar, Portal } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';

import { SimeContext } from '../../context/SimePovider';
import CreatedByMeContainer from '../../components/my_task/CreatedByMeContainer';
import MyTaskContainer from '../../components/my_task/MyTaskContainer';
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
    const [tasksCreatedByValueTemp, setTasksCreatedByValueTemp] = useState([]);

    const { data: tasksCreatedBy, error: error2, loading: loading2, refetch } = useQuery(
        FETCH_TASKS_CREATEDBY_QUERY,
        {
            variables: { createdBy: sime.user.id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setTasksCreatedByValueTemp(tasksCreatedBy.getTasksCreatedBy)
            }
        });

    useEffect(() => {
        if (tasksCreatedByValueTemp) {
            let dataSource = tasksCreatedByValueTemp.reduce(function (sections, item) {

                let section = sections.find(section => section.project_id === item.project_id);

                if (!section) {
                    section = { project_id: item.project_id, data: [] };
                    sections.push(section);
                }

                section.data.push(item);

                return sections;

            }, []);
            setTasksCreatedByValue(dataSource)
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [tasksCreatedByValueTemp])

    const completedTasksStateUpdate = (e) => {
        const temp = [...tasksCreatedByValueTemp];
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
        setTasksCreatedByValueTemp(temp)
    }

    const deleteTasksStateUpdate = (e) => {
        const temp = [...tasksCreatedByValueTemp];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e);
        temp.splice(index, 1);
        setTasksCreatedByValueTemp(temp);
        let dataSource = temp.reduce(function (sections, item) {

            let section = sections.find(section => section.project_id === item.project_id);

            if (!section) {
                section = { project_id: item.project_id, data: [] };
                sections.push(section);
            }

            section.data.push(item);

            return sections;

        }, []);
        setTasksCreatedByValue(dataSource)
        onToggleSnackBarDelete();
    }

    const updateTasksStateUpdate = (e) => {
        const temp = [...tasksCreatedByValueTemp];
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
        setTasksCreatedByValueTemp(temp);
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
            <SectionList
                refreshControl={
                    <RefreshControl
                        refreshing={loading2}
                        onRefresh={onRefresh} />
                }
                sections={tasksCreatedByValue}
                keyExtractor={(item, index) => item.id + index}
                renderItem={
                    ({ item, index, section }) => (
                        <CreatedByMeContainer
                            tasks={tasksCreatedByValue}
                            task={item}
                            createdBy={item.createdBy}
                            onRefresh={onRefresh}
                            completedTasksStateUpdate={completedTasksStateUpdate}
                            deleteTasksStateUpdate={deleteTasksStateUpdate}
                            updateTasksStateUpdate={updateTasksStateUpdate}
                            navigation={navigation}
                        />
                    )
                }
                renderSectionHeader={
                    ({ section: { project_id } }) => (
                        <MyTaskContainer
                            project_id={project_id}
                            onRefresh={onRefresh}
                            navigation={navigation}
                        />
                    )
                }
                ListFooterComponent={() => (
                    <View style={{ marginTop: 7 }}></View>
                )}
            />
            <Portal>
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