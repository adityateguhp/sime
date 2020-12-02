import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { FlatList, Alert, StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Platform, RefreshControl, ScrollView } from 'react-native';
import { Provider, Portal, Title, Text, Snackbar } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import FABbutton from '../../components/common/FABbutton';
import FormStaffDepartment from '../../components/user_management/FormStaffDepartment';
import FormEditStaffDepartment from '../../components/user_management/FormEditStaffDepartment';
import StaffList from '../../components/user_management/StaffList';
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';
import {
    FETCH_STAFFSBYDEPARTMENT_QUERY,
    DELETE_STAFF,
    DELETE_PIC_BYSTAFF,
    DELETE_ASSIGNED_TASK_BYPIC,
    FETCH_STAFF_QUERY,
    FETCH_PICS_BYSTAFF_QUERY,
    RESET_PASSWORD_STAFF_MUTATION,
    FETCH_DEPARTMENT_POSITIONS_QUERY,
} from '../../util/graphql';
import LoadingModal from '../../components/common/LoadingModal';

const StaffsinDepartmentScreen = ({ route, navigation }) => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

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


    const [visibleResetPassword, setVisibleResetPassword] = useState(false);

    const onToggleSnackBarResetPassword = () => setVisibleResetPassword(!visibleResetPassword);

    const onDismissSnackBarResetPassword = () => setVisibleResetPassword(false);


    const [staffsValue, setStaffsValue] = useState([]);
    const [staffVal, setStaffVal] = useState(null);
    // const [commiteesVal, setCommitteesVal] = useState([])
    const [departmentPositionsValue, setDepartmentPositionsValue] = useState([]);

    const departmentId = route.params?.departmentId;
    const staffId = sime.staff_id;

    const { data: staffs, error: error1, loading: loading1, refetch } = useQuery(
        FETCH_STAFFSBYDEPARTMENT_QUERY, {
        variables: {
            departmentId
        },
        notifyOnNetworkStatusChange: true,
        onCompleted: () => {
            setStaffsValue(staffs.getStaffsByDepartment)
        },
    });

    const { data: departmentPositions, error: error5, loading: loading5, refetch: refetchPositions } = useQuery(
        FETCH_DEPARTMENT_POSITIONS_QUERY,
        {
            variables: { organizationId: sime.user.organization_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setDepartmentPositionsValue(departmentPositions.getDepartmentPositions)
            }
        }
    );

    const [loadExistData, { called, data: staff, error: error2 }] = useLazyQuery(
        FETCH_STAFF_QUERY,
        {
            variables: { staffId: sime.staff_id },
        });

    // const [loadCommitteeData, { called: called2, data: committeeByStaff, error: error4 }] = useLazyQuery(
    //     FETCH_PICS_BYSTAFF_QUERY,
    //     {
    //         variables: { staffId: sime.staff_id },
    //     });

        const selectItemHandler = (id, department_id, department_position_id) => {
            navigation.navigate('Staff Profile', {
                staffId: id,
                departmentId: department_id,
                positionId: department_position_id
            });
        };

    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);

    useEffect(() => {
        if (staff) setStaffVal(staff.getStaff);
        return () => {
            console.log("This will be logged on unmount");
          }
    }, [staff])

    // useEffect(() => {
    //     if (committeeByStaff) setCommitteesVal(committeeByStaff.getPersonInChargesByStaff);
    //     return () => {
    //         console.log("This will be logged on unmount");
    //       }
    // }, [committeeByStaff])

    const closeModal = () => {
        setVisible(false);
    }

    const closeModalForm = () => {
        setVisibleForm(false);
    }

    const closeModalFormEdit = () => {
        setVisibleFormEdit(false);
    }

    const longPressHandler = (name, id, department_position_id) => {
        setVisible(true);
        sime.setStaff_name(name);
        sime.setStaff_id(id);
        sime.setDepartment_position_id(department_position_id);
        loadExistData();
        // loadCommitteeData();
    }

    const openForm = () => {
        setVisibleForm(true);
    }

    const openFormEdit = () => {
        closeModal();
        setVisibleFormEdit(true);
    }

    // const [deleteAssignedTaskByPersonInCharge] = useMutation(DELETE_ASSIGNED_TASK_BYPIC);

    // const deleteAssignedTaskByPersonInChargeHandler = () => {
    //     commiteesVal.map((committee) => {
    //         deleteAssignedTaskByPersonInCharge(({
    //             variables: { personInChargeId: committee.id },
    //         }))
    //     })
    // };

    // const [deletePersonInChargeByDepartment] = useMutation(DELETE_PIC_BYSTAFF);

    const [deleteStaff, { loading: loadingDelete }] = useMutation(DELETE_STAFF, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_STAFFSBYDEPARTMENT_QUERY,
                variables: { departmentId }
            });
            staffs.getStaffsByDepartment = staffs.getStaffsByDepartment.filter((s) => s.id !== staffId);
            deleteStaffsStateUpdate(staffId);
            // deletePersonInChargeByDepartment({ variables: { staffId } })
            // deleteAssignedTaskByPersonInChargeHandler();
            proxy.writeQuery({ query: FETCH_STAFFSBYDEPARTMENT_QUERY, data, variables: { departmentId } });
        },
        variables: {
            staffId
        }
    });

    const [resetPassword, {loading: loadingResetPassword}] = useMutation(RESET_PASSWORD_STAFF_MUTATION, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_STAFFSBYDEPARTMENT_QUERY,
                variables: { departmentId }
            });
            onToggleSnackBarResetPassword();
            proxy.writeQuery({ query: FETCH_STAFFSBYDEPARTMENT_QUERY, data, variables: { departmentId } });
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

    // const confirmToDeleteAll = () => {
    //     Alert.alert('Wait... are you really sure?', "By deleting this staff, it's also delete all related to this staff", [
    //         { text: 'Cancel', style: 'default' },
    //         {
    //             text: 'Agree',
    //             style: 'destructive',
    //             onPress: deleteStaff
    //         }
    //     ]);
    // };

    const resetPasswordHandler = () => {
        closeModal();
        Alert.alert('Are you sure?', 'Do you really want to reset password this staff account?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: resetPassword
            }
        ]);
    };

    const addStaffsStateUpdate = (e) => {
        const temp = [e, ...staffsValue];
        temp.sort(function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();

            var adminA = a.isAdmin;
            var adminB = b.isAdmin;

            return adminB - adminA || textA.localeCompare(textB)
        })
        setStaffsValue(temp);
        onToggleSnackBarAdd();
    }

    const deleteStaffsStateUpdate = (e) => {
        const temp = [...staffsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e);
        temp.splice(index, 1);
        setStaffsValue(temp);
        onToggleSnackBarDelete();
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

            var adminA = a.isAdmin;
            var adminB = b.isAdmin;

            return adminB - adminA || textA.localeCompare(textB)
        })
        setStaffsValue(temp)
        onToggleSnackBarUpdate();
    }

    const updateStaffStateUpdate = (e) => {
        setStaffVal(e)
    }

    const onRefresh = () => {
        refetch();
        refetchPositions();
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    if (error1) {
        console.error(error1);
        return <Text>Error</Text>;
    }

    if (called & error2) {
        console.error(error2);
        return <Text>Error</Text>;
    }

    // if (called2 & error4) {
    //     console.error(error2);
    //     return <Text>Error</Text>;
    // }

    if (error5) {
        console.error(error5);
        return <Text>Error</Text>;
    }

    if (staffsValue.length === 0) {
        return (
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={loading1 && loading5}
                        onRefresh={onRefresh} />
                }
            >
                <Text>No staffs found, let's add staffs!</Text>
                <FABbutton Icon="plus" onPress={openForm} />
                <FormStaffDepartment
                    closeModalForm={closeModalForm}
                    visibleForm={visibleForm}
                    closeButton={closeModalForm}
                    addStaffsStateUpdate={addStaffsStateUpdate}
                />
                <Snackbar
                    visible={visibleAdd}
                 onDismiss={onDismissSnackBarAdd}
                action={{
                    label: 'dismiss',
                    onPress: () => {
                        onDismissSnackBarAdd();
                    },
                  }}>
                    Staff added!
            </Snackbar>
                <Snackbar
                    visible={visibleDelete}
                    onDismiss={onDismissSnackBarDelete}
                action={{
                    label: 'dismiss',
                    onPress: () => {
                        onDismissSnackBarDelete();
                    },
                  }}>
                    Staff deleted!
            </Snackbar>
            </ScrollView>
        );
    }

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                refreshControl={
                    <RefreshControl
                        refreshing={loading1 && loading5}
                        onRefresh={onRefresh} />
                }
                data={staffsValue}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <StaffList
                        name={itemData.item.name}
                        email={itemData.item.position_name}
                        picture={itemData.item.picture}
                        isAdmin={itemData.item.isAdmin}
                        onDelete={() => { deleteHandler() }}
                        onSelect={() => { selectItemHandler(itemData.item.id, itemData.item.department_id, itemData.item.department_position_id) }}
                        onLongPress={() => { longPressHandler(itemData.item.name, itemData.item.id, itemData.item.department_position_id) }}
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
                    {sime.staff_id !== sime.user.id ?
                        <View style={styles.modalView}>
                            <Title style={{ marginTop: wp(4), marginHorizontal: wp(5), marginBottom: 5, fontSize: wp(4.86) }} numberOfLines={1} ellipsizeMode='tail'>{sime.staff_name}</Title>
                            <TouchableCmp onPress={openFormEdit}>
                                <View style={styles.textView}>
                                    <Text style={styles.text}>Edit</Text>
                                </View>
                            </TouchableCmp>
                            <TouchableCmp onPress={resetPasswordHandler}>
                                <View style={styles.textView}>
                                    <Text style={styles.text}>Reset password</Text>
                                </View>
                            </TouchableCmp>
                            <TouchableCmp onPress={deleteHandler}>
                                <View style={styles.textView}>
                                    <Text style={styles.text}>Delete</Text>
                                </View>
                            </TouchableCmp>
                        </View>
                        :
                        <View style={styles.modalAdminView}>
                            <Title style={{ marginTop: wp(4), marginHorizontal: wp(5), marginBottom: 5, fontSize: wp(4.86) }} numberOfLines={1} ellipsizeMode='tail'>{sime.staff_name}</Title>
                            <TouchableCmp onPress={openFormEdit}>
                                <View style={styles.textView}>
                                    <Text style={styles.text}>Edit</Text>
                                </View>
                            </TouchableCmp>
                            <TouchableCmp onPress={resetPasswordHandler}>
                                <View style={styles.textView}>
                                    <Text style={styles.text}>Reset password</Text>
                                </View>
                            </TouchableCmp>
                        </View>
                    }
                </Modal>
            </Portal>
            <FABbutton Icon="plus" onPress={openForm} />
            <FormStaffDepartment
                departmentId={departmentId}
                closeModalForm={closeModalForm}
                visibleForm={visibleForm}
                closeButton={closeModalForm}
                addStaffsStateUpdate={addStaffsStateUpdate}
                positions={departmentPositionsValue}
            />
            <FormEditStaffDepartment
                closeModalForm={closeModalFormEdit}
                visibleForm={visibleFormEdit}
                staff={staffVal}
                deleteButton={deleteHandler}
                closeButton={closeModalFormEdit}
                updateStaffStateUpdate={updateStaffStateUpdate}
                updateStaffsStateUpdate={updateStaffsStateUpdate}
                positions={departmentPositionsValue}
            />
            <Snackbar
                visible={visibleAdd}
             onDismiss={onDismissSnackBarAdd}
                action={{
                    label: 'dismiss',
                    onPress: () => {
                        onDismissSnackBarAdd();
                    },
                  }}>
                Staff added!
            </Snackbar>
            <Snackbar
                visible={visibleUpdate}
                onDismiss={onDismissSnackBarUpdate}
                action={{
                    label: 'dismiss',
                    onPress: () => {
                        onDismissSnackBarUpdate();
                    },
                  }}>
                Staff updated!
            </Snackbar>
            <Snackbar
                visible={visibleDelete}
               onDismiss={onDismissSnackBarDelete}
                action={{
                    label: 'dismiss',
                    onPress: () => {
                        onDismissSnackBarDelete();
                    },
                  }}>
                Staff deleted!
            </Snackbar>
            <Snackbar
                visible={visibleResetPassword}
                onDismiss={onDismissSnackBarResetPassword}
                        action={{
                            label: 'dismiss',
                            onPress: () => {
                                onDismissSnackBarResetPassword();
                            },
                          }}
            >
                Staff account password has been reset!
            </Snackbar>
            <LoadingModal loading={loadingDelete} />
            <LoadingModal loading={loadingResetPassword} />
        </Provider>
    );
}

const modalMenuWidth = wp(77);
const modalMenuHeight = wp(46.5);
const modalAdminMenuHeight = wp(35);

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
    modalAdminView: {
        backgroundColor: 'white',
        height: modalAdminMenuHeight,
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



export default StaffsinDepartmentScreen;