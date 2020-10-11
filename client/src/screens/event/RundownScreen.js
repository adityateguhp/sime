import React, { useContext, useState, useCallback } from 'react';
import { Alert, StyleSheet, ScrollView, View, TouchableOpacity, TouchableNativeFeedback, Platform, RefreshControl, SectionList } from 'react-native';
import moment from 'moment';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Provider, Portal, Title, Text } from 'react-native-paper';
import sortBy from 'array-sort-by';

import FABbutton from '../../components/common/FABbutton';
import RundownContainer from '../../components/event/RundownContainer';
import RundownTime from '../../components/event/RundownTime';
import FormRundown from '../../components/event/FormRundown';
import { RUNDOWNS } from '../../data/dummy-data';
import { SimeContext } from '../../context/SimePovider';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';
import { FETCH_RUNDOWNS_QUERY, FETCH_RUNDOWN_QUERY, DELETE_RUNDOWN } from '../../util/graphql';
import CenterSpinner from '../../components/common/CenterSpinner';
import { set } from 'react-native-reanimated';

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

const RundownScreen = props => {

  const sime = useContext(SimeContext);

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  const [refreshing, setRefreshing] = useState(false);

  const { data: rundowns, error: errorRundowns, loading: loadingRundowns, refetch } = useQuery(
    FETCH_RUNDOWNS_QUERY, {
    variables: {
      eventId: sime.event_id
    },
    onCompleted: () => {
      let dataSource = rundowns.getRundowns.reduce(function (sections, item) {

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
  });

  const [loadExistData, { called, data: rundown, error: errorRundown, loading: loadingRundown }] = useLazyQuery(
    FETCH_RUNDOWN_QUERY,
    {
      variables: { rundownId: sime.rundown_id },
      onCompleted: () => { setRundownVal(rundown.getRundown) }
    });

  const [rundownsVal, setRundownsVal] = useState([]);
  const [rundownVal, setRundownVal] = useState(null);

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

  const onRefresh = useCallback(() => {
    setRefreshing(true), refetch();
    if (loadingRundowns) {
      return <CenterSpinner />;
    } else {
      setRefreshing(false)
    }
  }, []);

  const [deleteRundown] = useMutation(DELETE_RUNDOWN, {
    update(proxy) {
      const data = proxy.readQuery({
        query: FETCH_RUNDOWNS_QUERY,
        variables: { eventId: sime.event_id }
      });
      rundowns.getRundowns = rundowns.getRundowns.filter((e) => e.id !== sime.rundown_id);
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

  if (rundowns.getRundowns.length === 0) {
    return (
      <View style={styles.content}>
        <Text>No agendas found, let's add agendas!</Text>
        <FABbutton Icon="plus" label="agenda" onPress={openForm} />
        <FormRundown
          closeModalForm={closeModalForm}
          visibleForm={visibleForm}
          closeButton={closeModalForm}
        />
      </View>
    );
  }


  return (
    <Provider theme={theme}>
      <View style={styles.container}>
        <SectionList
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
            <Title style={{ marginTop: wp(4), marginHorizontal: wp(5), marginBottom: 5, fontSize: wp(4.86) }}>{sime.rundown_agenda}</Title>
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
        deleteButton={deleteHandler}
        closeButton={closeModalForm}
      />
    </Provider>
  );
}

const modalMenuWidth = wp(77);
const modalMenuHeight = wp(35);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    elevation: 3,
    marginVertical: 5,
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
  },
});

export default RundownScreen;