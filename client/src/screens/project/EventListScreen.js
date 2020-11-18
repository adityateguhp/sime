import React, { useContext, useState, useEffect } from 'react';
import { FlatList, Alert, StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Platform, RefreshControl, ScrollView } from 'react-native';
import { Provider, Portal, Title, Text, Snackbar } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';

import FABbutton from '../../components/common/FABbutton';
import FormEvent from '../../components/project/FormEvent';
import FormEditEvent from '../../components/project/FormEditEvent';
import EventCard from '../../components/event/EventCard';
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';
import {
    FETCH_EVENTS_QUERY,
    FETCH_EVENT_QUERY,
    DELETE_EVENT,
    CANCEL_EVENT_MUTATION,
    FETCH_PROJECT_QUERY
} from '../../util/graphql';

const EventListScreen = ({ route, navigation }) => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const [visibleDelete, setVisibleDelete] = useState(false);

    const onToggleSnackBarDelete = () => setVisibleDelete(!visibleDelete);

    const onDismissSnackBarDelete = () => setVisibleDelete(false);


    const [visibleCancel, setVisibleCancel] = useState(false);

    const onToggleSnackBarCancel = () => setVisibleCancel(!visibleCancel);

    const onDismissSnackBarCancel = () => setVisibleCancel(false);


    const [visibleActivate, setVisibleActivate] = useState(false);

    const onToggleSnackBarActivate = () => setVisibleActivate(!visibleActivate);

    const onDismissSnackBarActivate = () => setVisibleActivate(false);


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

    const { data: events, error: error1, loading: loading1, refetch,  } = useQuery(
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
    const [cancelValue, setCancelValues] = useState({
        eventId: '',
        cancel: false
    });

    useEffect(() => {
        if (event) setEventVal(event.getEvent);
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

    const longPressHandler = (id, name, cancel) => {
        setVisible(true);
        sime.setEvent_name(name);
        sime.setEvent_id(id);
        setCancelValues({ cancel: cancel, eventId: id })
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

    const [deleteEvent] = useMutation(DELETE_EVENT, {
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

    const [cancelEvent, { loading }] = useMutation(CANCEL_EVENT_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_EVENTS_QUERY,
                variables: { projectId: sime.project_id }
            });
            cancelEventsStateUpdate(result.data.cancelEvent);
            proxy.writeQuery({ query: FETCH_EVENTS_QUERY, data, variables: { projectId: sime.project_id } });
            closeModal();
        },
        onError(err) {
            console.log(err)
            return err;
        },
        variables: { ...cancelValue, cancel: !cancelValue.cancel }
    });

    const onCancel = (event) => {
        event.preventDefault();
        cancelEvent();
    };

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

    const cancelEventsStateUpdate = (e) => {
        const temp = [...eventsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e.id);
        temp[index] = e
        setEventsValue(temp)
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
                { sime.user_type === "Organization" || sime.order === '1' || sime.order === '2' || sime.order === '3' ?
                    <FABbutton Icon="plus" label="event" onPress={openForm} />
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
                >
                    Event deleted!
            </Snackbar>
                <Snackbar
                    visible={visibleAdd}
                    onDismiss={onDismissSnackBarAdd}
                >
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
                        cancel={itemData.item.cancel}
                        picture={itemData.item.picture}
                        onSelect={() => {
                            selectItemHandler(itemData.item.id, itemData.item.name);
                        }}
                        onLongPress={() => { longPressHandler(itemData.item.id, itemData.item.name, itemData.item.cancel) }}
                    >
                    </EventCard>
                )}
            />
            { sime.user_type === "Organization" || sime.order === '1' || sime.order === '2' || sime.order === '3' ?
                <Portal>
                    <Modal
                        useNativeDriver={true}
                        isVisible={visible}
                        animationIn="zoomIn"
                        animationOut="zoomOut"
                        onBackButtonPress={closeModal}
                        onBackdropPress={closeModal}
                        statusBarTranslucent>
                        <View style={styles.modalView}>
                            <Title style={{ marginTop: wp(4), marginHorizontal: wp(5), marginBottom: 5, fontSize: wp(4.86) }} numberOfLines={1} ellipsizeMode='tail'>{sime.event_name}</Title>
                            <TouchableCmp onPress={openFormEdit}>
                                <View style={styles.textView}>
                                    <Text style={styles.text}>Edit</Text>
                                </View>
                            </TouchableCmp>
                            {
                                cancelValue.cancel ?
                                    <TouchableCmp onPress={onToggleSnackBarActivate} onPressIn={onCancel}>
                                        <View style={styles.textView}>
                                            <Text style={styles.text}>Active event</Text>
                                        </View>
                                    </TouchableCmp>
                                    :
                                    <TouchableCmp onPress={onToggleSnackBarCancel} onPressIn={onCancel}>
                                        <View style={styles.textView}>
                                            <Text style={styles.text}>Cancel event</Text>
                                        </View>
                                    </TouchableCmp>
                            }
                            <TouchableCmp onPress={deleteHandler}>
                                <View style={styles.textView}>
                                    <Text style={styles.text}>Delete event</Text>
                                </View>
                            </TouchableCmp>
                        </View>
                    </Modal>
                    <FABbutton Icon="plus" label="event" onPress={openForm} />
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
                    >
                        Event deleted!
            </Snackbar>
                    <Snackbar
                        visible={visibleCancel}
                        onDismiss={onDismissSnackBarCancel}
                    >
                        Event canceled!
            </Snackbar>
                    <Snackbar
                        visible={visibleActivate}
                        onDismiss={onDismissSnackBarActivate}
                    >
                        Event activated!
            </Snackbar>
                    <Snackbar
                        visible={visibleAdd}
                        onDismiss={onDismissSnackBarAdd}
                    >
                        Event added!
            </Snackbar>
                    <Snackbar
                        visible={visibleUpdate}
                        onDismiss={onDismissSnackBarUpdate}
                    >
                        Event updated!
            </Snackbar>
                </Portal> : null}
        </Provider>
    );
}

const modalMenuWidth = wp(77);
const modalMenuHeight = wp(46.5);

const styles = StyleSheet.create({
    screen: {
        marginTop: 5
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalView: {
        backgroundColor: 'white',
        height: modalMenuHeight,
        width: modalMenuWidth,
        alignSelf: 'center',
        justifyContent: 'flex-start'
    },
    textView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        marginBottom: 5
    },
    text: {
        marginLeft: wp(5.6),
        fontSize: wp(3.65)
    }
});

export default EventListScreen;