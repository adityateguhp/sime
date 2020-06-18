import React, { useState, useContext } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, List, Avatar, Subheading, Paragraph, Divider, Provider, Title, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Status from '../../components/common/Status';
import ModalProfile from '../../components/common/ModalProfile';

import { EVENTS, EXTERNALS } from '../../data/dummy-data';
import { SimeContext } from '../../provider/SimePovider';
import ExternalList from '../../components/event/ExternalList';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';

const EventOverviewScreen = props => {
  const sime = useContext(SimeContext);

  const selectedEvent = EVENTS.find(evnt => evnt._id === sime.event_id);

  const selectInfoHandler = (_id) => {
    props.navigation.navigate('External Profile', {
      externalId: _id
  });
    setVisible(false);
  };

  const [visible, setVisible] = useState(false);

  const openModal= (external_id) => {
    setVisible(true);
    sime.setExternal_id(external_id);
  }

  const closeModal= () => {
    setVisible(false);
  }

  const ExternalGuest = EXTERNALS.filter(external => external.event_id.indexOf(sime.event_id) >= 0 && external.external_type.indexOf('et1') >= 0);

  const ExternalSponsor = EXTERNALS.filter(external => external.event_id.indexOf(sime.event_id) >= 0 && external.external_type.indexOf('et2') >= 0);

  const ExternalMedia = EXTERNALS.filter(external => external.event_id.indexOf(sime.event_id) >= 0 && external.external_type.indexOf('et3') >= 0);

  const ExternalModal = EXTERNALS.find(external => external._id.indexOf(sime.external_id) >= 0);

  const startDate = moment(selectedEvent.event_start_date).format('ddd, MMM D YYYY');
  const endDate = moment(selectedEvent.event_end_date).format('ddd, MMM D YYYY');

  return (
    <Provider theme={theme}>
      <ScrollView style={styles.overviewContainer}>
        <View style={styles.overview}>
          <Subheading style={{ fontWeight: 'bold' }}>Guests</Subheading>
          {
            ExternalGuest.map((Guest) => (
              <ExternalList
                key={Guest._id}
                name={Guest.name}
                picture={Guest.picture}
                size={35}
                onSelect={() => { openModal(Guest._id) }}
              />
            ))
          }
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Sponsors</Subheading>
          {
            ExternalSponsor.map((Sponsor) => (
              <ExternalList
                key={Sponsor._id}
                name={Sponsor.name}
                picture={Sponsor.picture}
                size={35}
                onSelect={() => { openModal(Sponsor._id) }}
              />
            ))
          }
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Media Partners</Subheading>
          {
            ExternalMedia.map((Media) => (
              <ExternalList
                key={Media._id}
                name={Media.name}
                picture={Media.picture}
                size={35}
                onSelect={() => { openModal(Media._id) }}
              />
            ))
          }
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Status</Subheading>
          <List.Item
            left={() =>
              <Status start_date={selectedEvent.event_start_date} end_date={selectedEvent.event_end_date} cancel={selectedEvent.cancel} fontSize={wp(3)} />}
          />
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Event Description</Subheading>
          <List.Item
            title={selectedEvent.event_description}
            titleNumberOfLines={10}
            titleStyle={{ textAlign: 'justify' }}
          />
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Event Date</Subheading>
          <List.Item
            title={
              <Text>
                <Icon name="calendar" size={16} color='black' /> {startDate} - {endDate}
              </Text>}
            titleNumberOfLines={10}
            titleStyle={{ textAlign: 'justify' }}
          />
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Location</Subheading>
          <List.Item
            title={
              <Text>
                <Icon name="map-marker" size={16} color='black' /> {selectedEvent.event_location}
              </Text>}
            titleNumberOfLines={10}
            titleStyle={{ textAlign: 'justify' }}
          />
        </View>
      </ScrollView>
      <ModalProfile
        visible={visible}
        onBackButtonPress={closeModal}
        onBackdropPress={closeModal}
        name={ExternalModal.name}
        email={ExternalModal.email}
        phone_number={ExternalModal.phone_number}
        picture={ExternalModal.picture}
        positionName={false}
        onPressInfo={()=>{selectInfoHandler(ExternalModal._id)}}
      />
    </Provider>
  );
}

const overviewWidth = wp(100);
const overviewHeight = hp(100);
const modalWidth = wp(77);
const modalHeight = hp(100) > 550 ? wp(107) : wp(115);
const modalMargin = hp(10);

const styles = StyleSheet.create({
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 10
  },
  screen: {
    flex: 1
  },
  overviewContainer: {
    backgroundColor: 'white'
  },
  overview: {
    marginVertical: 10,
    marginHorizontal: 20
  },
  overviewDivider: {
    marginVertical: 5
  },
  picture: {
    width: modalWidth,
    height: modalWidth
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    backgroundColor: 'white',
    height: modalHeight,
    width: modalWidth,
    alignSelf: 'center',
    marginBottom: modalMargin,
    justifyContent: 'flex-start'
  },
  status: {
    fontSize: wp(3),
  },
});

export default EventOverviewScreen;