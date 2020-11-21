import React, { useContext, useState, useEffect } from 'react';
import { FlatList, Alert, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { Provider, Text, Snackbar } from 'react-native-paper';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';

import FABbutton from '../../components/common/FABbutton';
import FormRoadmap from '../../components/roadmap/FormRoadmap';
import FormEditRoadmap from '../../components/roadmap/FormEditRoadmap';
import RoadmapCard from '../../components/roadmap/RoadmapCard';;
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';
import {
    FETCH_ROADMAPS_QUERY,
    FETCH_ROADMAP_QUERY,
    DELETE_ROADMAP,
    FETCH_EVENT_QUERY
} from '../../util/graphql';
import LoadingModal from '../../components/common/LoadingModal';
import OptionModal from '../../components/common/OptionModal';

const RoadmapScreen = ({ route, navigation }) => {

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
    const [eventVal, setEventVal] = useState(null);

    const { data: roadmaps, error: errorRoadmaps, loading: loadingRoadmaps, refetch: refetchRoadmaps } = useQuery(
        FETCH_ROADMAPS_QUERY,
        {
            variables: { eventId: sime.event_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setRoadmapsValue(roadmaps.getRoadmaps) }
        }
    );

    const { data: event, error: errorEvent, loading: loadingEvent, refetch: refetchEvent } = useQuery(
        FETCH_EVENT_QUERY, {
        variables: {
            eventId: sime.event_id
        },
        notifyOnNetworkStatusChange: true,
        onCompleted: () => {
            setEventVal(event.getEvent);
        }
    });

    const [loadExistData, { called, data: roadmap, error: errorRoadmap }] = useLazyQuery(
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

    const [deleteRoadmap, { loading: loadingDelete }] = useMutation(DELETE_ROADMAP, {
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
        refetchRoadmaps();
        refetchEvent();
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

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

    if (errorEvent) {
        console.error(errorEvent);
        return <Text>errorEvent</Text>;
    }

    if (called & errorRoadmap) {
        console.error(errorRoadmap);
        return <Text>errorRoadmap</Text>;
    }

    if (roadmapsValue.length === 0) {
        return (
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingRoadmaps && loadingEvent}
                        onRefresh={onRefresh} />
                }
            >
                <Text>No roadmaps found, let's add roadmaps!</Text>
                <FABbutton Icon="plus" onPress={openForm} />
                <FormRoadmap
                    closeModalForm={closeModalForm}
                    visibleForm={visibleForm}
                    closeButton={closeModalForm}
                    addRoadmapsStateUpdate={addRoadmapsStateUpdate}
                    event={eventVal}
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
                    Roadmap added!
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
                    Roadmap deleted!
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
                        refreshing={loadingRoadmaps && loadingEvent}
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
                        onRefresh={onRefresh}
                    >
                    </RoadmapCard>
                )}
            />
            <OptionModal
                visible={visible}
                closeModal={closeModal}
                title={sime.roadmap_name}
                openFormEdit={openFormEdit}
                deleteHandler={deleteHandler}
            />
            <FABbutton Icon="plus" onPress={openForm} />
            <FormRoadmap
                closeModalForm={closeModalForm}
                visibleForm={visibleForm}
                closeButton={closeModalForm}
                addRoadmapsStateUpdate={addRoadmapsStateUpdate}
                event={eventVal}
            />
            <FormEditRoadmap
                closeModalForm={closeModalFormEdit}
                visibleForm={visibleFormEdit}
                deleteButton={deleteHandler}
                closeButton={closeModalFormEdit}
                roadmap={roadmapVal}
                updateRoadmapsStateUpdate={updateRoadmapsStateUpdate}
                updateRoadmapStateUpdate={updateRoadmapStateUpdate}
                event={eventVal}
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
                Roadmap added!
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
                Roadmap updated!
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
                Roadmap deleted!
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
    }
});

export default RoadmapScreen;