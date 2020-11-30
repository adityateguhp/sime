import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { FlatList, Alert, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { Provider, Text, Snackbar, List, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import FABbutton from '../../components/common/FABbutton';
import FormPosition from '../../components/committee/FormPosition';
import FormEditPosition from '../../components/committee/FormEditPosition';
import PositionList from '../../components/committee/PositionList';
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';
import {
    FETCH_POSITIONS_QUERY,
    FETCH_POSITION_QUERY,
    DELETE_POSITION
} from '../../util/graphql';
import LoadingModal from '../../components/common/LoadingModal';
import OptionModal from '../../components/common/OptionModal';

const PositionManagementScreen = ({ navigation }) => {
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

    const [positionsValue, setPositionsValue] = useState([]);
    const [positionValue, setPositionValue] = useState(null);

    const { data: positions, error: error1, loading: loading1, refetch } = useQuery(
        FETCH_POSITIONS_QUERY,
        {
            variables: { organizationId: sime.user.organization_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setPositionsValue(positions.getPositions)
            }
        }
    );

    const [loadExistData, { called, data: position, error: error2 }] = useLazyQuery(
        FETCH_POSITION_QUERY,
        {
            variables: { positionId: sime.position_id },
        });


    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);

    useEffect(() => {
        if (position) setPositionValue(position.getPosition);
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [position])


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
        sime.setPosition_name(name);
        sime.setPosition_id(id)
        loadExistData();
    }

    const openForm = () => {
        setVisibleForm(true);
    }

    const openFormEdit = () => {
        closeModal();
        setVisibleFormEdit(true);
    }

    const positionId = sime.position_id;
    const organizationId = sime.user.organization_id;

    const [deletePosition, { loading: loadingDelete }] = useMutation(DELETE_POSITION, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_POSITIONS_QUERY,
                variables: { organizationId }
            });
            positions.getPositions = positions.getPositions.filter((d) => d.id !== positionId);
            deletePositionsStateUpdate(positionId);
            proxy.writeQuery({ query: FETCH_POSITIONS_QUERY, data, variables: { organizationId } });
        },
        variables: {
            positionId
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
                onPress: deletePosition
            }
        ]);
    };

    const addPositionsStateUpdate = (e) => {
        const temp = [e, ...positionsValue];
        temp.sort(function (a, b) {
            var textA = a.order
            var textB = b.order

            var coreA = a.core;
            var coreB = b.core;

            return coreB - coreA || textA - textB
        })
        setPositionsValue(temp);
        onToggleSnackBarAdd();
    }

    const deletePositionsStateUpdate = (e) => {
        const temp = [...positionsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e);
        temp.splice(index, 1);
        setPositionsValue(temp);
        onToggleSnackBarDelete();
    }

    const updatePositionsStateUpdate = (e) => {
        const temp = [...positionsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e.id);
        temp[index] = e
        temp.sort(function (a, b) {
            var textA = a.order
            var textB = b.order

            var coreA = a.core;
            var coreB = b.core;

            return coreB - coreA || textA - textB
        })
        setPositionsValue(temp);
        onToggleSnackBarUpdate();
    }

    const updatePositionStateUpdate = (e) => {
        setPositionValue(e)
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
                data={positionsValue}
                refreshControl={
                    <RefreshControl
                        refreshing={loading1}
                        onRefresh={onRefresh} />
                }
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <PositionList
                        name={itemData.item.name}
                        core={itemData.item.core}
                        onLongPress={() => { longPressHandler(itemData.item.name, itemData.item.id) }}
                    />
                )}
            />
            <OptionModal
                visible={visible}
                closeModal={closeModal}
                title={sime.position_name}
                openFormEdit={openFormEdit}
                deleteHandler={deleteHandler}
            />
            <FABbutton Icon="plus" onPress={openForm} />
            <FormPosition
                closeModalForm={closeModalForm}
                visibleForm={visibleForm}
                closeButton={closeModalForm}
                addPositionsStateUpdate={addPositionsStateUpdate}
            />
            <FormEditPosition
                closeModalForm={closeModalFormEdit}
                visibleForm={visibleFormEdit}
                position={positionValue}
                deleteButton={deleteHandler}
                closeButton={closeModalFormEdit}
                updatePositionsStateUpdate={updatePositionsStateUpdate}
                updatePositionStateUpdate={updatePositionStateUpdate}
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



export default PositionManagementScreen;