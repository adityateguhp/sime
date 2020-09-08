import React, { useContext, useState } from 'react';
import { FlatList, Alert, StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Portal, Text, Provider, Title } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import FABbutton from '../../components/common/FABbutton';
import { COMITEES, STAFFS, POSITIONS, DIVISIONS } from '../../data/dummy-data';
import ComiteeList from '../../components/project/ComiteeList';
import { SimeContext } from '../../context/SimePovider';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';

const ComiteeListScreen = ({ route, navigation }) => {
    const sime = useContext(SimeContext);

    const divId = route.params?.divisionId;

    const Comitee = COMITEES.filter(
        comitee => comitee.project_id.indexOf(sime.project_id) >= 0 &&
            comitee.division_id.indexOf(divId) >= 0
    );

    const selectItemHandler = (_id) => {
        navigation.navigate('Comitee Profile', {
            comiteeId: _id
        });
      };

    const [visibleMenu, setVisibleMenu] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);

    const closeModalMenu = () => {
        setVisibleMenu(false);
    }

    const closeModalForm = () => {
        setVisibleForm(false);
    }

    const longPressHandler = (staff_id) => {
        setVisibleMenu(true);
        sime.setStaff_id(staff_id);
    }

    const openForm = () => {
        setVisibleForm(true);
    }


    const staff = STAFFS.find(stf => stf._id.indexOf(sime.staff_id) >= 0);

    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const deleteHandler = () => {
        Alert.alert('Are you sure?', 'Do you really want to delete this client?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive'
            }
        ]);
    };

    if (Comitee.length === 0) {
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
                data={Comitee}
                keyExtractor={item => item._id}
                renderItem={itemData => (
                    <ComiteeList
                        staff_id={itemData.item.staff_id}
                        position_id={itemData.item.position_id}
                        division_id={itemData.item.division_id}
                        onDelete={() => { deleteHandler() }}
                        onSelect={() => { selectItemHandler(itemData.item._id)}}
                        onLongPress={() => { longPressHandler(itemData.item.staff_id) }}
                    >
                    </ComiteeList>
                )}
            />
            <Portal>
                <View style={styles.centeredView}>
                    <Modal useNativeDriver={true} isVisible={visibleMenu} animationIn="zoomIn" animationInTiming={100} animationOut="zoomOut" animationOutTiming={100} onBackButtonPress={closeModalMenu} onBackdropPress={closeModalMenu} statusBarTranslucent>
                        <View style={styles.centeredView}>
                            <View style={styles.modalMenuView}>
                                <Title style={{ marginTop: wp(4), marginHorizontal: wp(5), marginBottom: 5, fontSize: wp(4.86) }}>{staff.name}</Title>
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
                        </View>
                    </Modal>
                </View>
            </Portal>
            <FABbutton Icon="plus"  label="COMITEE" onPress={openForm} />
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
    modalMenuView: {
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



export default ComiteeListScreen;