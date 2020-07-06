import React, { useContext, useState } from 'react';
import { FlatList, Alert, StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Provider, Portal, Title, Text } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import FABbutton from '../../components/common/FABbutton';
import FormExternal from '../../components/event/FormExternal';
import { EXTERNALS } from '../../data/dummy-data';
import ExternalList from '../../components/event/ExternalList';
import ModalProfile from '../../components/common/ModalProfile';
import { SimeContext } from '../../context/SimePovider';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';

const ExternalListScreen = props => {
    const sime = useContext(SimeContext);

    let TouchableCmp = TouchableOpacity;

    const selectedExternal = EXTERNALS.filter(external => external.event_id.indexOf(sime.event_id) >= 0 && external.external_type.indexOf(sime.external_type) >= 0);

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const selectItemHandler = (_id) => {
        props.navigation.navigate('External Profile', {
            externalId: _id
        });
      };

    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);

    const closeModal = () => {
        setVisible(false);
    }

    const closeModalForm = () => {
        setVisibleForm(false);
    }

    const longPressHandler = (name) => {
        setVisible(true);
        sime.setExternal_name(name)
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

    if (selectedExternal.length === 0) {
        return (
            <View style={styles.content}>
                <Text>No staffs found, let's add staffs!</Text>
            </View>
        );
    }

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                data={selectedExternal}
                keyExtractor={item => item._id}
                renderItem={itemData => (
                    <ExternalList
                        style={styles.external}
                        name={itemData.item.name}
                        picture={itemData.item.picture}
                        size={50}
                        onSelect={() => { selectItemHandler(itemData.item._id)}}
                        onLongPress={() => { longPressHandler(itemData.item.name)}}
                    >
                    </ExternalList>
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
                        <Title style={{ marginTop: wp(4), marginHorizontal: wp(5), marginBottom: 5, fontSize: wp(4.86) }}>{sime.external_name}</Title>
                        <TouchableCmp>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Edit</Text>
                            </View>
                        </TouchableCmp>
                        <TouchableCmp onPress={deleteHandler}>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Delete</Text>
                            </View>
                        </TouchableCmp>
                    </View>
                </Modal>
            </Portal>
            <FABbutton Icon="plus" label={sime.external_type_name} onPress={openForm} />
            <FormExternal
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
        backgroundColor: 'white',
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
        justifyContent: 'flex-start',
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
    },
    external: {
        marginLeft: 10,
        marginTop: 3
    },
});



export default ExternalListScreen;