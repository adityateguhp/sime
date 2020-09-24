import React, { useContext, useState } from 'react';
import { FlatList, Alert, StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Provider, Portal, Title, Text } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';

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

    const { data: externals, error: errorExternals, loading: loadingExternals } = useQuery(
        FETCH_EXBYTYPE_QUERY, {
        variables: {
            eventId: sime.event_id,
            externalType: sime.external_type
        },
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
        setExternalVal(external.getExternal);
    }

    const externalId = sime.external_id;
    const eventId = sime.event_id;
    const externalType = sime.external_type

    const [deleteExternal] = useMutation(DELETE_EXTERNAL, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_EXBYTYPE_QUERY,
                variables: {eventId, externalType}
            });
            externals.getExternalByType = externals.getExternalByType.filter((e) => e.id !== externalId);
            proxy.writeQuery({ query: FETCH_EXBYTYPE_QUERY, data, variables: {eventId, externalType} });
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

    if (externals.getExternalByType.length === 0) {
        return (
            <View style={styles.content}>
                <Text>No {sime.external_type_name} found, let's add {sime.external_type_name}!</Text>
                <FABbutton Icon="plus" label={sime.external_type_name} onPress={openForm} />
                <FormExternal
                    closeModalForm={closeModalForm}
                    visibleForm={visibleForm}
                    closeButton={closeModalForm}
                />
            </View>
        );
    }

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                data={externals.getExternalByType}
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
            />
            <FormEditExternal
                 closeModalForm={closeModalFormEdit}
                 visibleForm={visibleFormEdit}
                 external={externalVal}
                 deleteButton={deleteHandler}
                 deleteButtonVisible={true}
                 closeButton={closeModalFormEdit}
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
    external: {
        marginLeft: 10,
        marginTop: 3
    },
});



export default ExternalListScreen;