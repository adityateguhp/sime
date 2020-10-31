import React, { useContext, useState, useEffect } from 'react';
import { FlatList, Alert, StyleSheet, View, Dimensions, TouchableOpacity, TouchableNativeFeedback, Platform, RefreshControl, ScrollView } from 'react-native';
import { Provider, Portal, Title, Text, Snackbar } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { NetworkStatus } from '@apollo/client';

import FABbutton from '../../components/common/FABbutton';
import FormRoadmap from '../../components/event/FormRoadmap';
import FormEditRoadmap from '../../components/event/FormEditRoadmap';
import RoadmapCard from '../../components/event/RoadmapCard';;
import { SimeContext } from '../../context/SimePovider';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';
import { FETCH_ROADMAPS_QUERY, FETCH_ROADMAP_QUERY, DELETE_ROADMAP } from '../../util/graphql';
import CenterSpinner from '../../components/common/CenterSpinner';

const RoadmapScreen = ({ route, navigation }) => {
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


    const [roadmapsValue, setRoadmapsValue] = useState([]);

    const { data: roadmaps, error: errorRoadmaps, loading: loadingRoadmaps, refetch, networkStatus } = useQuery(
        FETCH_ROADMAPS_QUERY,
        {
            variables: { eventId: sime.event_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setRoadmapsValue(roadmaps.getRoadmaps) }
        }
    );

    const [loadExistData, { called, data: roadmap, error: errorRoadmap, loading: loadingRoadmap }] = useLazyQuery(
        FETCH_ROADMAP_QUERY,
        {
            variables: { roadmapId: sime.roadmap_id }
        });

    const selectItemHandler = (_id, name) => {
        navigation.navigate('Task');
        sime.setRoadmap_id(_id);
        sime.setRoadmap_name(name);
    };

    const [roadmapVal, setRoadmapVal] = useState(null);
    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);

    useEffect(() => {
        if (roadmap) setRoadmapVal(roadmap.getRoadmap);
    }, [roadmap])

    const closeModal = () => {
        setVisible(false);
    }

    const closeModalForm = () => {
        setVisibleForm(false);
    }

    const closeModalFormEdit = () => {
        setVisibleFormEdit(false);
    }

    const longPressHandler = (id, name) => {
        setVisible(true);
        sime.setRoadmap_name(name);
        sime.setRoadmap_id(id);
        loadExistData();
    }

    const openForm = () => {
        setVisibleForm(true);
    }

    const openFormEdit = () => {
        closeModal();
        setVisibleFormEdit(true);
    }

    const roadmapId = sime.roadmap_id;

    const [deleteRoadmap] = useMutation(DELETE_ROADMAP, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_ROADMAPS_QUERY,
                variables: { eventId: sime.event_id }
            });
            roadmaps.getRoadmaps = roadmaps.getRoadmaps.filter((e) => e.id !== roadmapId);
            deleteRoadmapsStateUpdate(roadmapId)
            proxy.writeQuery({ query: FETCH_ROADMAPS_QUERY, data, variables: { eventId: sime.event_id } });
        },
        variables: {
            roadmapId
        }
    });


    const addRoadmapsStateUpdate = (e) => {
        setRoadmapsValue([e, ...roadmapsValue]);
        onToggleSnackBarAdd();
    }

    const deleteRoadmapsStateUpdate = (e) => {
        const temp = [...roadmapsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e);
        temp.splice(index, 1);
        setRoadmapsValue(temp);
        onToggleSnackBarDelete();
    }

    const updateRoadmapsStateUpdate = (e) => {
        const temp = [...roadmapsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e.id);
        temp[index] = e
        setRoadmapsValue(temp);
        onToggleSnackBarUpdate();
    }

    const updateRoadmapStateUpdate = (e) => {
        setRoadmapVal(e)
    }

    const onRefresh = () => {
        refetch();
    };

    const deleteHandler = () => {
        setVisible(false);
        Alert.alert('Are you sure?', 'Do you really want to delete this roadmap?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: deleteRoadmap
            }
        ]);
    };

    if (errorRoadmaps) {
        console.error(errorRoadmaps);
        return <Text>errorRoadmaps</Text>;
    }

    if (loadingRoadmaps) {
        return <CenterSpinner />;
    }

    if (called & errorRoadmap) {
        console.error(errorRoadmap);
        return <Text>errorRoadmap</Text>;
    }

    if (loadingRoadmap) {

    }


    if (roadmaps.getRoadmaps.length === 0) {
        return (
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingRoadmaps}
                        onRefresh={onRefresh} />
                }
            >
                <Text>No roadmaps found, let's add roadmaps!</Text>
                <FABbutton Icon="plus" label="roadmap" onPress={openForm} />
                <FormRoadmap
                    closeModalForm={closeModalForm}
                    visibleForm={visibleForm}
                    closeButton={closeModalForm}
                    addRoadmapsStateUpdate={addRoadmapsStateUpdate}
                />
                <Snackbar
                    visible={visibleAdd}
                    onDismiss={onDismissSnackBarAdd}
                >
                    Roadmap added!
            </Snackbar>
                <Snackbar
                    visible={visibleDelete}
                    onDismiss={onDismissSnackBarDelete}
                >
                    Roadmap deleted!
            </Snackbar>
            </ScrollView>
        );
    }

    if (networkStatus === NetworkStatus.refetch) console.log('Refetching roadmaps!');

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingRoadmaps}
                        onRefresh={onRefresh} />
                }
                data={roadmapsValue}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <RoadmapCard
                        roadmapId={itemData.item.id}
                        name={itemData.item.name}
                        start_date={itemData.item.start_date}
                        end_date={itemData.item.end_date}
                        onSelect={() => {
                            selectItemHandler(itemData.item.id, itemData.item.name);
                        }}
                        onLongPress={() => { longPressHandler(itemData.item.id, itemData.item.name) }}
                    >
                    </RoadmapCard>
                )}
            />
            <Portal>
                <View style={styles.centeredView}>
                    <Modal useNativeDriver={true} isVisible={visible} animationIn="zoomIn" animationInTiming={100} animationOut="zoomOut" animationOutTiming={100} onBackButtonPress={closeModal} onBackdropPress={closeModal} statusBarTranslucent>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Title style={{ marginTop: wp(4), marginHorizontal: wp(5), marginBottom: 5, fontSize: wp(4.86) }} numberOfLines={1} ellipsizeMode='tail'>{sime.roadmap_name}</Title>
                                <TouchableCmp onPress={openFormEdit}>
                                    <View style={styles.textView}>
                                        <Text style={styles.text}>Edit</Text>
                                    </View>
                                </TouchableCmp>
                                <TouchableCmp onPress={deleteHandler}>
                                    <View style={styles.textView}>
                                        <Text style={styles.text}>Delete roadmap</Text>
                                    </View>
                                </TouchableCmp>
                            </View>
                        </View>
                    </Modal>
                </View>
            </Portal>
            <FABbutton Icon="plus" label="roadmap" onPress={openForm} />
            <FormRoadmap
                closeModalForm={closeModalForm}
                visibleForm={visibleForm}
                closeButton={closeModalForm}
                addRoadmapsStateUpdate={addRoadmapsStateUpdate}
            />
            <FormEditRoadmap
                closeModalForm={closeModalFormEdit}
                visibleForm={visibleFormEdit}
                deleteButton={deleteHandler}
                closeButton={closeModalFormEdit}
                roadmap={roadmapVal}
                updateRoadmapsStateUpdate={updateRoadmapsStateUpdate}
                updateRoadmapStateUpdate={updateRoadmapStateUpdate}
            />
            <Snackbar
                visible={visibleAdd}
                onDismiss={onDismissSnackBarAdd}
            >
                Roadmap added!
            </Snackbar>
            <Snackbar
                visible={visibleUpdate}
                onDismiss={onDismissSnackBarUpdate}
            >
                Roadmap updated!
            </Snackbar>
            <Snackbar
                visible={visibleDelete}
                onDismiss={onDismissSnackBarDelete}
            >
                Roadmap deleted!
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        backgroundColor: 'white',
        height: modalMenuHeight,
        width: modalMenuWidth,
        alignSelf: 'center',
        justifyContent: 'flex-start'
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
    }
});

export default RoadmapScreen;