import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { FlatList, Alert, StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Provider, Portal, Title, Text } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import FABbutton from '../../components/common/FABbutton';
import CenterSpinner from '../../components/common/CenterSpinner';
import FormDepartment from '../../components/department/FormDepartment';
import FormEditDepartment from '../../components/department/FormEditDepartment';
import DepartmentCard from '../../components/department/DepartmentCard';
import { SimeContext } from '../../context/SimePovider';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';
import { FETCH_DEPARTMENTS_QUERY, DELETE_DEPARTMENT, FETCH_DEPARTMENT_QUERY } from '../../util/graphql';

const DepartmentsScreen = ({ navigation }) => {
    const sime = useContext(SimeContext);

    const { data: departments, error: error1 , loading: loading1 } = useQuery(
        FETCH_DEPARTMENTS_QUERY
    );

    const [loadExistData, { called, data: department , error: error2 , loading: loading2 }] = useLazyQuery(
        FETCH_DEPARTMENT_QUERY,
        {
            variables: { departmentId: sime.department_id },
        });

    const [departmentVal, setDepartmentVal] = useState(null);

    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const selectItemHandler = (department_name, id) => {
        navigation.navigate('Staff List', {
            departmentName: department_name,
            departmentId: id
        })
        sime.setDepartment_id(id);
        sime.setDepartment_name(department_name);
    };

    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);

    const closeModal = () => {
        setVisible(false);
    }

    const closeModalForm = () => {
        setVisibleForm(false);
    }

    const closeModalFormEdit = () => {
        setVisibleFormEdit(false);
    }

    const longPressHandler = (department_name, id) => {
        setVisible(true);
        sime.setDepartment_name(department_name);
        sime.setDepartment_id(id)
        loadExistData();
    }

    const openForm = () => {
        setVisibleForm(true);
    }

    const openFormEdit = () => {
        closeModal();
        setVisibleFormEdit(true);
        setDepartmentVal(department.getDepartment);
    }

    const departmentId = sime.department_id;

    const [deleteDepartment] = useMutation(DELETE_DEPARTMENT, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_DEPARTMENTS_QUERY
            });
            departments.getDepartments = departments.getDepartments.filter((d) => d.id !== departmentId);
            proxy.writeQuery({ query: FETCH_DEPARTMENTS_QUERY, data });
        },
        variables: {
            departmentId
        }
    });

    const deleteHandler = () => {
        closeModal();
        closeModalFormEdit();
        Alert.alert('Are you sure?', 'Do you really want to delete this department?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: deleteDepartment
            }
        ]);
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

    if (departments.getDepartments.length === 0) {
        return (
            <Provider theme={theme}>
                <View style={styles.content}>
                    <Text>No departments found, let's add departments!</Text>
                </View>
                <FABbutton Icon="plus" label="department" onPress={openForm} />
                <FormDepartment
                    closeModalForm={closeModalForm}
                    visibleForm={visibleForm}
                    closeButton={closeModalForm}
                />
            </Provider>
        );
    }

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                data={departments.getDepartments}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <DepartmentCard
                        department_name={itemData.item.department_name}
                        onSelect={() => { selectItemHandler(itemData.item.department_name, itemData.item.id) }}
                        onDelete={() => { deleteHandler() }}
                        onLongPress={() => { longPressHandler(itemData.item.department_name, itemData.item.id) }}
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
                        <TouchableCmp onPress={openFormEdit}>
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
                closeButton={closeModalForm}
            />
            <FormEditDepartment
                closeModalForm={closeModalFormEdit}
                visibleForm={visibleFormEdit}
                department={departmentVal}
                deleteButton={deleteHandler}
                closeButton={closeModalFormEdit}
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