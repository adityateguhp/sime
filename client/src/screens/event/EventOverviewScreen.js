import React, { useState, useContext} from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, List, Avatar, Subheading, Paragraph, Divider, Provider, Title, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';

import Status from '../../components/common/Status';
import ModalProfile from '../../components/common/ModalProfile';
import { EVENTS, EXTERNALS } from '../../data/dummy-data';
import { SimeContext } from '../../context/SimePovider';
import ExternalList from '../../components/event/ExternalList';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';
import CenterSpinner from '../../components/common/CenterSpinner';
import { FETCH_EVENT_QUERY, FETCH_EXBYTYPE_QUERY, FETCH_EXTERNAL_QUERY } from '../../util/graphql';

const EventOverviewScreen = props => {
  const sime = useContext(SimeContext);

  const [event, setEvent] = useState({
    description: '',
    start_date: '',
    end_date: '',
    cancel: false,
    location: ''
  });

  const [external, setExternal] = useState({
    id: '',
    name: '',
    email: '',
    phone_number: '',
    picture: ''
  });

  const [visible, setVisible] = useState(false);

  const selectInfoHandler = (id) => {
    props.navigation.navigate('External Profile', {
      externalId: id
    });
    setVisible(false);
  };

  const openModal = (id) => {
    sime.setExternal_id(id);
    loadExternalData();
    if (loadingExternalData === false || externalData) {
      setVisible(true);
    }
  }

  const closeModal = () => {
    setVisible(false);
  }

  const { data: eventData, error: errorEventData, loading: loadingEventData } = useQuery(
    FETCH_EVENT_QUERY, {
    variables: {
      eventId: sime.event_id
    },
    onCompleted: () => {
      setEvent({
        description: eventData.getEvent.description,
        start_date: eventData.getEvent.start_date,
        end_date: eventData.getEvent.end_date,
        cancel: eventData.getEvent.cancel,
        location: eventData.getEvent.location
      })
    }
  });

  const { data: guestData, error: errorGuestData, loading: loadingGuestData } = useQuery(
    FETCH_EXBYTYPE_QUERY, {
    variables: {
      eventId: sime.event_id,
      externalType: '5f684a4b6101fe2a38fe4904'
    },
  });

  const { data: sponsorData, error: errorSponsorData, loading: loadingSponsorData } = useQuery(
    FETCH_EXBYTYPE_QUERY, {
    variables: {
      eventId: sime.event_id,
      externalType: '5f684a726101fe2a38fe4905'
    },
  });

  const { data: mediaPartnerData, error: errorMediaPartnerData, loading: loadingMediaPartnerData } = useQuery(
    FETCH_EXBYTYPE_QUERY, {
    variables: {
      eventId: sime.event_id,
      externalType: '5f684a856101fe2a38fe4906'
    },
  });

  const [loadExternalData, { called: calledExternalData, data: externalData, error: errorExternalData, loading: loadingExternalData }] = useLazyQuery(
    FETCH_EXTERNAL_QUERY, {
    variables: {
      externalId: sime.external_id
    },
    onCompleted: () => {
      setExternal({
        id: externalData.getExternal.id,
        name: externalData.getExternal.name,
        picture: externalData.getExternal.picture,
        phone_number: externalData.getExternal.phone_number,
        email: externalData.getExternal.email
      })
    }
  });

  if (errorEventData) {
    console.error(errorEventData);
    return <Text>errorEventData</Text>;
  }

  if (errorGuestData) {
    console.error(errorGuestData);
    return <Text>errorGuestData</Text>;
  }

  if (errorSponsorData) {
    console.error(errorSponsorData);
    return <Text>errorSponsorData</Text>;
  }

  if (errorMediaPartnerData) {
    console.error(errorMediaPartnerData);
    return <Text>errorMediaPartnerData</Text>;
  }

  if (calledExternalData && errorExternalData) {
    console.error(errorExternalData);
    return <Text>errorExternalData</Text>;
  }

  if (loadingEventData) {
    return <CenterSpinner />;
  }

  if (loadingGuestData) {
    return <CenterSpinner />;
  }

  if (loadingMediaPartnerData) {
    return <CenterSpinner />;
  }

  if (loadingSponsorData) {
    return <CenterSpinner />;
  }

  const startDate = moment(event.start_date).format('ddd, MMM D YYYY');
  const endDate = moment(event.end_date).format('ddd, MMM D YYYY');

  return (
    <Provider theme={theme}>
      <ScrollView style={styles.overviewContainer}>
        <View style={styles.overview}>
          <Subheading style={{ fontWeight: 'bold' }}>Guests</Subheading>
          {
            guestData.getExternalByType.length === 0? <Text>-</Text> :
            guestData.getExternalByType.map((Guest) => (
              <ExternalList
                key={Guest.id}
                name={Guest.name}
                picture={Guest.picture}
                size={35}
                onSelect={() => { openModal(Guest.id) }}
              />
            ))
          }
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Sponsors</Subheading>
          {
            sponsorData.getExternalByType.length === 0? <Text>-</Text> :
            sponsorData.getExternalByType.map((Sponsor) => (
              <ExternalList
                key={Sponsor.id}
                name={Sponsor.name}
                picture={Sponsor.picture}
                size={35}
                onSelect={() => { openModal(Sponsor.id) }}
              />
            ))
          }
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Media Partners</Subheading>
          {
            mediaPartnerData.getExternalByType.length === 0? <Text>-</Text> :
            mediaPartnerData.getExternalByType.map((Media) => (
              <ExternalList
                key={Media.id}
                name={Media.name}
                picture={Media.picture}
                size={35}
                onSelect={() => { openModal(Media.id) }}
              />
            )) 
          }
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Status</Subheading>
          <List.Item
            left={() =>
              <Status start_date={event.start_date} end_date={event.end_date} cancel={event.cancel} fontSize={wp(3)} />}
          />
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Event Description</Subheading>
          <List.Item
            title={event.description === null || event.description === '' ? "-" : event.description}
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
              event.location === null || event.location === '' ? "-" :
              <Text>
                <Icon name="map-marker" size={16} color='black' /> {event.location}
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
        name={external.name}
        email={external.email}
        phone_number={external.phone_number}
        picture={external.picture}
        positionName={false}
        onPressInfo={() => { selectInfoHandler(external.id) }}
        onPressIn={closeModal}
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