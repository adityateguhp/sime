import React, { useContext, useState, useEffect } from 'react';
import { FlatList, Alert, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { Provider, Text, Snackbar, Portal } from 'react-native-paper';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import FABbutton from '../../components/common/FABbutton';
import FormExternal from '../../components/external/FormExternal';
import FormEditExternal from '../../components/external/FormEditExternal';
import ExternalList from '../../components/external/ExternalList';
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';
import { FETCH_EXBYTYPE_QUERY, DELETE_EXTERNAL, FETCH_EXTERNAL_QUERY } from '../../util/graphql';
import LoadingModal from '../../components/common/LoadingModal';
import OptionModal from '../../components/common/OptionModal';

const ExternalListScreen = ({ navigation }) => {
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

    const [externalsValue, setExternalsValue] = useState([]);

    const { data: externals, error: errorExternals, loading: loadingExternals, refetch } = useQuery(
        FETCH_EXBYTYPE_QUERY, {
        variables: {
            eventId: sime.event_id,
            externalType: sime.external_type
        },
        notifyOnNetworkStatusChange: true,
        onCompleted: () => {
            setExternalsValue(externals.getExternalByType)
        }
    });

    const [loadExistData, { called, data: external, error: errorExternal }] = useLazyQuery(
        FETCH_EXTERNAL_QUERY,
        {
            variables: { externalId: sime.external_id },
        });

    const [externalVal, setExternalVal] = useState(null);

    const selectItemHandler = (id) => {
        navigation.navigate('External Profile', {
            externalId: id
        });
    };

    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);

    useEffect(() => {
        if (external) setExternalVal(external.getExternal);
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [external])


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
        sime.setExternal_name(name)
        sime.setExternal_id(id)
        loadExistData()
    }

    const openForm = () => {
        setVisibleForm(true);
    }

    const openFormEdit = () => {
        closeModal();
        setVisibleFormEdit(true);

    }

    const externalId = sime.external_id;
    const eventId = sime.event_id;
    const externalType = sime.external_type

    const [deleteExternal, { loading: loadingDelete }] = useMutation(DELETE_EXTERNAL, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_EXBYTYPE_QUERY,
                variables: { eventId, externalType }
            });
            externals.getExternalByType = externals.getExternalByType.filter((e) => e.id !== externalId);
            deleteExternalsStateUpdate(externalId);
            proxy.writeQuery({ query: FETCH_EXBYTYPE_QUERY, data, variables: { eventId, externalType } });
        },
        variables: {
            externalId
        }
    });

    const deleteHandler = () => {
        closeModal();
        closeModalFormEdit();
        Alert.alert('Are you sure?', 'Do you really want to delete this?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: deleteExternal
            }
        ]);
    };

    const addExternalsStateUpdate = (e) => {
        const temp = [e, ...externalsValue];
        temp.sort(function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();

            return textA.localeCompare(textB)
        })
        setExternalsValue(temp);
        onToggleSnackBarAdd();
    }

    const deleteExternalsStateUpdate = (e) => {
        const temp = [...externalsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e);
        temp.splice(index, 1);
        setExternalsValue(temp);
        onToggleSnackBarDelete();
    }

    const updateExternalsStateUpdate = (e) => {
        const temp = [...externalsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e.id);
        temp[index] = e
        temp.sort(function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();

            return textA.localeCompare(textB)
        })
        setExternalsValue(temp)
        onToggleSnackBarUpdate();
    }

    const updateExternalStateUpdate = (e) => {
        setExternalVal(e)
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

    if (errorExternals) {
        console.error(errorExternals);
        return <Text>errorExternals</Text>;
    }

    if (called & errorExternal) {
        console.error(errorExternal);
        return <Text>errorExternal</Text>;
    }

    if (externalsValue.length === 0) {
        return (
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingExternals}
                        onRefresh={onRefresh} />
                }
            >
                <Text>No {sime.external_type_name} found, let's add {sime.external_type_name}!</Text>
                <FABbutton Icon="plus" onPress={openForm} />
                <FormExternal
                    closeModalForm={closeModalForm}
                    visibleForm={visibleForm}
                    closeButton={closeModalForm}
                    addExternalsStateUpdate={addExternalsStateUpdate}
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
                        External added!
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
                        External deleted!
            </Snackbar>
                </Portal>
            </ScrollView>
        );
    }

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingExternals}
                        onRefresh={onRefresh} />
                }
                data={externalsValue}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <ExternalList
                        style={styles.external}
                        id={itemData.item.id}
                        name={itemData.item.name}
                        picture={itemData.item.picture}
                        email={itemData.item.email}
                        phone_number={itemData.item.phone_number}
                        size={50}
                        onSelect={() => { selectItemHandler(itemData.item.id) }}
                        onLongPress={() => { longPressHandler(itemData.item.name, itemData.item.id) }}
                        navigation={navigation}
                        eventOverview={false}
                    >
                    </ExternalList>
                )}
            />
            <OptionModal
                visible={visible}
                closeModal={closeModal}
                title={sime.external_name}
                openFormEdit={openFormEdit}
                deleteHandler={deleteHandler}
            />
            <FABbutton Icon="plus" onPress={openForm} />
            <FormExternal
                closeModalForm={closeModalForm}
                visibleForm={visibleForm}
                closeButton={closeModalForm}
                addExternalsStateUpdate={addExternalsStateUpdate}
            />
            <FormEditExternal
                closeModalForm={closeModalFormEdit}
                visibleForm={visibleFormEdit}
                external={externalVal}
                deleteButton={deleteHandler}
                deleteButtonVisible={true}
                closeButton={closeModalFormEdit}
                updateExternalStateUpdate={updateExternalStateUpdate}
                updateExternalsStateUpdate={updateExternalsStateUpdate}
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
                    External added!
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
                    External updated!
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
                    External deleted!
            </Snackbar>
            </Portal>
            <LoadingModal loading={loadingDelete} />
        </Provider>
    );
}

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
    external: {
        marginLeft: 10,
        marginTop: 3
    },
});



export default ExternalListScreen;