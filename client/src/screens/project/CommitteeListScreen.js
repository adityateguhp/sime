import React, { useContext, useState, useReducer } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { FlatList, Alert, StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Platform, RefreshControl, ScrollView } from 'react-native';
import { Provider, Portal, Title, Text, Snackbar } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { NetworkStatus } from '@apollo/client';

import FABbutton from '../../components/common/FABbutton';
import CenterSpinner from '../../components/common/CenterSpinner';
import FormCommittee from '../../components/project/FormCommittee';
import FormEditDivision from '../../components/project/FormEditDivision';
import DivisionCard from '../../components/project/DivisionCard';
import { SimeContext } from '../../context/SimePovider';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';
import { FETCH_DIVISIONS_QUERY, FETCH_STAFFS_QUERY, FETCH_POSITIONS_QUERY, FETCH_COMMITTEES_QUERY, DELETE_DIVISION, FETCH_DIVISION_QUERY } from '../../util/graphql';

const CommitteeListScreen = ({ navigation }) => {
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

    const [positionsValue, setPositionValue] = useState([]);
    const [staffsValue, setStaffsValue] = useState([]);
    const [committeesValue, setCommitteesValue] = useState([]);
    const [divisionsValue, setDivisionsValue] = useState([]);

    const { data: staffs, error: errorStaffs, loading: loadingStaffs, refetch: refetchStaffs, networkStatus: networkStatusStaffs } = useQuery(
        FETCH_STAFFS_QUERY,
        {
            variables: {organizationId: sime.user.id},
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setStaffsValue(staffs.getStaffs) }
        }
    );

    const { data: divisions, error: errorDivisions, loading: loadingDivisions, refetch: refetchDivisions, networkStatus: networkStatusDivisions } = useQuery(
        FETCH_DIVISIONS_QUERY,
        {
            variables: { projectId: sime.project_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setDivisionsValue(divisions.getDivisions) }
        }
    );

    const { data: positions, error: errorPositions, loading: loadingPositions, refetch: refetchPositions, networkStatus: networkStatusPositions } = useQuery(
        FETCH_POSITIONS_QUERY,
        {
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setPositionValue(positions.getPositions) }
        }
    );

    const { data: committees, error: errorCommittees, loading: loadingCommittees, refetch: refetchCommittees, networkStatus: networkStatusCommittees } = useQuery(
        FETCH_COMMITTEES_QUERY,
        {
            variables: { projectId: sime.project_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setCommitteesValue(committees.getCommittees)
            }
        }
    );

    const [loadExistData, { called, data: division, error: error2, loading: loading2 }] = useLazyQuery(
        FETCH_DIVISION_QUERY,
        {
            variables: { divisionId: sime.division_id },
            onCompleted: () => {
                setDivisionVal(division.getDivision);
            },
        });

    const [divisionVal, setDivisionVal] = useState(null);

    const selectItemHandler = () => {
        navigation.navigate('Committee Profile', {
            committeeId: sime.committee_id
        })
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
        sime.setDivision_name(name)
        sime.setDivision_id(id)
        loadExistData();
    }

    const openForm = () => {
        setVisibleForm(true);
    }

    const openFormEdit = () => {
        closeModal();
        setVisibleFormEdit(true);
    }

    const addCommitteesStateUpdate = (e) => {
        setCommitteesValue([...committeesValue, e]);
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
        setCommitteesValue(temp);
        onToggleSnackBarUpdate();
    }

    const divisionId = sime.division_id;

    const [deleteDivision] = useMutation(DELETE_DIVISION, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_DIVISIONS_QUERY,
                variables: { projectId: sime.project_id },
            });
            divisionsValue = divisionsValue.filter((d) => d.id !== divisionId);
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

    const deleteHandler = () => {
        closeModal();
        closeModalFormEdit();
        Alert.alert('Are you sure?', 'Do you really want to delete this client?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
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

    if (loadingStaffs) {
        return <CenterSpinner />;
    }

    if (loadingDivisions) {
        return <CenterSpinner />;
    }

    if (loadingPositions) {
        return <CenterSpinner />;
    }

    if (loadingCommittees) {
        return <CenterSpinner />;
    }

    if (called & error2) {
        console.error(error2);
        return <Text>Error</Text>;
    }

    if (loading2) {

    }

    if (divisionsValue.length === 0) {
        return (
            <View style={styles.content}>
                <Text>No divisions found, let's add divisions!</Text>
            </View>
        );
    }

    if (networkStatusCommittees === NetworkStatus.refetch) console.log('Refetching committees!');
    if (networkStatusDivisions === NetworkStatus.refetch) console.log('Refetching head divisions!');
    if (networkStatusStaffs === NetworkStatus.refetch) console.log('Refetching staffs!');
    if (networkStatusPositions === NetworkStatus.refetch) console.log('Refetching positions!');

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                refreshControl={
                    <RefreshControl
                      refreshing={loadingCommittees}
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
                    />
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
                        <Title style={{ marginTop: wp(4), marginHorizontal: wp(5), marginBottom: 5, fontSize: wp(4.86) }}>{sime.division_name}</Title>
                        <TouchableCmp onPress={openFormEdit}>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Edit</Text>
                            </View>
                        </TouchableCmp>
                        <TouchableCmp onPress={deleteHandler}>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Delete division</Text>
                            </View>
                        </TouchableCmp>
                    </View>
                </Modal>
            </Portal>
            <FABbutton Icon="plus" label="COMMITTEE" onPress={openForm} />
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
            <FormEditDivision
                closeModalForm={closeModalFormEdit}
                visibleForm={visibleFormEdit}
                division={divisionVal}
                deleteButton={deleteHandler}
                closeButton={closeModalFormEdit}
            />
            <Snackbar
                visible={visibleAdd}
                onDismiss={onDismissSnackBarAdd}
            >
                Committee added!
            </Snackbar>
            <Snackbar
                visible={visibleUpdate}
                onDismiss={onDismissSnackBarUpdate}
            >
                Committee updated!
            </Snackbar>
            <Snackbar
                visible={visibleDelete}
                onDismiss={onDismissSnackBarDelete}
            >
                Committee deleted!
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



export default CommitteeListScreen;