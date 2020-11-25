import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { FlatList, Alert, StyleSheet, View, RefreshControl, SectionList, ScrollView } from 'react-native';
import { Provider, Text, Snackbar, FAB } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FABbutton from '../../components/common/FABbutton';
import FormPic from '../../components/committee/FormPic';
import CommitteeContainer from '../../components/committee/CommitteeContainer';
import PicList from '../../components/committee/PicList';
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';
import {
    FETCH_COMMITTEES_QUERY,
    FETCH_STAFFS_QUERY,
    FETCH_POSITIONS_QUERY,
    FETCH_PICS_QUERY
} from '../../util/graphql';
import LoadingModal from '../../components/common/LoadingModal';


const CommitteeListScreen = ({ navigation }) => {
    const safeArea = useSafeAreaInsets();

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

    const [positionsValue, setPositionValue] = useState([]);
    const [staffsValue, setStaffsValue] = useState([]);
    const [personInChargesValueTemp, setPersonInChargesValueTemp] = useState([]);
    const [personInChargesValue, setPersonInChargesValue] = useState([]);
    const [committeesValue, setCommitteesValue] = useState([]);

    const { data: committees, error: errorCommittees, loading: loadingCommittees, refetch: refetchCommittees } = useQuery(
        FETCH_COMMITTEES_QUERY,
        {
            variables: { organizationId: sime.user.id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setCommitteesValue(committees.getCommittees) }
        }
    );

    const { data: staffs, error: errorStaffs, loading: loadingStaffs, refetch: refetchStaffs } = useQuery(
        FETCH_STAFFS_QUERY,
        {
            variables: { organizationId: sime.user.id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setStaffsValue(staffs.getStaffs) }
        }
    );

    const { data: positions, error: errorPositions, loading: loadingPositions, refetch: refetchPositions } = useQuery(
        FETCH_POSITIONS_QUERY,
        {
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setPositionValue(positions.getPositions) }
        }
    );

    const { data: personInCharges, error: errorPersonInCharges, loading: loadingPersonInCharges, refetch: refetchPersonInCharges } = useQuery(
        FETCH_PICS_QUERY,
        {
            variables: { projectId: sime.project_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                personInCharges.getPersonInCharges.sort(function (a, b) {
                    var textA = a.order;
                    var textB = b.order;

                    return textA.localeCompare(textB)
                });
                setPersonInChargesValueTemp(personInCharges.getPersonInCharges)
            }
        }
    );

    useEffect(() => {
        if (personInChargesValueTemp) {
            let dataSource = personInChargesValueTemp.reduce(function (sections, item) {

                let section = sections.find(section => section.committee_id === item.committee_id);

                if (!section) {
                    section = { committee_id: item.committee_id, data: [] };
                    sections.push(section);
                }

                section.data.push(item);

                return sections;

            }, []);
            setPersonInChargesValue(dataSource)
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [personInChargesValueTemp, personInCharges, setPersonInChargesValue])


    const selectItemHandler = () => {
        navigation.navigate('Person in Charge Profile', {
            personInChargeId: sime.person_in_charge_id
        })
    };

    const [visibleForm, setVisibleForm] = useState(false);


    const closeModalForm = () => {
        setVisibleForm(false);
    }

    const openForm = () => {
        setVisibleForm(true);
    }

    const addPersonInChargesStateUpdate = (e) => {
        const temp = [e, ...personInChargesValueTemp];
        temp.sort(function (a, b) {
            var textA = a.order;
            var textB = b.order;

            return textA.localeCompare(textB)
        });
        setPersonInChargesValueTemp(temp)
        let dataSource = temp.reduce(function (sections, item) {

            let section = sections.find(section => section.committee_id === item.committee_id);

            if (!section) {
                section = { committee_id: item.committee_id, data: [] };
                sections.push(section);
            }

            section.data.push(item);

            return sections;

        }, []);
        setPersonInChargesValue(dataSource);
        onToggleSnackBarAdd();
    }

    const deletePersonInChargesStateUpdate = (e) => {
        const temp = [...personInChargesValueTemp];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e);
        temp.splice(index, 1);
        setPersonInChargesValueTemp(temp)
        let dataSource = temp.reduce(function (sections, item) {

            let section = sections.find(section => section.committee_id === item.committee_id);

            if (!section) {
                section = { committee_id: item.committee_id, data: [] };
                sections.push(section);
            }

            section.data.push(item);

            return sections;

        }, []);
        setPersonInChargesValue(dataSource);
        onToggleSnackBarDelete();
    }

    const updatePersonInChargesStateUpdate = (e) => {
        const temp = [...personInChargesValueTemp];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e.id);
        temp[index] = e;
        temp.sort(function (a, b) {
            var textA = a.order;
            var textB = b.order;

            return textA.localeCompare(textB)
        });
        setPersonInChargesValueTemp(temp);
        onToggleSnackBarUpdate();
    }


    const onRefresh = () => {
        refetchPersonInCharges();
        refetchCommittees();
        refetchPositions();
        refetchStaffs();
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);


    if (errorCommittees) {
        console.error(errorCommittees);
        return <Text>errorCommittees</Text>;
    }


    if (errorStaffs) {
        console.error(errorStaffs);
        return <Text>errorStaffs</Text>;
    }


    if (errorPositions) {
        console.error(errorPositions);
        return <Text>errorPositions</Text>;
    }

    if (errorPersonInCharges) {
        console.error(errorPersonInCharges);
        return <Text>errorPersonInCharges</Text>;
    }

    if (personInChargesValue.length === 0) {
        return (
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingStaffs && loadingPositions && loadingPersonInCharges && loadingCommittees}
                        onRefresh={onRefresh} />
                }
            >
                <Text>No commitees found, let's add commitees!</Text>
                <FABbutton Icon="plus" onPress={openForm} />
                <FormPic
                    closeModalForm={closeModalForm}
                    visibleForm={visibleForm}
                    closeButton={closeModalForm}
                    staffs={staffsValue}
                    committees={committeesValue}
                    positions={positionsValue}
                    personInCharges={personInChargesValueTemp}
                    addPersonInChargesStateUpdate={addPersonInChargesStateUpdate}
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
                    Person in Charge added!
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
                    Person in Charge deleted!
            </Snackbar>
            </ScrollView>
        );
    }

    return (
        <Provider theme={theme}>
            <SectionList
                refreshControl={
                    <RefreshControl
                        refreshing={loadingStaffs && loadingPositions && loadingPersonInCharges && loadingCommittees}
                        onRefresh={onRefresh} />
                }
                sections={personInChargesValue}
                keyExtractor={(item, index) => item.id + index}
                renderItem={
                    ({ item, index, section }) => (
                        <PicList
                            person_in_charge_id={item.id}
                            staff_id={item.staff_id}
                            position_id={item.position_id}
                            committee_id={item.committee_id}
                            order={item.order}
                            staffs={staffsValue}
                            committees={committeesValue}
                            positions={positionsValue}
                            personInCharges={personInChargesValueTemp}
                            onSelect={selectItemHandler}
                            deletePersonInChargesStateUpdate={deletePersonInChargesStateUpdate}
                            updatePersonInChargesStateUpdate={updatePersonInChargesStateUpdate}
                        />
                    )
                }
                renderSectionHeader={
                    ({ section: { committee_id } }) => (
                        <CommitteeContainer
                            committee_id={committee_id}
                        />
                    )
                }
                ListFooterComponent={() => (
                    <View style={{ marginTop: 7 }}></View>
                )}
            />
            <FABbutton Icon="plus" onPress={openForm} />
            <FormPic
                closeModalForm={closeModalForm}
                visibleForm={visibleForm}
                closeButton={closeModalForm}
                staffs={staffsValue}
                committees={committeesValue}
                positions={positionsValue}
                personInCharges={personInChargesValueTemp}
                addPersonInChargesStateUpdate={addPersonInChargesStateUpdate}
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
                Person in Charge added!
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
                Person in Charge updated!
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
                Person in Charge deleted!
            </Snackbar>
        </Provider>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    }
});



export default CommitteeListScreen;