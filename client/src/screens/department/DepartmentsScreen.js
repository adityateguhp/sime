import React, { useContext, useState } from 'react';
import { FlatList, Alert, StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Provider, Portal, Title, Text } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import FABbutton from '../../components/common/FABbutton';
import FormDepartment from '../../components/department/FormDepartment';
import { DEPARTMENTS } from '../../data/dummy-data';
import DepartmentCard from '../../components/department/DepartmentCard';
import { SimeContext } from '../../provider/SimePovider';
import Colors from '../../constants/Colors';
import {theme} from '../../constants/Theme';

const DepartmentsScreen = ({ navigation }) => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const selectItemHandler = (department_name, _id) => {
        navigation.navigate('Staff List', {
            departmentName: department_name,
            departmentId: _id
        })
        sime.setDepartment_id(_id);
        sime.setDepartment_name(department_name);
    };

    const organizationDepartment = DEPARTMENTS.filter(department => department.organization_id.indexOf('o1') >= 0)

    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);

    const closeModal = () => {
        setVisible(false);
    }

    const closeModalForm = () => {
        setVisibleForm(false);
    }

    const longPressHandler = (department_name) => {
        setVisible(true);
        sime.setDepartment_name(department_name);
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

    if (organizationDepartment.length === 0) {
        return (
            <View style={styles.content}>
                <Text>No departments found, let's add departments!</Text>
            </View>
        );
    }

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                data={organizationDepartment}
                keyExtractor={item => item._id}
                renderItem={itemData => (
                    <DepartmentCard
                        department_name={itemData.item.department_name}
                        onSelect={() => { selectItemHandler(itemData.item.department_name, itemData.item._id) }}
                        onDelete={() => { deleteHandler() }}
                        onLongPress={() => { longPressHandler(itemData.item.department_name) }}
                    >
                    </DepartmentCard>
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
                        <Title style={{ marginTop: wp(4), marginHorizontal: wp(5), marginBottom: 5, fontSize: wp(4.86) }}>{sime.department_name}</Title>
                        <TouchableCmp>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Edit</Text>
                            </View>
                        </TouchableCmp>
                        <TouchableCmp onPress={deleteHandler}>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Delete department</Text>
                            </View>
                        </TouchableCmp>
                    </View>
                </Modal>
            </Portal>
            <FABbutton Icon="plus" label="department" onPress={openForm} />
            <FormDepartment
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



export default DepartmentsScreen;