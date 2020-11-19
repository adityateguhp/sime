import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { FlatList, Alert, StyleSheet, View, RefreshControl } from 'react-native';
import { Provider, Text, Snackbar, FAB } from 'react-native-paper';

import FormCommittee from '../../components/project/FormCommittee';
import FormEditDivision from '../../components/project/FormEditDivision';
import FormDivision from '../../components/project/FormDivision';
import DivisionCard from '../../components/project/DivisionCard';
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';
import {
    FETCH_DIVISIONS_QUERY,
    FETCH_STAFFS_QUERY,
    FETCH_POSITIONS_QUERY,
    FETCH_COMMITTEES_QUERY,
    DELETE_DIVISION,
    FETCH_DIVISION_QUERY,
    FETCH_COMMITTEES_IN_DIVISION_QUERY,
    DELETE_COMMITTEE_BYDIVISION,
    DELETE_ASSIGNED_TASK_BYCOMMITTEE
} from '../../util/graphql';
import LoadingModal from '../../components/common/LoadingModal';
import OptionModal from '../../components/common/OptionModal';

const CommitteeListScreen = ({ navigation }) => {

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


    const [visibleDeleteDivision, setVisibleDeleteDivision] = useState(false);

    const onToggleSnackBarDeleteDivision = () => setVisibleDeleteDivision(!visibleDeleteDivision);

    const onDismissSnackBarDeleteDivision = () => setVisibleDeleteDivision(false);


    const [visibleAddDivision, setVisibleAddDivision] = useState(false);

    const onToggleSnackBarAddDivision = () => setVisibleAddDivision(!visibleAddDivision);

    const onDismissSnackBarAddDivision = () => setVisibleAddDivision(false);


    const [visibleUpdateDivision, setVisibleUpdateDivision] = useState(false);

    const onToggleSnackBarUpdateDivision = () => setVisibleUpdateDivision(!visibleUpdateDivision);

    const onDismissSnackBarUpdateDivision = () => setVisibleUpdateDivision(false);


    const [positionsValue, setPositionValue] = useState([]);
    const [staffsValue, setStaffsValue] = useState([]);
    const [committeesValue, setCommitteesValue] = useState([]);
    const [divisionsValue, setDivisionsValue] = useState([]);

    const { data: staffs, error: errorStaffs, loading: loadingStaffs, refetch: refetchStaffs } = useQuery(
        FETCH_STAFFS_QUERY,
        {
            variables: { organizationId: sime.user.id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setStaffsValue(staffs.getStaffs) }
        }
    );

    const { data: divisions, error: errorDivisions, loading: loadingDivisions, refetch: refetchDivisions } = useQuery(
        FETCH_DIVISIONS_QUERY,
        {
            variables: { projectId: sime.project_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setDivisionsValue(divisions.getDivisions) }
        }
    );

    const { data: positions, error: errorPositions, loading: loadingPositions, refetch: refetchPositions } = useQuery(
        FETCH_POSITIONS_QUERY,
        {
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setPositionValue(positions.getPositions) }
        }
    );

    const { data: committees, error: errorCommittees, loading: loadingCommittees, refetch: refetchCommittees } = useQuery(
        FETCH_COMMITTEES_QUERY,
        {
            variables: { projectId: sime.project_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                committees.getCommittees.sort(function (a, b) {
                    var textA = a.order;
                    var textB = b.order;

                    return textA.localeCompare(textB)
                });
                setCommitteesValue(committees.getCommittees)
            }
        }
    );

    const [loadExistData, { called, data: division, error: error2 }] = useLazyQuery(
        FETCH_DIVISION_QUERY,
        {
            variables: { divisionId: sime.division_id }
        });

    const [loadCommiteeData, { called: called2, data: commiteeInDiv, error: error3 }] = useLazyQuery(
        FETCH_COMMITTEES_IN_DIVISION_QUERY,
        {
            variables: { divisionId: sime.division_id }
        });

    const [divisionVal, setDivisionVal] = useState(null);
    const [committeeDivisionVal, setCommitteeDivisionVal] = useState(null);

    useEffect(() => {
        if (division) {
            setDivisionVal(division.getDivision)
        }
    }, [division])

    useEffect(() => {
        if (commiteeInDiv) {
            setCommitteeDivisionVal(commiteeInDiv.getCommitteesInDivision)
        }
    }, [commiteeInDiv])

    const selectItemHandler = () => {
        navigation.navigate('Committee Profile', {
            committeeId: sime.committee_id
        })
    };

    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [visibleFormDivision, setVisibleFormDivision] = useState(false);
    const [visibleFormEditDivision, setVisibleFormEditDivision] = useState(false);
    const [state, setState] = useState({ open: false });

    const onStateChange = ({ open }) => setState({ open });

    const { open } = state;

    const closeModal = () => {
        setVisible(false);
    }

    const closeModalForm = () => {
        setVisibleForm(false);
    }

    const closeModalFormDivision = () => {
        setVisibleFormDivision(false);
    }

    const closeModalFormEditDivision = () => {
        setVisibleFormEditDivision(false);
    }

    const longPressHandler = (id, name) => {
        setVisible(true);
        sime.setDivision_name(name)
        sime.setDivision_id(id)
        loadExistData();
        loadCommiteeData();
    }

    const openForm = () => {
        setVisibleForm(true);
    }

    const openFormDivision = () => {
        setVisibleFormDivision(true);
    }

    const openFormEditDivision = () => {
        closeModal();
        setVisibleFormEditDivision(true);
    }

    const addCommitteesStateUpdate = (e) => {
        const temp = [e, ...committeesValue];
        temp.sort(function (a, b) {
            var textA = a.order;
            var textB = b.order;

            return textA.localeCompare(textB)
        });
        setCommitteesValue(temp);
        onToggleSnackBarAdd();
    }

    const deleteCommitteesStateUpdate = (e) => {
        const temp = [...committeesValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e);
        temp.splice(index, 1);
        setCommitteesValue(temp);
        onToggleSnackBarDelete();
    }

    const updateCommitteesStateUpdate = (e) => {
        const temp = [...committeesValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e.id);
        temp[index] = e;
        temp.sort(function (a, b) {
            var textA = a.order;
            var textB = b.order;

            return textA.localeCompare(textB)
        });
        setCommitteesValue(temp);
        onToggleSnackBarUpdate();
    }

    const addDivisionsStateUpdate = (e) => {
        const temp = [e, ...divisionsValue];
        temp.sort(function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();

            return textA.localeCompare(textB)
        })
        setDivisionsValue(temp);
        onToggleSnackBarAddDivision();
    }

    const deleteDivisionsStateUpdate = (e) => {
        const temp = [...divisionsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e);
        temp.splice(index, 1);
        setDivisionsValue(temp);
        onToggleSnackBarDeleteDivision();
    }

    const updateDivisionsStateUpdate = (e) => {
        const temp = [...divisionsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e.id);
        temp[index] = e
        temp.sort(function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();

            return textA.localeCompare(textB)
        })
        setDivisionsValue(temp);
        onToggleSnackBarUpdateDivision();
    }

    const updateDivisionStateUpdate = (e) => {
        setDivisionVal(e)
    }

    const divisionId = sime.division_id;

    const [deleteAssignedTaskByCommittee] = useMutation(DELETE_ASSIGNED_TASK_BYCOMMITTEE);

    const deleteAssignedTaskByCommitteeHandler = () => {
        committeeDivisionVal.map((committee) => {
            deleteAssignedTaskByCommittee(({
                variables: { committeeId: committee.id },
            }))
        })
    };

    const [deleteCommitteeByDivision] = useMutation(DELETE_COMMITTEE_BYDIVISION);

    const [deleteDivision, { loading: loadingDelete }] = useMutation(DELETE_DIVISION, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_DIVISIONS_QUERY,
                variables: { projectId: sime.project_id },
            });
            data.getDivisions = data.getDivisions.filter((d) => d.id !== divisionId);
            deleteDivisionsStateUpdate(divisionId);
            deleteCommitteeByDivision({
                update() {
                    onRefresh();
                },
                variables: { divisionId }
            })
            deleteAssignedTaskByCommitteeHandler();
            proxy.writeQuery({ query: FETCH_DIVISIONS_QUERY, data, variables: { projectId: sime.project_id } });
        },
        variables: {
            divisionId
        }
    });


    const onRefresh = () => {
        refetchCommittees();
        refetchDivisions();
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
        closeModalFormEditDivision();
        Alert.alert('Are you sure?', 'Do you really want to delete this division?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: confirmToDeleteAll
            }
        ]);
    };

    const confirmToDeleteAll = () => {
        Alert.alert('Wait... are you really sure?', "By deleting this division, it's also delete all committees inside this division and all related to the committees", [
            { text: 'Cancel', style: 'default' },
            {
                text: 'Agree',
                style: 'destructive',
                onPress: deleteDivision
            }
        ]);
    };

    if (errorStaffs) {
        console.error(errorStaffs);
        return <Text>errorStaffs</Text>;
    }

    if (errorDivisions) {
        console.error(errorDivisions);
        return <Text>errorDivisions</Text>;
    }

    if (errorPositions) {
        console.error(errorPositions);
        return <Text>errorPositions</Text>;
    }

    if (errorCommittees) {
        console.error(errorCommittees);
        return <Text>errorCommittees</Text>;
    }

    if (called & error2) {
        console.error(error2);
        return <Text>Error</Text>;
    }

    if (called2 & error3) {
        console.error(error3);
        return <Text>Error3</Text>;
    }

    if (divisionsValue.length === 0) {
        return (
            <View style={styles.content}>
                <Text>No divisions found, let's add divisions!</Text>
            </View>
        );
    }

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingStaffs && loadingPositions && loadingDivisions && loadingCommittees}
                        onRefresh={onRefresh} />
                }
                data={divisionsValue}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <DivisionCard
                        name={itemData.item.name}
                        division_id={itemData.item.id}
                        staffs={staffsValue}
                        divisions={divisionsValue}
                        positions={positionsValue}
                        committees={committeesValue}
                        onSelect={selectItemHandler}
                        deleteCommitteesStateUpdate={deleteCommitteesStateUpdate}
                        updateCommitteesStateUpdate={updateCommitteesStateUpdate}
                        onLongPress={() => { longPressHandler(itemData.item.id, itemData.item.name) }}
                    />
                )}
            />
            <OptionModal
                visible={visible}
                closeModal={closeModal}
                title={sime.division_name}
                openFormEdit={openFormEditDivision}
                deleteHandler={deleteHandler}
            />
            <FAB.Group
                open={open}
                icon={open ? 'account-multiple-plus' : 'plus'}
                actions={[
                    {
                        icon: 'account',
                        label: 'Committee',
                        onPress: openForm
                    },
                    {
                        icon: 'account-multiple',
                        label: 'Division',
                        onPress: openFormDivision
                    },
                ]}
                onStateChange={onStateChange}
            />
            <FormCommittee
                closeModalForm={closeModalForm}
                visibleForm={visibleForm}
                closeButton={closeModalForm}
                staffs={staffsValue}
                divisions={divisionsValue}
                positions={positionsValue}
                committees={committeesValue}
                addCommitteesStateUpdate={addCommitteesStateUpdate}
            />
            <FormDivision
                closeModalForm={closeModalFormDivision}
                visibleForm={visibleFormDivision}
                closeButton={closeModalFormDivision}
                addDivisionsStateUpdate={addDivisionsStateUpdate}
            />
            <FormEditDivision
                closeModalForm={closeModalFormEditDivision}
                visibleForm={visibleFormEditDivision}
                division={divisionVal}
                deleteButton={deleteHandler}
                closeButton={closeModalFormEditDivision}
                updateDivisionStateUpdate={updateDivisionStateUpdate}
                updateDivisionsStateUpdate={updateDivisionsStateUpdate}
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
                Committee added!
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
                Committee updated!
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
                Committee deleted!
            </Snackbar>
            <Snackbar
                visible={visibleAddDivision}
                onDismiss={onDismissSnackBarAddDivision}
                action={{
                    label: 'dismiss',
                    onPress: () => {
                        onDismissSnackBarAddDivision();
                    },
                }}
            >
                Division added!
            </Snackbar>
            <Snackbar
                visible={visibleUpdateDivision}
                onDismiss={onDismissSnackBarUpdateDivision}
                action={{
                    label: 'dismiss',
                    onPress: () => {
                        onDismissSnackBarUpdateDivision();
                    },
                }}
            >
                Division updated!
            </Snackbar>
            <Snackbar
                visible={visibleDeleteDivision}
                onDismiss={onDismissSnackBarDeleteDivision}
                action={{
                    label: 'dismiss',
                    onPress: () => {
                        onDismissSnackBarDeleteDivision();
                    },
                }}
            >
                Division deleted!
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