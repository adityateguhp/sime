import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { FlatList, Alert, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { Provider, Text, Snackbar, Portal } from 'react-native-paper';

import FABbutton from '../../components/common/FABbutton';
import FormDepartment from '../../components/user_management/FormDepartment';
import FormEditDepartment from '../../components/user_management/FormEditDepartment';
import DepartmentCard from '../../components/user_management/DepartmentCard';
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';
import {
    FETCH_DEPARTMENTS_QUERY,
    DELETE_DEPARTMENT,
    FETCH_DEPARTMENT_QUERY
} from '../../util/graphql';
import LoadingModal from '../../components/common/LoadingModal';
import OptionModal from '../../components/common/OptionModal';

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
    const [departmentVal, setDepartmentVal] = useState(null);

    const { data: departments, error: error1, loading: loading1, refetch } = useQuery(
        FETCH_DEPARTMENTS_QUERY,
        {
            variables: { organizationId: sime.user.organization_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setDepartmentsValue(departments.getDepartments)
            }
        }
    );

    const [loadExistData, { called, data: department, error: error2 }] = useLazyQuery(
        FETCH_DEPARTMENT_QUERY,
        {
            variables: { departmentId: sime.department_id },
        });

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
        return () => {
            console.log("This will be logged on unmount");
        }
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
    const organizationId = sime.user.organization_id;

    const [deleteDepartment, { loading: loadingDelete }] = useMutation(DELETE_DEPARTMENT, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_DEPARTMENTS_QUERY,
                variables: { organizationId }
            });
            departments.getDepartments = departments.getDepartments.filter((d) => d.id !== departmentId);
            deleteDepartmentsStateUpdate(departmentId);
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
                    <FABbutton Icon="plus" onPress={openForm} />
                    <FormDepartment
                        closeModalForm={closeModalForm}
                        visibleForm={visibleForm}
                        closeButton={closeModalForm}
                        addDepartmentsStateUpdate={addDepartmentsStateUpdate}
                    />
                    <Portal>
                        <Snackbar
                            visible={visibleAdd}
                            onDismiss={onDismissSnackBarAdd}
                            action={{
                                label: 'dismiss',
                                onPress: () => {
                                    onDismissSnackBarAdd();
                                },
                            }}
                        >
                            Department added!
            </Snackbar>
                        <Snackbar
                            visible={visibleDelete}
                            onDismiss={onDismissSnackBarDelete}
                            action={{
                                label: 'dismiss',
                                onPress: () => {
                                    onDismissSnackBarDelete();
                                },
                            }}
                        >
                            Department deleted!
            </Snackbar>
                    </Portal>
                </ScrollView>
            </Provider>
        );
    }

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
            <OptionModal
                visible={visible}
                closeModal={closeModal}
                title={sime.department_name}
                openFormEdit={openFormEdit}
                deleteHandler={deleteHandler}
            />
            <FABbutton Icon="plus" onPress={openForm} />
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
            <Portal>
                <Snackbar
                    visible={visibleAdd}
                    onDismiss={onDismissSnackBarAdd}
                    action={{
                        label: 'dismiss',
                        onPress: () => {
                            onDismissSnackBarAdd();
                        },
                    }}>
                    Department added!
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
                    Department updated!
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
                    Department deleted!
            </Snackbar>
            </Portal>
            <LoadingModal loading={loadingDelete} />
        </Provider>
    );
}

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
});



export default DepartmentsScreen;