import React, { useContext, useState } from 'react';
import { FlatList, Alert, StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Provider, Portal, Title, Text } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import FABbutton from '../../components/common/FABbutton';
import FormStaff from '../../components/department/FormStaff';
import { STAFFS } from '../../data/dummy-data';
import StaffList from '../../components/department/StaffList';
import { SimeContext } from '../../context/SimePovider';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';

const StaffsScreen = ({ route, navigation }) => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const departId = route.params?.departmentId;
    
    const Staff = STAFFS.filter(
        staff => staff.department_id.indexOf(departId) >= 0
    );

    const selectItemHandler = (_id) => {
        navigation.navigate('Staff Profile', {
            staffId: _id
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

    const longPressHandler = (staff_name) => {
        setVisible(true);
        sime.setStaff_name(staff_name);
    }

    const openForm = () => {
        setVisibleForm(true);
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

    if (Staff.length === 0) {
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
                data={Staff}
                keyExtractor={item => item._id}
                renderItem={itemData => (
                    <StaffList
                        staff_name={itemData.item.staff_name}
                        position_name={itemData.item.position_name}
                        picture={itemData.item.picture}
                        onDelete={() => { deleteHandler() }}
                        onSelect={()=>{selectItemHandler(itemData.item._id)}}
                        onLongPress={() => { longPressHandler(itemData.item.staff_name) }}

                    >
                    </StaffList>
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
                        <Title style={{ marginTop: wp(4), marginHorizontal: wp(5), marginBottom: 5, fontSize: wp(4.86) }}>{sime.staff_name}</Title>
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
            <FABbutton Icon="plus" label="staff" onPress={openForm} />
            <FormStaff
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
});



export default StaffsScreen;