import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { FlatList, Alert, StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Platform, RefreshControl } from 'react-native';
import { Provider, Portal, Title, Text } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { NetworkStatus } from '@apollo/client';

import FABbutton from '../../components/common/FABbutton';
import CenterSpinner from '../../components/common/CenterSpinner';
import FormStaff from '../../components/department/FormStaff';
import FormEditStaff from '../../components/department/FormEditStaff';
import { STAFFS } from '../../data/dummy-data';
import StaffList from '../../components/department/StaffList';
import { SimeContext } from '../../context/SimePovider';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';
import { FETCH_STAFFS_QUERY, DELETE_STAFF, FETCH_STAFF_QUERY, FETCH_DEPARTMENTS_QUERY } from '../../util/graphql';

const StaffsScreen = ({ route, navigation }) => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const [staffsValue, setStaffsValue] = useState([]);
    const [departmentsValue, setDepartmentsValue] = useState([]);

    const { data: staffs, error: error1, loading: loading1, refetch: refetchStaffs, networkStatus: networkStatusStaffs } = useQuery(
        FETCH_STAFFS_QUERY,
        {
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setStaffsValue(staffs.getStaffs)
            }
        }
    );

    const { data: departments, error: error3, loading: loading3, refetch: refetchDepartment, networkStatus: networkStatusDepartments } = useQuery(
        FETCH_DEPARTMENTS_QUERY,
        {
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setDepartmentsValue(departments.getDepartments)
            }
        }
    );

    const [loadExistData, { called, data: staff, error: error2, loading: loading2 }] = useLazyQuery(
        FETCH_STAFF_QUERY,
        {
            variables: { staffId: sime.staff_id },
        });

    const [staffVal, setStaffVal] = useState(null);

    const selectItemHandler = (id, department_id) => {
        navigation.navigate('Staff Profile', {
            staffId: id,
            departmentId: department_id
        });
        sime.setStaff_id(id);
        sime.setDepartment_id(department_id)
    };

    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);

    useEffect(() => {
        if (staff) setStaffVal(staff.getStaff);
    }, [staff])

    const closeModal = () => {
        setVisible(false);
    }

    const closeModalForm = () => {
        setVisibleForm(false);
    }

    const closeModalFormEdit = () => {
        setVisibleFormEdit(false);
    }

    const longPressHandler = (name, id, department_id) => {
        sime.setStaff_name(name);
        sime.setStaff_id(id);
        sime.setDepartment_id(department_id)
        loadExistData();
        setVisible(true);
    }

    const openForm = () => {
        setVisibleForm(true);
    }

    const openFormEdit = () => {
        closeModal();
        setVisibleFormEdit(true);
    }

    const staffId = sime.staff_id;

    const [deleteStaff] = useMutation(DELETE_STAFF, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_STAFFS_QUERY,

            });
            staffs.getStaffs = staffs.getStaffs.filter((s) => s.id !== staffId);
            deleteStaffsStateUpdate(staffId)
            proxy.writeQuery({ query: FETCH_STAFFS_QUERY, data });
        },
        variables: {
            staffId
        }
    });

    const deleteHandler = () => {
        closeModal();
        closeModalFormEdit();
        Alert.alert('Are you sure?', 'Do you really want to delete this staff?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: deleteStaff
            }
        ]);
    };

    const addStaffsStateUpdate = (e) => {
        const temp = [e, ...staffsValue];
        temp.sort(function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();

            return textA.localeCompare(textB)
        })
        setStaffsValue(temp);
    }

    const deleteStaffsStateUpdate = (e) => {
        const temp = [...staffsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e);
        temp.splice(index, 1);
        setStaffsValue(temp);
    }

    const updateStaffsStateUpdate = (e) => {
        const temp = [...staffsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e.id);
        temp[index] = e
        temp.sort(function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();

            return textA.localeCompare(textB)
        })
        setStaffsValue(temp)
    }

    const updateStaffStateUpdate = (e) => {
        setStaffVal(e)
    }

    const onRefresh = () => {
        refetchStaffs();
        refetchDepartment();
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

    if (error3) {
        console.error(error3);
        return <Text>Error</Text>;
    }

    if (loading3) {
        return <CenterSpinner />;
    }

    if (staffsValue.length === 0) {
        return (
            <View style={styles.content}>
                <Text>No staffs found, let's add staffs!</Text>
                <FABbutton Icon="plus" label="staff" onPress={openForm} />
                <FormStaff
                    closeModalForm={closeModalForm}
                    visibleForm={visibleForm}
                    closeButton={closeModalForm}
                />
            </View>
        );
    }

    if (networkStatusStaffs === NetworkStatus.refetch) return console.log('Refetching staffs!');
    if (networkStatusDepartments === NetworkStatus.refetch) return console.log('Refetching departments!');

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                refreshControl={
                    <RefreshControl
                        refreshing={loading1}
                        onRefresh={onRefresh} />
                }
                data={staffsValue}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <StaffList
                        name={itemData.item.name}
                        email={itemData.item.email}
                        picture={itemData.item.picture}
                        onDelete={() => { deleteHandler() }}
                        onSelect={() => { selectItemHandler(itemData.item.id, itemData.item.department_id) }}
                        onLongPress={() => { longPressHandler(itemData.item.name, itemData.item.id, itemData.item.department_id) }}
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
                        <TouchableCmp onPress={openFormEdit}>
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
                closeButton={closeModalForm}
                addStaffsStateUpdate={addStaffsStateUpdate}
                departments={departmentsValue}
            />
            <FormEditStaff
                closeModalForm={closeModalFormEdit}
                visibleForm={visibleFormEdit}
                staff={staffVal}
                departments={departmentsValue}
                deleteButton={deleteHandler}
                deleteButtonVisible={true}
                closeButton={closeModalFormEdit}
                updateStaffStateUpdate={updateStaffStateUpdate}
                updateStaffsStateUpdate={updateStaffsStateUpdate}
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