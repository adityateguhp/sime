import React, { useContext, useState } from 'react';
import { FlatList, Alert, StyleSheet, View, Dimensions, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Provider, Portal, Title, Text } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import FABbutton from '../../components/common/FABbutton';
import FormEvent from '../../components/event/FormEvent';
import { EVENTS } from '../../data/dummy-data';
import EventCard from '../../components/event/EventCard';
import { SimeContext } from '../../provider/SimePovider';
import Colors from '../../constants/Colors';
import {theme} from '../../constants/Theme';

const EventListScreen = ({ route, navigation }) => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const Event = EVENTS.filter(
        evnt => evnt.project_id.indexOf(sime.project_id) >= 0
    );

    const selectItemHandler = (_id, event_name) => {
        navigation.navigate('Event Detail');
        sime.setEvent_id(_id);
        sime.setEvent_name(event_name);
    };

    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);

    const closeModal = () => {
        setVisible(false);
    }

    const closeModalForm = () => {
        setVisibleForm(false);
    }

    const longPressHandler = (event_name) => {
        setVisible(true);
        sime.setEvent_name(event_name)
    }

    const openForm = () => {
        setVisibleForm(true);
    }

    const deleteHandler = () => {
        setVisible(false);
        Alert.alert('Are you sure?', 'Do you really want to delete this event?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive'
            }
        ]);
    };

    const editEventHandler = id => {
        navigation.navigate('EditEvent', { eventId: id });
    };

    if (Event.length === 0) {
        return (
            <View style={styles.content}>
                <Text>No events found, let's add events!</Text>
            </View>
        );
    }

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                data={Event}
                keyExtractor={item => item._id}
                renderItem={itemData => (
                    <EventCard
                        event_name={itemData.item.event_name}
                        event_start_date={itemData.item.event_start_date}
                        event_end_date={itemData.item.event_end_date}
                        cancel={itemData.item.cancel}
                        picture={itemData.item.picture}
                        onSelect={() => {
                            selectItemHandler(itemData.item._id, itemData.item.event_name);
                        }}
                        onLongPress={() => { longPressHandler(itemData.item.event_name) }}
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
                        <TouchableCmp>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Edit</Text>
                            </View>
                        </TouchableCmp>
                        <TouchableCmp>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Cancel event</Text>
                            </View>
                        </TouchableCmp>
                        <TouchableCmp onPress={deleteHandler}>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Delete event</Text>
                            </View>
                        </TouchableCmp>
                    </View>
                </Modal>
            </Portal>
            <FABbutton Icon="plus"  label="event" onPress={openForm} />
            <FormEvent 
            closeModalForm={closeModalForm} 
            visibleForm={visibleForm} 
            deleteButton={deleteHandler}
            closeButton={closeModalForm}
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