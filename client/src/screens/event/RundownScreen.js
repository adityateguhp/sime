import React, { useContext, useState } from 'react';
import { Text, StyleSheet, ScrollView, View } from 'react-native';
import moment from 'moment';
import { Provider } from 'react-native-paper';

import FABbutton from '../../components/common/FABbutton';
import RundownContainer from '../../components/event/RundownContainer';
import RundownTime from '../../components/event/RundownTime';
import FormRundown from '../../components/event/FormRundown';
import { RUNDOWNS } from '../../data/dummy-data';
import { SimeContext } from '../../provider/SimePovider';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';

const RundownScreen = props => {

  const sime = useContext(SimeContext);

  const eventRundown = RUNDOWNS.filter(rd => rd.event_id.indexOf(sime.event_id) >= 0);

  const [visibleForm, setVisibleForm] = useState(false);

  const openForm = () => {
    setVisibleForm(true);
  }

  const closeModalForm = () => {
    setVisibleForm(false);
  }

  const groupBy = function (data, key) {
    return data.reduce(function (storage, item) {
      var group = item[key];
      storage[group] = storage[group] || [];
      storage[group].push(item);
      return storage;
    }, {});
  };

  const groubedByDate = groupBy(eventRundown, 'date')

  const deleteHandler = () => {
    setVisible(false);
    Alert.alert('Are you sure?', 'Do you really want to delete this event?', [
      { text: 'No', style: 'default' },
      {
        text: 'Yes',
        style: 'destructive'
      }
    ]);
  };

  return (
    <Provider theme={theme}>
      <ScrollView style={{ marginTop: 5 }}>
        {Object.keys(groubedByDate).map((category) => (
          <View style={styles.container}>
            <RundownContainer key={category} date={moment(category).format('ddd, MMM D YYYY')} />
            {groubedByDate[category].map((obj) => (
              <RundownTime key={obj._id} start_time={moment(obj.start_time).format('LT')} end_time={moment(obj.end_time).format('LT')} agenda={obj.agenda} details={obj.details} />
            ))}
          </View>
        ))}
      </ScrollView>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    elevation: 3,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 4
  }
});

export default RundownScreen;