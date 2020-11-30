import React, { useContext, useState, useEffect } from 'react';
import { FlatList, Alert, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { Provider, Portal, Text, Snackbar } from 'react-native-paper';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';

import FABbutton from '../../components/common/FABbutton';
import FormEvent from '../../components/event/FormEvent';
import FormEditEvent from '../../components/event/FormEditEvent';
import EventCard from '../../components/event/EventCard';
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';
import {
    FETCH_EVENTS_QUERY,
    FETCH_EVENT_QUERY,
    DELETE_EVENT,
    FETCH_PROJECT_QUERY
} from '../../util/graphql';
import LoadingModal from '../../components/common/LoadingModal';
import OptionModal from '../../components/common/OptionModal';

const EventListScreen = ({ route, navigation }) => {

    const sime = useContext(SimeContext);

    const [visibleDelete, setVisibleDelete] = useState(false);

    const onToggleSnackBarDelete = () => setVisibleDelete(!visibleDelete);

    const onDismissSnackBarDelete = () => setVisibleDelete(false);


    const [visibleAdd, setVisibleAdd] = useState(false);

    const onToggleSnackBarAdd = () => setVisibleAdd(!visibleAdd);

    const onDismissSnackBarAdd = () => setVisibleAdd(false);


    const [visibleUpdate, setVisibleUpdate] = useState(false);

    const onToggleSnackBarUpdate = () => setVisibleUpdate(!visibleUpdate);

    const onDismissSnackBarUpdate = () => setVisibleUpdate(false);


    const [eventsValue, setEventsValue] = useState([]);
    const [projectValue, setProjectValue] = useState(null);

    const selectItemHandler = (_id, event_name) => {
        navigation.navigate('Event Detail');
        sime.setEvent_id(_id);
        sime.setEvent_name(event_name);
    };

    const { data: events, error: error1, loading: loading1, refetch, } = useQuery(
        FETCH_EVENTS_QUERY,
        {
            variables: { projectId: sime.project_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setEventsValue(events.getEvents)
            }
        }
    );

    const { data: project, error: error3, loading: loading3, refetch: refetchProject } = useQuery(
        FETCH_PROJECT_QUERY,
        {
            variables: { projectId: sime.project_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setProjectValue(project.getProject)
            }
        });

    const [loadExistData, { called, data: event, error: error2 }] = useLazyQuery(
        FETCH_EVENT_QUERY,
        {
            variables: { eventId: sime.event_id }
        });

    const [eventVal, setEventVal] = useState(null);
    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);

    useEffect(() => {
        if (event) setEventVal(event.getEvent);
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [event])

    const closeModal = () => {
        setVisible(false);
    }

    const closeModalForm = () => {
        setVisibleForm(false);
    }

    const closeModalFormEdit = () => {
        setVisibleFormEdit(false);
    }

    const longPressHandler = (id, name) => {
        setVisible(true);
        sime.setEvent_name(name);
        sime.setEvent_id(id);
        loadExistData();
    }

    const openForm = () => {
        setVisibleForm(true);
    }

    const openFormEdit = () => {
        closeModal();
        setVisibleFormEdit(true);
    }

    const deleteHandler = () => {
        closeModal();
        closeModalFormEdit();
        Alert.alert('Are you sure?', 'Do you really want to delete this event?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: deleteEvent
            }
        ]);
    };

    const eventId = sime.event_id;

    const [deleteEvent, { loading: loadingDelete }] = useMutation(DELETE_EVENT, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_EVENTS_QUERY,
                variables: { projectId: sime.project_id }
            });
            events.getEvents = events.getEvents.filter((e) => e.id !== eventId);
            deleteEventsStateUpdate(eventId)
            proxy.writeQuery({ query: FETCH_EVENTS_QUERY, data, variables: { projectId: sime.project_id } });
        },
        variables: {
            eventId
        }
    });

    const addEventsStateUpdate = (e) => {
        setEventsValue([e, ...eventsValue]);
        onToggleSnackBarAdd();
    }

    const deleteEventsStateUpdate = (e) => {
        const temp = [...eventsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e);
        temp.splice(index, 1);
        setEventsValue(temp);
        onToggleSnackBarDelete();
    }

    const updateEventsStateUpdate = (e) => {
        const temp = [...eventsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e.id);
        temp[index] = e;
        setEventsValue(temp);
        onToggleSnackBarUpdate();
    }

    const updateEventStateUpdate = (e) => {
        setEventVal(e)
    }

    const onRefresh = () => {
        refetch();
        refetchProject();
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

    if (error3) {
        console.error(error3);
        return <Text>Error</Text>;
    }

    if (called & error2) {
        console.error(error2);
        return <Text>Error</Text>;
    }

    if (eventsValue.length === 0) {
        return (
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={loading1 && loading3}
                        onRefresh={onRefresh} />
                }
            >
                <Text>No events found, let's add events!</Text>
                { sime.user_type === "Organization" || sime.user_type === 'Staff' && sime.order === '1' || sime.user_type === 'Staff' && sime.order === '2' || sime.user_type === 'Staff' && sime.order === '3' ?
                    <FABbutton Icon="plus" onPress={openForm} />
                    : null
                }
                <FormEvent
                    closeModalForm={closeModalForm}
                    visibleForm={visibleForm}
                    closeButton={closeModalForm}
                    addEventsStateUpdate={addEventsStateUpdate}
                    project={projectValue}
                />
                <Snackbar
                    visible={visibleDelete}
                    onDismiss={onDismissSnackBarDelete}
                    action={{
                        label: 'dismiss',
                        onPress: () => {
                            onDismissSnackBarDelete();
                        },
                    }}>
                    Event deleted!
            </Snackbar>
                <Snackbar
                    visible={visibleAdd}
                    onDismiss={onDismissSnackBarAdd}
                    action={{
                        label: 'dismiss',
                        onPress: () => {
                            onDismissSnackBarAdd();
                        },
                    }}>
                    Event added!
            </Snackbar>
            </ScrollView>
        );
    }

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                data={eventsValue}
                refreshControl={
                    <RefreshControl
                        refreshing={loading1 && loading3}
                        onRefresh={onRefresh} />
                }
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <EventCard
                        name={itemData.item.name}
                        start_date={itemData.item.start_date}
                        end_date={itemData.item.end_date}
                        picture={itemData.item.picture}
                        onSelect={() => {
                            selectItemHandler(itemData.item.id, itemData.item.name);
                        }}
                        onLongPress={() => { longPressHandler(itemData.item.id, itemData.item.name) }}
                    >
                    </EventCard>
                )}
            />
            { sime.user_type === "Organization" || sime.user_type === 'Staff' && sime.order === '1' || sime.user_type === 'Staff' && sime.order === '2' || sime.user_type === 'Staff' && sime.order === '3' ?
                <Provider theme={theme}>
                    <OptionModal
                        visible={visible}
                        closeModal={closeModal}
                        title={sime.event_name}
                        openFormEdit={openFormEdit}
                        deleteHandler={deleteHandler}
                    />
                    <FABbutton Icon="plus" onPress={openForm} />
                    <FormEvent
                        closeModalForm={closeModalForm}
                        visibleForm={visibleForm}
                        closeButton={closeModalForm}
                        addEventsStateUpdate={addEventsStateUpdate}
                        project={projectValue}
                    />
                    <FormEditEvent
                        closeModalForm={closeModalFormEdit}
                        visibleForm={visibleFormEdit}
                        deleteButton={deleteHandler}
                        closeButton={closeModalFormEdit}
                        event={eventVal}
                        updateEventsStateUpdate={updateEventsStateUpdate}
                        updateEventStateUpdate={updateEventStateUpdate}
                        project={projectValue}
                    />
                    <Snackbar
                        visible={visibleDelete}
                        onDismiss={onDismissSnackBarDelete}
                        action={{
                            label: 'dismiss',
                            onPress: () => {
                                onDismissSnackBarDelete();
                            },
                        }}
                    >
                        Event deleted!
                    </Snackbar>
                    <Snackbar
                        visible={visibleAdd}
                        onDismiss={onDismissSnackBarAdd}
                        action={{
                            label: 'dismiss',
                            onPress: () => {
                                onDismissSnackBarAdd();
                            },
                        }}
                    >
                        Event added!
                    </Snackbar>
                    <Snackbar
                        visible={visibleUpdate}
                        onDismiss={onDismissSnackBarUpdate}
                        action={{
                            label: 'dismiss',
                            onPress: () => {
                                onDismissSnackBarUpdate();
                            },
                        }}
                    >
                        Event updated!
                    </Snackbar>
                    <LoadingModal loading={loadingDelete} />
                </Provider> : null}
        </Provider>
    );
}

const styles = StyleSheet.create({
    screen: {
        marginTop: 5
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default EventListScreen;