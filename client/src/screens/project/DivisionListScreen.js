import React, { useContext, useState } from 'react';
import { FlatList, Alert, StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Provider, Portal, Title, Text } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import FABbutton from '../../components/common/FABbutton';
import FormDivision from '../../components/project/FormDivision';
import { DIVISIONS } from '../../data/dummy-data';
import DivisionCard from '../../components/project/DivisionCard';
import { SimeContext } from '../../context/SimePovider';
import Colors from '../../constants/Colors';
import {theme} from '../../constants/Theme';

const DivisionListScreen = ({ navigation }) => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const division = DIVISIONS.filter(
        div => div.project_id.indexOf(sime.project_id) >= 0
    );
    const selectItemHandler = (division_name, _id) => {
        navigation.navigate('Comitee List', {
            divisionName: division_name,
            divisionId: _id
        });

        sime.setDivision_name(division_name);
    };

    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);

    const closeModal = () => {
        setVisible(false);
    }

    const closeModalForm = () => {
        setVisibleForm(false);
    }

    const longPressHandler = (division_name) => {
        setVisible(true);
        sime.setDivision_name(division_name)
    }

    const openForm = () => {
        setVisibleForm(true);
    }


    const deleteHandler = () => {
        setVisible(false);
        Alert.alert('Are you sure?', 'Do you really want to delete this client?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive'
            }
        ]);
    };

    if (DIVISIONS.length === 0) {
        return (
            <View style={styles.content}>
                <Text>No comitee found, let's add comitee!</Text>
            </View>
        );
    }

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                data={division}
                keyExtractor={item => item._id}
                renderItem={itemData => (
                    <DivisionCard
                        division_name={itemData.item.division_name}
                        onSelect={() => { selectItemHandler(itemData.item.division_name, itemData.item._id) }}
                        onLongPress={() => { longPressHandler(itemData.item.division_name) }}
                    >
                    </DivisionCard>
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
                        <Title style={{ marginTop: wp(4), marginHorizontal: wp(5), marginBottom: 5, fontSize: wp(4.86) }}>{sime.division_name}</Title>
                        <TouchableCmp>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Edit</Text>
                            </View>
                        </TouchableCmp>
                        <TouchableCmp onPress={deleteHandler}>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Delete division</Text>
                            </View>
                        </TouchableCmp>
                    </View>
                </Modal>
            </Portal>
            <FABbutton Icon="plus"  label="DIVISION" onPress={openForm} />
            <FormDivision
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



export default DivisionListScreen;