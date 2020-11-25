import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Provider, Text, Snackbar } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';

import { SimeContext } from '../../context/SimePovider';
import AssignedToMeContainer from '../../components/my_task/AssignedToMeContainer';
import { theme } from '../../constants/Theme';
import {
    FETCH_PICS_BYSTAFF_QUERY,
    FETCH_ASSIGNED_TASKS_QUERY_BYSTAFF
} from '../../util/graphql';


const AssignedToMeScreen = ({ navigation }) => {
    const sime = useContext(SimeContext);

    const [visibleDelete, setVisibleDelete] = useState(false);

    const onToggleSnackBarDelete = () => setVisibleDelete(!visibleDelete);

    const onDismissSnackBarDelete = () => setVisibleDelete(false);


    const [visibleUpdate, setVisibleUpdate] = useState(false);

    const onToggleSnackBarUpdate = () => setVisibleUpdate(!visibleUpdate);

    const onDismissSnackBarUpdate = () => setVisibleUpdate(false);

    const [assignedStaff, setAssignedStaff] = useState([]);

    const { data: assignedByStaff, error: error1, loading: loading1, refetch: refetchAssignedStaff } = useQuery(
        FETCH_ASSIGNED_TASKS_QUERY_BYSTAFF,
        {
            variables: { staffId: sime.user.id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setAssignedStaff(assignedByStaff.getAssignedTasksByStaff)
            }
        });

        const deleteStateUpdate = (e) => {
            const temp = [...assignedStaff];
            const index = temp.map(function (item) {
                return item.task_id
            }).indexOf(e);
            temp.splice(index, 1);
            setAssignedStaff(temp);
        }


    const onRefresh = () => {
        refetchAssignedStaff();
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    if (error1) {
        console.error(error1);
        return <Text>Error</Text>;
    }

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                refreshControl={
                    <RefreshControl
                        refreshing={loading1}
                        onRefresh={onRefresh} />
                }
                data={assignedStaff}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <AssignedToMeContainer
                        taskId={itemData.item.task_id}
                        projectId={itemData.item.project_id}
                        eventId={itemData.item.event_id}
                        roadmapId={itemData.item.roadmap_id}
                        personInChargeId={itemData.item.person_in_charge_id}
                        deleteStateUpdate={deleteStateUpdate}
                        onRefresh={onRefresh}
                        onToggleSnackBarDelete={onToggleSnackBarDelete}
                        onToggleSnackBarUpdate={onToggleSnackBarUpdate}
                    />
                )}
            />
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

export default AssignedToMeScreen;