import React, { useContext, useState, useEffect } from 'react';
import { Alert, StyleSheet, ScrollView, View, RefreshControl, SectionList } from 'react-native';
import moment from 'moment';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { Provider, Text, Snackbar } from 'react-native-paper';

import FABbutton from '../../components/common/FABbutton';
import RundownContainer from '../../components/rundown/RundownContainer';
import RundownTime from '../../components/rundown/RundownTime';
import FormRundown from '../../components/rundown/FormRundown';
import FormEditRundown from '../../components/rundown/FormEditRundown';
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';
import {
  FETCH_RUNDOWNS_QUERY,
  FETCH_RUNDOWN_QUERY,
  DELETE_RUNDOWN,
  FETCH_EVENT_QUERY
} from '../../util/graphql';
import LoadingModal from '../../components/common/LoadingModal';
import OptionModal from '../../components/common/OptionModal';

const RundownScreen = ({ navigation }) => {
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

  const { data: rundowns, error: errorRundowns, loading: loadingRundowns, refetch: refetchRundowns } = useQuery(
    FETCH_RUNDOWNS_QUERY, {
    variables: {
      eventId: sime.event_id
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      rundowns.getRundowns.sort(function (a, b) {
        var dateA = new Date(a.date).toLocaleDateString();
        var dateB = new Date(b.date).toLocaleDateString();

        var timeA = new Date(a.start_time).toLocaleTimeString();
        var timeB = new Date(b.start_time).toLocaleTimeString();

        return dateA - dateB || timeA - timeB
      })
      setRundownsValTemp(rundowns.getRundowns);
    }
  });

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

  const [loadExistData, { called, data: rundown, error: errorRundown }] = useLazyQuery(
    FETCH_RUNDOWN_QUERY,
    {
      variables: { rundownId: sime.rundown_id },
      onCompleted: () => { setRundownVal(rundown.getRundown) }
    });

  const [rundownsValTemp, setRundownsValTemp] = useState([]);
  const [rundownsVal, setRundownsVal] = useState([]);
  const [rundownVal, setRundownVal] = useState(null);
  const [eventVal, setEventVal] = useState(null);

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
    return () => {
      console.log("This will be logged on unmount");
    }
  }, [rundownsValTemp, rundowns, setRundownsVal])

  useEffect(() => {
    if (rundown) {
      setRundownVal(rundown.getRundown)
    }
    return () => {
      console.log("This will be logged on unmount");
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

  const [deleteRundown, { loading: loadingDelete }] = useMutation(DELETE_RUNDOWN, {
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
    refetchRundowns();
    refetchEvent();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      onRefresh();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);


  if (errorRundowns) {
    console.error(errorRundowns);
    return <Text>errorRundowns</Text>;
  }

  if (errorEvent) {
    console.error(errorEvent);
    return <Text>errorEvent</Text>;
  }

  if (called & errorRundown) {
    console.error(errorRundown);
    return <Text>errorRundown</Text>;
  }

  if (rundownsVal.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loadingRundowns && loadingEvent}
            onRefresh={onRefresh} />
        }
      >
        <Text>No agendas found, let's add agendas!</Text>
        <FABbutton Icon="plus" onPress={openForm} />
        <FormRundown
          closeModalForm={closeModalForm}
          visibleForm={visibleForm}
          closeButton={closeModalForm}
          addRundownsStateUpdate={addRundownsStateUpdate}
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
          }}
        >
          Agenda added!
            </Snackbar>
        <Snackbar
          visible={visibleDelete}
          onDismiss={onDismissSnackBarDelete}
          action={{
            label: 'dismiss',
            onPress: () => {
              onDismissSnackBarDelete();
            },
          }}
        >
          Agenda deleted!
            </Snackbar>
      </ScrollView>
    );
  }

  return (
    <Provider theme={theme}>
     
        <SectionList
          refreshControl={
            <RefreshControl
              refreshing={loadingRundowns && loadingEvent}
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
          ListFooterComponent={()=>(
            <View style={{marginTop: 7}}></View>
          )}
        />
      
      <OptionModal
        visible={visible}
        closeModal={closeModal}
        title={sime.rundown_agenda}
        openFormEdit={openFormEdit}
        deleteHandler={deleteHandler}
      />
      <FABbutton Icon="plus" onPress={openForm} />
      <FormRundown
        closeModalForm={closeModalForm}
        visibleForm={visibleForm}
        closeButton={closeModalForm}
        addRundownsStateUpdate={addRundownsStateUpdate}
        event={eventVal}
      />
      <FormEditRundown
        closeModalForm={closeModalFormEdit}
        visibleForm={visibleFormEdit}
        deleteButton={deleteHandler}
        closeButton={closeModalFormEdit}
        rundown={rundownVal}
        updateRundownStateUpdate={updateRundownStateUpdate}
        updateRundownsStateUpdate={updateRundownsStateUpdate}
        event={eventVal}
      />
      <Snackbar
        visible={visibleAdd}
        onDismiss={onToggleSnackBarAdd}
        action={{
          label: 'dismiss',
          onPress: () => {
            onToggleSnackBarAdd();
          },
        }}
      >
        Agenda added!
            </Snackbar>
      <Snackbar
        visible={visibleUpdate}
        onDismiss={onDismissSnackBarUpdate}
        action={{
          label: 'dismiss',
          onPress: () => {
            onDismissSnackBarUpdate();
          },
        }}
      >
        Agenda updated!
            </Snackbar>
      <Snackbar
        visible={visibleDelete}
        onDismiss={onDismissSnackBarDelete}
        action={{
          label: 'dismiss',
          onPress: () => {
            onDismissSnackBarDelete();
          },
        }}
      >
        Agenda deleted!
            </Snackbar>
      <LoadingModal loading={loadingDelete} />
    </Provider>
  );
}

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
});

export default RundownScreen;