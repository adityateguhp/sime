import React, { useContext, useState } from 'react';
import { FlatList, Alert, StyleSheet, View, Dimensions, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Provider, Portal, Title, Text } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';

import FABbutton from '../../components/common/FABbutton';
import FormEvent from '../../components/event/FormEvent';
import FormEditEvent from '../../components/event/FormEditEvent';
import EventCard from '../../components/event/EventCard';
import { SimeContext } from '../../context/SimePovider';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';
import { FETCH_EVENTS_QUERY, FETCH_EVENT_QUERY, DELETE_EVENT, CANCEL_EVENT_MUTATION } from '../../util/graphql';
import CenterSpinner from '../../components/common/CenterSpinner';

const EventListScreen = ({ route, navigation }) => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const selectItemHandler = (_id, event_name) => {
        navigation.navigate('Event Detail');
        sime.setEvent_id(_id);
        sime.setEvent_name(event_name);
    };

    const { data: events, error: error1, loading: loading1 } = useQuery(
        FETCH_EVENTS_QUERY,
        {
            variables: { projectId: sime.project_id }
        }
    );

    const [loadExistData, { called, data: event, error: error2, loading: loading2 }] = useLazyQuery(
        FETCH_EVENT_QUERY,
        {
            variables: { eventId: sime.event_id },
        });

    const [eventVal, setEventVal] = useState(null);
    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);
    const [cancelValue, setCancelValues] = useState({
        eventId: '',
        cancel: false
    });

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
        setEventVal(event.getEvent);
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

    if (error1) {
        console.error(error1);
        return <Text>Error</Text>;
    }

    if (loading1) {
        return <CenterSpinner />;
    }

    if (called & error2) {
        console.error(error2);
        return <Text>Error</Text>;
    }

    if (loading2) {

    }

    if (events.getEvents.length === 0) {
        return (
            <View style={styles.content}>
                <Text>No events found, let's add events!</Text>
                <FABbutton Icon="plus" label="event" onPress={openForm} />
                <FormEvent
                    closeModalForm={closeModalForm}
                    visibleForm={visibleForm}
                    closeButton={closeModalForm}
                />
            </View>
        );
    }

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                data={events.getEvents}
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
                        <Title style={{ marginTop: wp(4), marginHorizontal: wp(5), marginBottom: 5, fontSize: wp(4.86) }}>{sime.event_name}</Title>
                        <TouchableCmp onPress={openFormEdit}>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Edit</Text>
                            </View>
                        </TouchableCmp>
                        {
                            cancelValue.cancel === true ?
                                <TouchableCmp onPress={onCancel}>
                                    <View style={styles.textView}>
                                        <Text style={styles.text}>Active project</Text>
                                    </View>
                                </TouchableCmp>
                                :
                                <TouchableCmp onPress={onCancel}>
                                    <View style={styles.textView}>
                                        <Text style={styles.text}>Cancel project</Text>
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
            </Portal>
            <FABbutton Icon="plus" label="event" onPress={openForm} />
            <FormEvent
                closeModalForm={closeModalForm}
                visibleForm={visibleForm}
                deleteButton={deleteHandler}
                closeButton={closeModalForm}
            />
            <FormEditEvent
                closeModalForm={closeModalFormEdit}
                visibleForm={visibleFormEdit}
                deleteButton={deleteHandler}
                closeButton={closeModalFormEdit}
                event={eventVal}
            />
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