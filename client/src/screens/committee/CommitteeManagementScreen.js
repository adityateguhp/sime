import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { FlatList, Alert, StyleSheet, View, RefreshControl } from 'react-native';
import { Provider, Text, Snackbar, FAB } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FormEditCommittee from '../../components/committee/FormEditCommittee';
import FormCommittee from '../../components/committee/FormCommittee';
import CommitteeCard from '../../components/committee/CommitteeCard';
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';
import {
  FETCH_COMMITTEES_QUERY,
  FETCH_COMMITTEE_QUERY,
  FETCH_PICS_IN_COMMITTEE_QUERY,
  DELETE_COMMITTEE,
  DELETE_PIC_BYCOMMITTEE,
  DELETE_ASSIGNED_TASK_BYPIC
} from '../../util/graphql';
import LoadingModal from '../../components/common/LoadingModal';
import OptionModal from '../../components/common/OptionModal';
import FABbutton from '../../components/common/FABbutton';
import Colors from '../../constants/Colors';

const CommitteeManagementScreen = ({ navigation }) => {

  const sime = useContext(SimeContext);

  const [visibleDeleteCommittee, setVisibledeleteCommittee] = useState(false);

  const onToggleSnackBarDeleteCommittee = () => setVisibledeleteCommittee(!visibleDeleteCommittee);

  const onDismissSnackBarDeleteCommittee = () => setVisibledeleteCommittee(false);


  const [visibleAddCommittee, setVisibleaddCommittee] = useState(false);

  const onToggleSnackBarAddCommittee = () => setVisibleaddCommittee(!visibleAddCommittee);

  const onDismissSnackBarAddCommittee = () => setVisibleaddCommittee(false);


  const [visibleUpdateCommittee, setVisibleupdateCommittee] = useState(false);

  const onToggleSnackBarUpdateCommittee = () => setVisibleupdateCommittee(!visibleUpdateCommittee);

  const onDismissSnackBarUpdateCommittee = () => setVisibleupdateCommittee(false);


  const [committeesValue, setCommitteesValue] = useState([]);
  const [committeeVal, setCommitteeVal] = useState(null);
  const [picInCommitteeVal, setPicInCommittee] = useState(null);

  const { data: committees, error: errorCommittees, loading: loadingCommittees, refetch: refetchCommittees } = useQuery(
    FETCH_COMMITTEES_QUERY,
    {
      variables: { organizationId: sime.user.organization_id },
      notifyOnNetworkStatusChange: true,
      onCompleted: () => { setCommitteesValue(committees.getCommittees) }
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

  useEffect(() => {
    if (committee) {
      setCommitteeVal(committee.getCommittee)
    }
    return () => {
      console.log("This will be logged on unmount");
    }
  }, [committee])

  useEffect(() => {
    if (picInCommittee) {
      setPicInCommittee(picInCommittee.getPersonInChargesInCommittee)
    }
    return () => {
      console.log("This will be logged on unmount");
    }
  }, [picInCommittee])


  const [visible, setVisible] = useState(false);
  const [visibleFormCommittee, setVisibleFormCommittee] = useState(false);
  const [visibleFormEditCommittee, setVisibleFormEditCommittee] = useState(false);

  const closeModal = () => {
    setVisible(false);
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

  const openFormCommittee = () => {
    setVisibleFormCommittee(true);
  }

  const openFormEditCommittee = () => {
    closeModal();
    setVisibleFormEditCommittee(true);
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
    picInCommitteeVal.map((pic) => {
      deleteAssignedTaskByPersonInCharge(({
        variables: { personInChargeId: pic.id },
      }))
    })
  };

  const [deletePersonInChargeByCommittee] = useMutation(DELETE_PIC_BYCOMMITTEE);

  const [deleteCommittee, { loading: loadingDelete }] = useMutation(DELETE_COMMITTEE, {
    update(proxy) {
      const data = proxy.readQuery({
        query: FETCH_COMMITTEES_QUERY,
        variables: { organizationId: sime.user.organization_id },
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
      proxy.writeQuery({ query: FETCH_COMMITTEES_QUERY, data, variables: { organizationId: sime.user.organization_id } });
    },
    variables: {
      committeeId
    }
  });


  const onRefresh = () => {
    refetchCommittees();
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
            refreshing={loadingCommittees}
            onRefresh={onRefresh} />
        }
        data={committeesValue}
        keyExtractor={item => item.id}
        renderItem={itemData => (
          <CommitteeCard
            name={itemData.item.name}
            core={itemData.item.core}
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
      <FABbutton Icon="plus" onPress={openFormCommittee} />
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



export default CommitteeManagementScreen;