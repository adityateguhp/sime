import React, { useContext, useState, useEffect } from 'react';
import { Alert, StyleSheet, ScrollView, View, TouchableOpacity, TouchableNativeFeedback, Platform, RefreshControl, SectionList } from 'react-native';
import moment from 'moment';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Provider, Portal, Title, Text, Snackbar } from 'react-native-paper';
import { NetworkStatus } from '@apollo/client';

import FABbutton from '../../components/common/FABbutton';
import RundownContainer from '../../components/event/RundownContainer';
import RundownTime from '../../components/event/RundownTime';
import FormRundown from '../../components/event/FormRundown';
import FormEditRundown from '../../components/event/FormEditRundown';
import { SimeContext } from '../../context/SimePovider';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';
import { FETCH_RUNDOWNS_QUERY, FETCH_RUNDOWN_QUERY, DELETE_RUNDOWN } from '../../util/graphql';
import CenterSpinner from '../../components/common/CenterSpinner';

const RundownScreen = props => {

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

  const { data: rundowns, error: errorRundowns, loading: loadingRundowns, refetch, networkStatus } = useQuery(
    FETCH_RUNDOWNS_QUERY, {
    variables: {
      eventId: sime.event_id
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      setRundownsValTemp(rundowns.getRundowns);
    }
  });

  const [loadExistData, { called, data: rundown, error: errorRundown, loading: loadingRundown }] = useLazyQuery(
    FETCH_RUNDOWN_QUERY,
    {
      variables: { rundownId: sime.rundown_id },
      onCompleted: () => { setRundownVal(rundown.getRundown) }
    });

  const [rundownsValTemp, setRundownsValTemp] = useState([]);
  const [rundownsVal, setRundownsVal] = useState([]);
  const [rundownVal, setRundownVal] = useState(null);

  const [visible, setVisible] = useState(false);
  const [visibleForm, setVisibleForm] = useState(false);
  const [visibleFormEdit, setVisibleFormEdit] = useState(false);

  useEffect(() => {
    if (rundownsValTemp) {
      let dataSource = rundownsValTemp.reduce(function (sections, item) {

        let section = sections.find(section => section.date === item.date);

        if (!section) {
          section = { date: item.date, data: [] };
          sections.push(section);
        }

        section.data.push(item);

        return sections;

      }, []);
      setRundownsVal(dataSource)
    }
  }, [rundownsValTemp, rundowns, setRundownsVal])

  useEffect(() => {
    if (rundown) {
      setRundownVal(rundown.getRundown)
    }
  }, [rundown])

  const closeModal = () => {
    setVisible(false);
  }

  const closeModalForm = () => {
    setVisibleForm(false);
  }

  const closeModalFormEdit = () => {
    setVisibleFormEdit(false);
  }

  const longPressHandler = (agenda, id) => {
    setVisible(true);
    sime.setRundown_id(id)
    sime.setRundown_agenda(agenda)
    loadExistData()
  }

  const openForm = () => {
    setVisibleForm(true);
  }

  const openFormEdit = () => {
    closeModal();
    setVisibleFormEdit(true);
  }

  const [deleteRundown] = useMutation(DELETE_RUNDOWN, {
    update(proxy) {
      const data = proxy.readQuery({
        query: FETCH_RUNDOWNS_QUERY,
        variables: { eventId: sime.event_id }
      });
      rundowns.getRundowns = rundowns.getRundowns.filter((e) => e.id !== sime.rundown_id);
      deleteRundownsStateUpdate(sime.rundown_id)
      proxy.writeQuery({ query: FETCH_RUNDOWNS_QUERY, data, variables: { eventId: sime.event_id } });
    },
    variables: {
      rundownId: sime.rundown_id
    }
  });

  const deleteHandler = () => {
    closeModal();
    closeModalFormEdit();
    Alert.alert('Are you sure?', 'Do you really want to delete this agenda?', [
      { text: 'No', style: 'default' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: deleteRundown
      }
    ]);
  };

  const addRundownsStateUpdate = (e) => {
    const temp = [e, ...rundownsValTemp];
    temp.sort(function (a, b) {
      var dateA = new Date(a.date);
      var dateB = new Date(b.date);

      var timeA = new Date(a.start_time);
      var timeB = new Date(b.start_time);

      return dateA - dateB || timeA - timeB
    })
    setRundownsValTemp(temp)
    let dataSource = temp.reduce(function (sections, item) {

      let section = sections.find(section => section.date === item.date);

      if (!section) {
        section = { date: item.date, data: [] };
        sections.push(section);
      }

      section.data.push(item);

      return sections;

    }, []);
    setRundownsVal(dataSource)
    onToggleSnackBarAdd();
  }

  const deleteRundownsStateUpdate = (e) => {
    const temp = [...rundownsValTemp];
    const index = temp.map(function (item) {
      return item.id
    }).indexOf(e);
    temp.splice(index, 1);
    setRundownsValTemp(temp)
    let dataSource = temp.reduce(function (sections, item) {

      let section = sections.find(section => section.date === item.date);

      if (!section) {
        section = { date: item.date, data: [] };
        sections.push(section);
      }

      section.data.push(item);

      return sections;

    }, []);
    setRundownsVal(dataSource)
    onToggleSnackBarDelete();
  }

  const updateRundownsStateUpdate = (e) => {
    const temp = [...rundownsValTemp];
    const index = temp.map(function (item) {
      return item.id
    }).indexOf(e.id);
    temp[index] = e
    temp.sort(function (a, b) {
      var dateA = new Date(a.date);
      var dateB = new Date(b.date);

      var timeA = new Date(a.start_time);
      var timeB = new Date(b.start_time);

      return dateA - dateB || timeA - timeB
    })
    setRundownsValTemp(temp)
    onToggleSnackBarUpdate();
  }

  const updateRundownStateUpdate = (e) => {
    setRundownVal(e)
  }


  const onRefresh = () => {
    refetch();
  };


  if (errorRundowns) {
    console.error(errorRundowns);
    return <Text>errorRundowns</Text>;
  }

  if (loadingRundowns) {
    return <CenterSpinner />;
  }

  if (called & errorRundown) {
    console.error(errorRundown);
    return <Text>errorRundown</Text>;
  }

  if (loadingRundown) {

  }

  if (rundownsVal.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loadingRundowns}
            onRefresh={onRefresh} />
        }
      >
        <Text>No agendas found, let's add agendas!</Text>
        <FABbutton Icon="plus" label="agenda" onPress={openForm} />
        <FormRundown
          closeModalForm={closeModalForm}
          visibleForm={visibleForm}
          closeButton={closeModalForm}
          addRundownsStateUpdate={addRundownsStateUpdate}
        />
        <Snackbar
          visible={visibleAdd}
          onDismiss={onDismissSnackBarAdd}
        >
          Agenda added!
            </Snackbar>
        <Snackbar
          visible={visibleDelete}
          onDismiss={onDismissSnackBarDelete}
        >
          Agenda deleted!
            </Snackbar>
      </ScrollView>
    );
  }

  if (networkStatus === NetworkStatus.refetch) console.log('Refetching rundowns!');

  return (
    <Provider theme={theme}>
      <View style={styles.container}>
        <SectionList
          refreshControl={
            <RefreshControl
              refreshing={loadingRundowns}
              onRefresh={onRefresh} />
          }
          sections={rundownsVal}
          keyExtractor={(item, index) => item.id + index}
          renderItem={
            ({ item, index, section }) => (
              <RundownTime
                key={index}
                start_time={moment(item.start_time).format('LT')}
                end_time={moment(item.end_time).format('LT')}
                agenda={item.agenda}
                details={item.details}
                onLongPress={() => { longPressHandler(item.agenda, item.id) }}
              />
            )
          }
          renderSectionHeader={
            ({ section: { date } }) => (
              <RundownContainer key={date} date={moment(date).format('dddd, MMM D YYYY')} />
            )
          }
        />
      </View>
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
            <Title style={{ marginTop: wp(4), marginHorizontal: wp(5), marginBottom: 5, fontSize: wp(4.86) }} numberOfLines={1} ellipsizeMode='tail'>{sime.rundown_agenda}</Title>
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
      <FABbutton Icon="plus" label="agenda" onPress={openForm} />
      <FormRundown
        closeModalForm={closeModalForm}
        visibleForm={visibleForm}
        closeButton={closeModalForm}
        addRundownsStateUpdate={addRundownsStateUpdate}
      />
      <FormEditRundown
        closeModalForm={closeModalFormEdit}
        visibleForm={visibleFormEdit}
        deleteButton={deleteHandler}
        closeButton={closeModalFormEdit}
        rundown={rundownVal}
        updateRundownStateUpdate={updateRundownStateUpdate}
        updateRundownsStateUpdate={updateRundownsStateUpdate}
      />
      <Snackbar
        visible={visibleAdd}
        onDismiss={onDismissSnackBarAdd}
      >
        Agenda added!
            </Snackbar>
      <Snackbar
        visible={visibleUpdate}
        onDismiss={onDismissSnackBarUpdate}
      >
        Agenda updated!
            </Snackbar>
      <Snackbar
        visible={visibleDelete}
        onDismiss={onDismissSnackBarDelete}
      >
        Agenda deleted!
            </Snackbar>
    </Provider>
  );
}

const modalMenuWidth = wp(77);
const modalMenuHeight = wp(35);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    elevation: 3,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 4
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
  }
});

export default RundownScreen;