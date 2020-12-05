import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, RefreshControl, SectionList } from 'react-native';
import { Provider, Text, Snackbar, Portal } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';

import { SimeContext } from '../../context/SimePovider';
import AssignedToMeContainer from '../../components/my_task/AssignedToMeContainer';
import MyTaskContainer from '../../components/my_task/MyTaskContainer';
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
    const [assignedStaffTemp, seAssignedStaffTemp] = useState([]);

    const { data: assignedByStaff, error: error1, loading: loading1, refetch: refetchAssignedStaff } = useQuery(
        FETCH_ASSIGNED_TASKS_QUERY_BYSTAFF,
        {
            variables: { staffId: sime.user.id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                seAssignedStaffTemp(assignedByStaff.getAssignedTasksByStaff)
            }
        });

    useEffect(() => {
        if (assignedStaffTemp) {
            let dataSource = assignedStaffTemp.reduce(function (sections, item) {

                let section = sections.find(section => section.project_id === item.project_id);

                if (!section) {
                    section = { project_id: item.project_id, data: [] };
                    sections.push(section);
                }

                section.data.push(item);

                return sections;

            }, []);
            setAssignedStaff(dataSource)
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [assignedStaffTemp])


    const deleteStateUpdate = (e) => {
        const temp = [...assignedStaffTemp];
        const index = temp.map(function (item) {
            return item.task_id
        }).indexOf(e);
        temp.splice(index, 1);
        seAssignedStaffTemp(temp);
        let dataSource = temp.reduce(function (sections, item) {

            let section = sections.find(section => section.project_id === item.project_id);

            if (!section) {
                section = { project_id: item.project_id, data: [] };
                sections.push(section);
            }

            section.data.push(item);

            return sections;

        }, []);
        setAssignedStaff(dataSource)
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
            <SectionList
                refreshControl={
                    <RefreshControl
                        refreshing={loading1}
                        onRefresh={onRefresh} />
                }
                sections={assignedStaff}
                keyExtractor={(item, index) => item.id + index}
                renderItem={
                    ({ item, index, section }) => (
                        <AssignedToMeContainer
                            taskId={item.task_id}
                            projectId={item.project_id}
                            eventId={item.event_id}
                            roadmapId={item.roadmap_id}
                            personInChargeId={item.person_in_charge_id}
                            deleteStateUpdate={deleteStateUpdate}
                            onRefresh={onRefresh}
                            onToggleSnackBarDelete={onToggleSnackBarDelete}
                            onToggleSnackBarUpdate={onToggleSnackBarUpdate}
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

export default AssignedToMeScreen;