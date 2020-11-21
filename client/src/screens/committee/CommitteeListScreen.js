import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { FlatList, Alert, StyleSheet, View, RefreshControl } from 'react-native';
import { Provider, Text, Snackbar, FAB } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FormPic from '../../components/committee/FormPic';
import FormEditCommittee from '../../components/committee/FormEditCommittee';
import FormCommittee from '../../components/committee/FormCommittee';
import CommitteeCard from '../../components/committee/CommitteeCard';
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';
import {
    FETCH_COMMITTEES_QUERY,
    FETCH_STAFFS_QUERY,
    FETCH_POSITIONS_QUERY,
    FETCH_PICS_QUERY,
    DELETE_COMMITTEE,
    FETCH_COMMITTEE_QUERY,
    FETCH_PICS_IN_COMMITTEE_QUERY,
    DELETE_PIC_BYCOMMITTEE,
    DELETE_ASSIGNED_TASK_BYPIC
} from '../../util/graphql';
import LoadingModal from '../../components/common/LoadingModal';
import OptionModal from '../../components/common/OptionModal';
import Colors from '../../constants/Colors';

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


    const [visibleDeleteCommittee, setVisibledeleteCommittee] = useState(false);

    const onToggleSnackBarDeleteCommittee = () => setVisibledeleteCommittee(!visibleDeleteCommittee);

    const onDismissSnackBarDeleteCommittee = () => setVisibledeleteCommittee(false);


    const [visibleAddCommittee, setVisibleaddCommittee] = useState(false);

    const onToggleSnackBarAddCommittee = () => setVisibleaddCommittee(!visibleAddCommittee);

    const onDismissSnackBarAddCommittee = () => setVisibleaddCommittee(false);


    const [visibleUpdateCommittee, setVisibleupdateCommittee] = useState(false);

    const onToggleSnackBarUpdateCommittee = () => setVisibleupdateCommittee(!visibleUpdateCommittee);

    const onDismissSnackBarUpdateCommittee = () => setVisibleupdateCommittee(false);


    const [positionsValue, setPositionValue] = useState([]);
    const [staffsValue, setStaffsValue] = useState([]);
    const [personInChargesValue, setPersonInChargesValue] = useState([]);
    const [committeesValue, setCommitteesValue] = useState([]);

    const { data: staffs, error: errorStaffs, loading: loadingStaffs, refetch: refetchStaffs } = useQuery(
        FETCH_STAFFS_QUERY,
        {
            variables: { organizationId: sime.user.id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setStaffsValue(staffs.getStaffs) }
        }
    );

    const { data: committees, error: errorCommittees, loading: loadingCommittees, refetch: refetchCommittees } = useQuery(
        FETCH_COMMITTEES_QUERY,
        {
            variables: { projectId: sime.project_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setCommitteesValue(committees.getCommittees) }
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
                setPersonInChargesValue(personInCharges.getPersonInCharges)
            }
        }
    );

    const [loadExistData, { called, data: committee, error: error2 }] = useLazyQuery(
        FETCH_COMMITTEE_QUERY,
        {
            variables: { committeeId: sime.committee_id }
        });

    const [loadPicData, { called: called2, data: picInCommittee, error: error3 }] = useLazyQuery(
        FETCH_PICS_IN_COMMITTEE_QUERY,
        {
            variables: { committeeId: sime.committee_id }
        });

    const [committeeVal, setCommitteeVal] = useState(null);
    const [picInCommitteeVal, setPicInCommittee] = useState(null);

    useEffect(() => {
        if (committee) {
            setCommitteeVal(committee.getCommittee)
        }
    }, [committee])

    useEffect(() => {
        if (picInCommittee) {
            setPicInCommittee(picInCommittee.getPersonInChargesInCommittee)
        }
    }, [picInCommittee])

    const selectItemHandler = () => {
        navigation.navigate('Person in Charge Profile', {
            personInChargeId: sime.person_in_charge_id
        })
    };

    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [visibleFormCommittee, setVisibleFormCommittee] = useState(false);
    const [visibleFormEditCommittee, setVisibleFormEditCommittee] = useState(false);
    const [state, setState] = useState({ open: false });

    const onStateChange = ({ open }) => setState({ open });

    const { open } = state;

    const closeModal = () => {
        setVisible(false);
    }

    const closeModalForm = () => {
        setVisibleForm(false);
    }

    const closeModalFormCommittee = () => {
        setVisibleFormCommittee(false);
    }

    const closeModalFormEditCommittee = () => {
        setVisibleFormEditCommittee(false);
    }

    const longPressHandler = (id, name) => {
        setVisible(true);
        sime.setCommittee_name(name)
        sime.setCommittee_id(id)
        loadExistData();
        loadPicData();
    }

    const openForm = () => {
        setVisibleForm(true);
    }

    const openFormCommittee = () => {
        setVisibleFormCommittee(true);
    }

    const openFormEditCommittee = () => {
        closeModal();
        setVisibleFormEditCommittee(true);
    }

    const addPersonInChargesStateUpdate = (e) => {
        const temp = [e, ...personInChargesValue];
        temp.sort(function (a, b) {
            var textA = a.order;
            var textB = b.order;

            return textA.localeCompare(textB)
        });
        setPersonInChargesValue(temp);
        onToggleSnackBarAdd();
    }

    const deletePersonInChargesStateUpdate = (e) => {
        const temp = [...personInChargesValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e);
        temp.splice(index, 1);
        setPersonInChargesValue(temp);
        onToggleSnackBarDelete();
    }

    const updatePersonInChargesStateUpdate = (e) => {
        const temp = [...personInChargesValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e.id);
        temp[index] = e;
        temp.sort(function (a, b) {
            var textA = a.order;
            var textB = b.order;

            return textA.localeCompare(textB)
        });
        setPersonInChargesValue(temp);
        onToggleSnackBarUpdate();
    }

    const addCommitteesStateUpdate = (e) => {
        const temp = [e, ...committeesValue];
        temp.sort(function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();

            return textA.localeCompare(textB)
        })
        setCommitteesValue(temp);
        onToggleSnackBarAddCommittee();
    }

    const deleteCommitteesStateUpdate = (e) => {
        const temp = [...committeesValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e);
        temp.splice(index, 1);
        setCommitteesValue(temp);
        onToggleSnackBarDeleteCommittee();
    }

    const updateCommitteesStateUpdate = (e) => {
        const temp = [...committeesValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e.id);
        temp[index] = e
        temp.sort(function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();

            return textA.localeCompare(textB)
        })
        setCommitteesValue(temp);
        onToggleSnackBarUpdateCommittee();
    }

    const updateCommitteeStateUpdate = (e) => {
        setCommitteeVal(e)
    }

    const committeeId = sime.committee_id;

    const [deleteAssignedTaskByPersonInCharge] = useMutation(DELETE_ASSIGNED_TASK_BYPIC);

    const deleteAssignedTaskByPersonInChargeHandler = () => {
        picInCommitteeVal.map((committee) => {
            deleteAssignedTaskByPersonInCharge(({
                variables: { personInChargeId: committee.id },
            }))
        })
    };

    const [deletePersonInChargeByCommittee] = useMutation(DELETE_PIC_BYCOMMITTEE);

    const [deleteCommittee, { loading: loadingDelete }] = useMutation(DELETE_COMMITTEE, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_COMMITTEES_QUERY,
                variables: { projectId: sime.project_id },
            });
            data.getCommittees = data.getCommittees.filter((d) => d.id !== committeeId);
            deleteCommitteesStateUpdate(committeeId);
            deletePersonInChargeByCommittee({
                update() {
                    onRefresh();
                },
                variables: { committeeId }
            })
            deleteAssignedTaskByPersonInChargeHandler();
            proxy.writeQuery({ query: FETCH_COMMITTEES_QUERY, data, variables: { projectId: sime.project_id } });
        },
        variables: {
            committeeId
        }
    });


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

    const deleteHandler = () => {
        closeModal();
        closeModalFormEditCommittee();
        Alert.alert('Are you sure?', 'Do you really want to delete this committee?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: confirmToDeleteAll
            }
        ]);
    };

    const confirmToDeleteAll = () => {
        Alert.alert('Wait... are you really sure?', "By deleting this committee, it's also delete all person in charge inside this committee and all related to the person in charge", [
            { text: 'Cancel', style: 'default' },
            {
                text: 'Agree',
                style: 'destructive',
                onPress: deleteCommittee
            }
        ]);
    };

    if (errorStaffs) {
        console.error(errorStaffs);
        return <Text>errorStaffs</Text>;
    }

    if (errorCommittees) {
        console.error(errorCommittees);
        return <Text>errorCommittees</Text>;
    }

    if (errorPositions) {
        console.error(errorPositions);
        return <Text>errorPositions</Text>;
    }

    if (errorPersonInCharges) {
        console.error(errorPersonInCharges);
        return <Text>errorPersonInCharges</Text>;
    }

    if (called & error2) {
        console.error(error2);
        return <Text>Error</Text>;
    }

    if (called2 & error3) {
        console.error(error3);
        return <Text>Error3</Text>;
    }

    if (committeesValue.length === 0) {
        return (
            <View style={styles.content}>
                <Text>No commitees found, let's add commitees!</Text>
            </View>
        );
    }

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingStaffs && loadingPositions && loadingCommittees && loadingPersonInCharges}
                        onRefresh={onRefresh} />
                }
                data={committeesValue}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <CommitteeCard
                        name={itemData.item.name}
                        committee_id={itemData.item.id}
                        staffs={staffsValue}
                        committees={committeesValue}
                        positions={positionsValue}
                        personInCharges={personInChargesValue}
                        onSelect={selectItemHandler}
                        deletePersonInChargesStateUpdate={deletePersonInChargesStateUpdate}
                        updatePersonInChargesStateUpdate={updatePersonInChargesStateUpdate}
                        onLongPress={() => { longPressHandler(itemData.item.id, itemData.item.name) }}
                    />
                )}
            />
            <OptionModal
                visible={visible}
                closeModal={closeModal}
                title={sime.committee_name}
                openFormEdit={openFormEditCommittee}
                deleteHandler={deleteHandler}
            />
            <FAB.Group
                open={open}
                icon={open ? 'account-multiple-plus' : 'plus'}
                actions={[
                    {
                        icon: 'account',
                        label: 'Person in Charge',
                        onPress: openForm
                    },
                    {
                        icon: 'account-multiple',
                        label: 'Committee',
                        onPress: openFormCommittee
                    },
                ]}
                color="white"
                fabStyle={{
                    backgroundColor: Colors.secondaryColor
                }}
                onStateChange={onStateChange}
            />
            <FormPic
                closeModalForm={closeModalForm}
                visibleForm={visibleForm}
                closeButton={closeModalForm}
                staffs={staffsValue}
                committees={committeesValue}
                positions={positionsValue}
                personInCharges={personInChargesValue}
                addPersonInChargesStateUpdate={addPersonInChargesStateUpdate}
            />
            <FormCommittee
                closeModalForm={closeModalFormCommittee}
                visibleForm={visibleFormCommittee}
                closeButton={closeModalFormCommittee}
                addCommitteesStateUpdate={addCommitteesStateUpdate}
            />
            <FormEditCommittee
                closeModalForm={closeModalFormEditCommittee}
                visibleForm={visibleFormEditCommittee}
                committee={committeeVal}
                deleteButton={deleteHandler}
                closeButton={closeModalFormEditCommittee}
                updateCommitteeStateUpdate={updateCommitteeStateUpdate}
                updateCommitteesStateUpdate={updateCommitteesStateUpdate}
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
            <Snackbar
                visible={visibleAddCommittee}
                onDismiss={onDismissSnackBarAddCommittee}
                action={{
                    label: 'dismiss',
                    onPress: () => {
                        onDismissSnackBarAddCommittee();
                    },
                }}
            >
                Committee added!
            </Snackbar>
            <Snackbar
                visible={visibleUpdateCommittee}
                onDismiss={onDismissSnackBarUpdateCommittee}
                action={{
                    label: 'dismiss',
                    onPress: () => {
                        onDismissSnackBarUpdateCommittee();
                    },
                }}
            >
                Committee updated!
            </Snackbar>
            <Snackbar
                visible={visibleDeleteCommittee}
                onDismiss={onDismissSnackBarDeleteCommittee}
                action={{
                    label: 'dismiss',
                    onPress: () => {
                        onDismissSnackBarDeleteCommittee();
                    },
                }}
            >
                Committee deleted!
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



export default CommitteeListScreen;