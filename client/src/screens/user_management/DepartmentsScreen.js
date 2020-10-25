import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { FlatList, Alert, StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Platform, RefreshControl, ScrollView } from 'react-native';
import { Provider, Portal, Title, Text, Snackbar } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { NetworkStatus } from '@apollo/client';

import FABbutton from '../../components/common/FABbutton';
import CenterSpinner from '../../components/common/CenterSpinner';
import FormDepartment from '../../components/user_management/FormDepartment';
import FormEditDepartment from '../../components/user_management/FormEditDepartment';
import DepartmentCard from '../../components/user_management/DepartmentCard';
import { SimeContext } from '../../context/SimePovider';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';
import { FETCH_DEPARTMENTS_QUERY, DELETE_DEPARTMENT, FETCH_DEPARTMENT_QUERY } from '../../util/graphql';

const DepartmentsScreen = ({ navigation }) => {
    const sime = useContext(SimeContext);

    const [visibleDelete, setVisibleDelete] = useState(false);

    const onToggleSnackBarDelete = () => setVisibleDelete(!visibleDelete);

    const onDismissSnackBarDelete = () => setVisibleDelete(false);


    const [visibleAdd, setVisibleAdd] = useState(false);

    const onToggleSnackBarAdd = () => setVisibleAdd(!visibleAdd);

    const onDismissSnackBarAdd = () => setVisibleAdd(false);


    const [visibleUpdate, setVisibleUpdate] = useState(false);

    const onToggleSnackBarUpdate = () => setVisibleUpdate(!visibleUpdate);

    const onDismissSnackBarUpdate = () => setVisibleUpdate(false);

    const [departmentsValue, setDepartmentsValue] = useState([]);

    const { data: departments, error: error1, loading: loading1, refetch, networkStatus } = useQuery(
        FETCH_DEPARTMENTS_QUERY,
        {
            variables: { organizationId: sime.user.id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setDepartmentsValue(departments.getDepartments)
            }
        }
    );

    const [loadExistData, { called, data: department, error: error2, loading: loading2 }] = useLazyQuery(
        FETCH_DEPARTMENT_QUERY,
        {
            variables: { departmentId: sime.department_id },
        });

    const [departmentVal, setDepartmentVal] = useState(null);

    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const selectItemHandler = (name, id) => {
        navigation.navigate('Staff List in Department', {
            departmentName: name,
            departmentId: id
        })
        sime.setDepartment_id(id);
        sime.setDepartment_name(name);
    };

    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);

    useEffect(() => {
        if (department) setDepartmentVal(department.getDepartment);
    }, [department])

    const closeModal = () => {
        setVisible(false);
    }

    const closeModalForm = () => {
        setVisibleForm(false);
    }

    const closeModalFormEdit = () => {
        setVisibleFormEdit(false);
    }

    const longPressHandler = (name, id) => {
        setVisible(true);
        sime.setDepartment_name(name);
        sime.setDepartment_id(id)
        loadExistData();
    }

    const openForm = () => {
        setVisibleForm(true);
    }

    const openFormEdit = () => {
        closeModal();
        setVisibleFormEdit(true);
    }

    const departmentId = sime.department_id;
    const organizationId = sime.user.id;

    const [deleteDepartment] = useMutation(DELETE_DEPARTMENT, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_DEPARTMENTS_QUERY,
                variables: { organizationId }
            });
            departments.getDepartments = departments.getDepartments.filter((d) => d.id !== departmentId);
            deleteDepartmentsStateUpdate(departmentId)
            proxy.writeQuery({ query: FETCH_DEPARTMENTS_QUERY, data, variables: { organizationId } });
        },
        variables: {
            departmentId,
            organizationId
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

    const addDepartmentsStateUpdate = (e) => {
        const temp = [e, ...departmentsValue];
        temp.sort(function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();

            return textA.localeCompare(textB)
        })
        setDepartmentsValue(temp);
        onToggleSnackBarAdd();
    }

    const deleteDepartmentsStateUpdate = (e) => {
        const temp = [...departmentsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e);
        temp.splice(index, 1);
        setDepartmentsValue(temp);
        onToggleSnackBarDelete();
    }

    const updateDepartmentsStateUpdate = (e) => {
        const temp = [...departmentsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e.id);
        temp[index] = e
        temp.sort(function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();

            return textA.localeCompare(textB)
        })
        setDepartmentsValue(temp);
        onToggleSnackBarUpdate();
    }

    const updateDepartmentStateUpdate = (e) => {
        setDepartmentVal(e)
    }

    const onRefresh = () => {
        refetch();
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

    if (departmentsValue.length === 0) {
        return (
            <Provider theme={theme}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading1}
                            onRefresh={onRefresh} />
                    }
                >
                    <Text>No departments found, let's add departments!</Text>
                    <FABbutton Icon="plus" label="department" onPress={openForm} />
                    <FormDepartment
                        closeModalForm={closeModalForm}
                        visibleForm={visibleForm}
                        closeButton={closeModalForm}
                        addDepartmentsStateUpdate={addDepartmentsStateUpdate}
                    />
                    <Snackbar
                        visible={visibleAdd}
                        onDismiss={onDismissSnackBarAdd}
                    >
                        Department added!
            </Snackbar>
                    <Snackbar
                        visible={visibleDelete}
                        onDismiss={onDismissSnackBarDelete}
                    >
                        Department deleted!
            </Snackbar>
                </ScrollView>
            </Provider>
        );
    }

    if (networkStatus === NetworkStatus.refetch) console.log('Refetching departments!');

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                refreshControl={
                    <RefreshControl
                        refreshing={loading1}
                        onRefresh={onRefresh} />
                }
                data={departmentsValue}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <DepartmentCard
                        name={itemData.item.name}
                        onSelect={() => { selectItemHandler(itemData.item.name, itemData.item.id) }}
                        onDelete={() => { deleteHandler() }}
                        onLongPress={() => { longPressHandler(itemData.item.name, itemData.item.id) }}
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
                addDepartmentsStateUpdate={addDepartmentsStateUpdate}
            />
            <FormEditDepartment
                closeModalForm={closeModalFormEdit}
                visibleForm={visibleFormEdit}
                department={departmentVal}
                deleteButton={deleteHandler}
                closeButton={closeModalFormEdit}
                updateDepartmentsStateUpdate={updateDepartmentsStateUpdate}
                updateDepartmentStateUpdate={updateDepartmentStateUpdate}
            />
            <Snackbar
                visible={visibleAdd}
                onDismiss={onDismissSnackBarAdd}
            >
                Department added!
            </Snackbar>
            <Snackbar
                visible={visibleUpdate}
                onDismiss={onDismissSnackBarUpdate}
            >
                Department updated!
            </Snackbar>
            <Snackbar
                visible={visibleDelete}
                onDismiss={onDismissSnackBarDelete}
            >
                Department deleted!
            </Snackbar>
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