import React, { useContext, useState, useEffect } from 'react';
import { Alert, StyleSheet, ScrollView, View, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import moment from 'moment';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Provider, Portal, Title, Text } from 'react-native-paper';

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


const RundownScreen = props => {

  const sime = useContext(SimeContext);

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  const { data: rundowns, error: errorRundowns, loading: loadingRundowns } = useQuery(
    FETCH_RUNDOWNS_QUERY, {
    variables: {
      eventId: sime.event_id
    },
  });

  const [loadExistData, { called, data: rundown, error: errorRundown, loading: loadingRundown }] = useLazyQuery(
    FETCH_RUNDOWN_QUERY,
    {
      variables: { rundownId: sime.rundown_id },
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
    setRundownVal(rundown.getRundown);
  }

  const groupBy = function (data, key) {
    return data.reduce(function (storage, item) {
      var group = item[key];
      storage[group] = storage[group] || [];
      storage[group].push(item);
      return storage;
    }, {});
  };

  const rundownDataFetch = () => {
    if (rundowns) {
      setRundownsVal(rundowns.getRundowns)
    }
  }

  useEffect(() => {
    console.log("mounted rundownDataFetch")
    rundownDataFetch()
    return () => {
      console.log("This will be logged on unmount rundownDataFetch");
    }
  }, [rundowns])

  const groubedByDate = groupBy(rundownsVal, 'date')

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
      <ScrollView style={{ marginTop: 5 }}>
        {Object.keys(groubedByDate).map((category) => (
          <View style={styles.container}>
            <RundownContainer key={category} date={moment(category).format('dddd, MMM D YYYY')} />
            {groubedByDate[category].map((obj) => (
              <RundownTime
                key={obj.id}
                start_time={moment(obj.start_time).format('LT')}
                end_time={moment(obj.end_time).format('LT')}
                agenda={obj.agenda}
                details={obj.details}
                onLongPress={() => { longPressHandler(obj.agenda, obj.id) }}
              />
            ))}
          </View>
        ))}
      </ScrollView>
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