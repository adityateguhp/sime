import React, { useContext, useState, useEffect } from 'react';
import { FlatList, Alert, StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Platform, RefreshControl, ScrollView } from 'react-native';
import { Provider, Portal, Title, Text, Snackbar } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { NetworkStatus } from '@apollo/client';

import FABbutton from '../../components/common/FABbutton';
import FormExternal from '../../components/event/FormExternal';
import FormEditExternal from '../../components/event/FormEditExternal';
import ExternalList from '../../components/event/ExternalList';
import { SimeContext } from '../../context/SimePovider';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';
import { FETCH_EXBYTYPE_QUERY, DELETE_EXTERNAL, FETCH_EXTERNAL_QUERY } from '../../util/graphql';
import CenterSpinner from '../../components/common/CenterSpinner';

const ExternalListScreen = props => {
    const sime = useContext(SimeContext);

    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

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

    const { data: externals, error: errorExternals, loading: loadingExternals, refetch, networkStatus } = useQuery(
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

    const [loadExistData, { called, data: external, error: errorExternal, loading: loadingExternal }] = useLazyQuery(
        FETCH_EXTERNAL_QUERY,
        {
            variables: { externalId: sime.external_id },
        });

    const [externalVal, setExternalVal] = useState(null);

    const selectItemHandler = (id) => {
        props.navigation.navigate('External Profile', {
            externalId: id
        });
    };

    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);

    useEffect(() => {
        if (external) setExternalVal(external.getExternal);
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

    const [deleteExternal] = useMutation(DELETE_EXTERNAL, {
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

    if (errorExternals) {
        console.error(errorExternals);
        return <Text>errorExternals</Text>;
    }

    if (loadingExternals) {
        return <CenterSpinner />;
    }

    if (called & errorExternal) {
        console.error(errorExternal);
        return <Text>errorExternal</Text>;
    }

    if (loadingExternal) {

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
                <FABbutton Icon="plus" label={sime.external_type_name} onPress={openForm} />
                <FormExternal
                    closeModalForm={closeModalForm}
                    visibleForm={visibleForm}
                    closeButton={closeModalForm}
                    addExternalsStateUpdate={addExternalsStateUpdate}
                />
                <Snackbar
                    visible={visibleAdd}
                    onDismiss={onDismissSnackBarAdd}
                >
                    External added!
            </Snackbar>
                <Snackbar
                    visible={visibleDelete}
                    onDismiss={onDismissSnackBarDelete}
                >
                    External deleted!
            </Snackbar>
            </ScrollView>
        );
    }

    if (networkStatus === NetworkStatus.refetch) console.log('Refetching externals!');

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
                        name={itemData.item.name}
                        picture={itemData.item.picture}
                        size={50}
                        onSelect={() => { selectItemHandler(itemData.item.id) }}
                        onLongPress={() => { longPressHandler(itemData.item.name, itemData.item.id) }}
                    >
                    </ExternalList>
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
                        <Title style={{ marginTop: wp(4), marginHorizontal: wp(5), marginBottom: 5, fontSize: wp(4.86) }}>{sime.external_name}</Title>
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
            <FABbutton Icon="plus" label={sime.external_type_name} onPress={openForm} />
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
            <Snackbar
                visible={visibleAdd}
                onDismiss={onDismissSnackBarAdd}
            >
                External added!
            </Snackbar>
            <Snackbar
                visible={visibleUpdate}
                onDismiss={onDismissSnackBarUpdate}
            >
                External updated!
            </Snackbar>
            <Snackbar
                visible={visibleDelete}
                onDismiss={onDismissSnackBarDelete}
            >
                External deleted!
            </Snackbar>
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
    external: {
        marginLeft: 10,
        marginTop: 3
    },
});



export default ExternalListScreen;