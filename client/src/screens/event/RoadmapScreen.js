import React, { useContext, useState } from 'react';
import { FlatList, Alert, StyleSheet, View, Dimensions, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Provider, Portal, Title, Text } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import FABbutton from '../../components/common/FABbutton';
import { ROADMAPS } from '../../data/dummy-data';
import RoadmapCard from '../../components/event/RoadmapCard';
import FormRoadmap from '../../components/event/FormRoadmap';
import { SimeContext } from '../../provider/SimePovider';
import Colors from '../../constants/Colors';
import {theme} from '../../constants/Theme';

const RoadmapScreen = ({ route, navigation }) => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const Roadmap = ROADMAPS.filter(
        roadm => roadm.event_id.indexOf(sime.event_id) >= 0
    );

    const selectItemHandler = (_id, roadmap_name) => {
        navigation.navigate('Task Division');
        sime.setRoadmap_id(_id);
        sime.setRoadmap_name(roadmap_name);
    };

    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);

    const closeModal = () => {
        setVisible(false);
    }

    const closeModalForm = () => {
        setVisibleForm(false);
    }

    const longPressHandler = (roadmap_name) => {
        setVisible(true);
        sime.setRoadmap_name(roadmap_name)
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

    if (Roadmap.length === 0) {
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
                data={Roadmap}
                keyExtractor={item => item._id}
                renderItem={itemData => (
                    <RoadmapCard
                        roadmap_name={itemData.item.roadmap_name}
                        roadmap_start_date={itemData.item.roadmap_start_date}
                        roadmap_end_date={itemData.item.roadmap_end_date}
                        onSelect={() => {
                            selectItemHandler(itemData.item._id, itemData.item.roadmap_name);
                        }}
                        onLongPress={() => { longPressHandler(itemData.item.roadmap_name) }}
                    >
                    </RoadmapCard>
                )}
            />
            <Portal>
                <View style={styles.centeredView}>
                    <Modal useNativeDriver={true} isVisible={visible} animationIn="zoomIn" animationInTiming={100} animationOut="zoomOut" animationOutTiming={100} onBackButtonPress={closeModal} onBackdropPress={closeModal} statusBarTranslucent>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Title style={{ marginTop: wp(4), marginHorizontal: wp(5), marginBottom: 5, fontSize: wp(4.86) }}>{sime.roadmap_name}</Title>
                                <TouchableCmp>
                                    <View style={styles.textView}>
                                        <Text style={styles.text}>Edit</Text>
                                    </View>
                                </TouchableCmp>
                                <TouchableCmp onPress={deleteHandler}>
                                    <View style={styles.textView}>
                                        <Text style={styles.text}>Delete roadmap</Text>
                                    </View>
                                </TouchableCmp>
                            </View>
                        </View>
                    </Modal>
                </View>
            </Portal>
            <FABbutton Icon="plus"  label="roadmap" onPress={openForm} />
            <FormRoadmap 
            closeModalForm={closeModalForm} 
            visibleForm={visibleForm} 
            deleteButton={deleteHandler}
            closeButton={closeModalForm}
            />
        </Provider>
    );
}

const modalMenuWidth = wp(77);
const modalMenuHeight = wp(35);

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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
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

export default RoadmapScreen;