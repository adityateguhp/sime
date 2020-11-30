import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { FlatList, Alert, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { Provider, Text, Snackbar, List, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import FABbutton from '../../components/common/FABbutton';
import FormDepartmentPosition from '../../components/user_management/FormDepartmentPosition';
import FormEditDepartmentPosition from '../../components/user_management/FormEditDepartmentPosition';
import DepartmentPositionList from '../../components/user_management/DepartmentPositionList';
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';
import {
    FETCH_DEPARTMENT_POSITIONS_QUERY,
    FETCH_DEPARTMENT_POSITION_QUERY,
    DELETE_DEPARTMENT_POSITION
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

    const [departmentPositionsValue, setDepartmentPositionsValue] = useState([]);
    const [departmentPositionValue, setDepartmentPositionValue] = useState(null);

    const { data: departmentPositions, error: error1, loading: loading1, refetch } = useQuery(
        FETCH_DEPARTMENT_POSITIONS_QUERY,
        {
            variables: { organizationId: sime.user.organization_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setDepartmentPositionsValue(departmentPositions.getDepartmentPositions)
            }
        }
    );

    const [loadExistData, { called, data: departmentPosition, error: error2 }] = useLazyQuery(
        FETCH_DEPARTMENT_POSITION_QUERY,
        {
            variables: { departmentPositionId: sime.department_position_id },
        });


    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);

    useEffect(() => {
        if (departmentPosition) setDepartmentPositionValue(departmentPosition.getDepartmentPosition);
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [departmentPosition])


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
        sime.setDepartment_position_name(name);
        sime.setDepartment_position_id(id)
        loadExistData();
    }

    const openForm = () => {
        setVisibleForm(true);
    }

    const openFormEdit = () => {
        closeModal();
        setVisibleFormEdit(true);
    }

    const departmentPositionId = sime.department_position_id;
    const organizationId = sime.user.organization_id;

    const [deleteDepartmentPosition, { loading: loadingDelete }] = useMutation(DELETE_DEPARTMENT_POSITION, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_DEPARTMENT_POSITIONS_QUERY,
                variables: { organizationId }
            });
            departmentPositions.getDepartmentPositions = departmentPositions.getDepartmentPositions.filter((d) => d.id !== departmentPositionId);
            deleteDepartmentPositionsStateUpdate(departmentPositionId);
            proxy.writeQuery({ query: FETCH_DEPARTMENT_POSITIONS_QUERY, data, variables: { organizationId } });
        },
        variables: {
            departmentPositionId
        }
    });

    const deleteHandler = () => {
        closeModal();
        closeModalFormEdit();
        Alert.alert('Are you sure?', 'Do you really want to delete this position?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: deleteDepartmentPosition
            }
        ]);
    };

    const addDepartmentPositionsStateUpdate = (e) => {
        const temp = [e, ...departmentPositionsValue];
        temp.sort(function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();

            return textA.localeCompare(textB)
        })
        setDepartmentPositionsValue(temp);
        onToggleSnackBarAdd();
    }

    const deleteDepartmentPositionsStateUpdate = (e) => {
        const temp = [...departmentPositionsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e);
        temp.splice(index, 1);
        setDepartmentPositionsValue(temp);
        onToggleSnackBarDelete();
    }

    const updateDepartmentPositionsStateUpdate = (e) => {
        const temp = [...departmentPositionsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e.id);
        temp[index] = e
        temp.sort(function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();

            return textA.localeCompare(textB)
        })
        setDepartmentPositionsValue(temp);
        onToggleSnackBarUpdate();
    }

    const updateDepartmentPositionStateUpdate = (e) => {
        setDepartmentPositionValue(e)
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

    return (
        <Provider theme={theme}>
             <FlatList
                style={styles.screen}
                data={departmentPositionsValue}
                refreshControl={
                    <RefreshControl
                        refreshing={loading1}
                        onRefresh={onRefresh} />
                }
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <DepartmentPositionList
                        name={itemData.item.name}
                        onLongPress={() => { longPressHandler(itemData.item.name, itemData.item.id) }}
                    />
                )}
            />
            <OptionModal
                visible={visible}
                closeModal={closeModal}
                title={sime.department_position_name}
                openFormEdit={openFormEdit}
                deleteHandler={deleteHandler}
            />
            <FABbutton Icon="plus" onPress={openForm} />
            <FormDepartmentPosition
                closeModalForm={closeModalForm}
                visibleForm={visibleForm}
                closeButton={closeModalForm}
                addDepartmentPositionsStateUpdate={addDepartmentPositionsStateUpdate}
            />
            <FormEditDepartmentPosition
                closeModalForm={closeModalFormEdit}
                visibleForm={visibleFormEdit}
                position={departmentPositionValue}
                deleteButton={deleteHandler}
                closeButton={closeModalFormEdit}
                updateDepartmentPositionsStateUpdate={updateDepartmentPositionsStateUpdate}
                updateDepartmentPositionStateUpdate={updateDepartmentPositionStateUpdate}
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
                Position added!
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
                Position updated!
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
                Position deleted!
            </Snackbar>
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