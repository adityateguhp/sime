import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, FlatList } from 'react-native';
import { Text, List, Avatar, Subheading, Paragraph, Divider, Provider, Title, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { NetworkStatus } from '@apollo/client';

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

  const [guest, setGuest] = useState([])

  const [sponsor, setSponsor] = useState([])

  const [media, setMedia] = useState([])

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

  const { data: eventData, error: errorEventData, loading: loadingEventData, refetch: refetchEvent, networkStatus: networkStatusEvent } = useQuery(
    FETCH_EVENT_QUERY, {
    variables: {
      eventId: sime.event_id
    },
    notifyOnNetworkStatusChange: true,
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

  const { data: guestData, error: errorGuestData, loading: loadingGuestData, refetch: refetchGuest, networkStatus: networkStatusGuest } = useQuery(
    FETCH_EXBYTYPE_QUERY, {
    variables: {
      eventId: sime.event_id,
      externalType: '5f684a4b6101fe2a38fe4904'
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
     setGuest(guestData.getExternalByType)
    }
  });

  const { data: sponsorData, error: errorSponsorData, loading: loadingSponsorData, refetch: refetchSponsor, networkStatus: networkStatusSponsor } = useQuery(
    FETCH_EXBYTYPE_QUERY, {
    variables: {
      eventId: sime.event_id,
      externalType: '5f684a726101fe2a38fe4905'
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      setSponsor(sponsorData.getExternalByType)
     }
  });

  const { data: mediaPartnerData, error: errorMediaPartnerData, loading: loadingMediaPartnerData, refetch: refetchMedia, networkStatus: networkStatusMedia } = useQuery(
    FETCH_EXBYTYPE_QUERY, {
    variables: {
      eventId: sime.event_id,
      externalType: '5f684a856101fe2a38fe4906'
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      setMedia(mediaPartnerData.getExternalByType)
     }
  });

  const [loadExternalData, { called: calledExternalData, data: externalData, error: errorExternalData, loading: loadingExternalData }] = useLazyQuery(
    FETCH_EXTERNAL_QUERY, {
    variables: {
      externalId: sime.external_id
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (externalData) {
      setExternal({
        id: externalData.getExternal.id,
        name: externalData.getExternal.name,
        picture: externalData.getExternal.picture,
        phone_number: externalData.getExternal.phone_number,
        email: externalData.getExternal.email
      })
    }
  }, [externalData])

  const onRefresh = () => {
    refetchEvent();
    refetchGuest();
    refetchMedia();
    refetchSponsor();
  };

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

  if (loadingExternalData) {

  }

  if (networkStatusEvent === NetworkStatus.refetch) return console.log('Refetching event!');
  if (networkStatusGuest === NetworkStatus.refetch) return console.log('Refetching guest!');
  if (networkStatusMedia === NetworkStatus.refetch) return console.log('Refetching media!');
  if (networkStatusSponsor === NetworkStatus.refetch) return console.log('Refetching sponsor!');


  const startDate = moment(event.start_date).format('ddd, MMM D YYYY');
  const endDate = moment(event.end_date).format('ddd, MMM D YYYY');

  return (
    <Provider theme={theme}>
      <ScrollView
        style={styles.overviewContainer}
        refreshControl={
          <RefreshControl
            refreshing={loadingGuestData}
            onRefresh={onRefresh} />
        }
      >
        <View style={styles.overview}>
          <Subheading style={{ fontWeight: 'bold' }}>Guests</Subheading>
          <FlatList
            data={guest}
            keyExtractor={item => item.id}
            renderItem={itemData => (
              <ExternalList
                name={itemData.item.name}
                picture={itemData.item.picture}
                size={35}
                onSelect={() => { openModal(itemData.item.id) }}
              />
            )}
            ListEmptyComponent={
              <Text>-</Text>
            }
          />
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Sponsors</Subheading>
          <FlatList
            data={sponsor}
            keyExtractor={item => item.id}
            renderItem={itemData => (
              <ExternalList
                name={itemData.item.name}
                picture={itemData.item.picture}
                size={35}
                onSelect={() => { openModal(itemData.item.id) }}
              />
            )}
            ListEmptyComponent={
              <Text>-</Text>
            }
          />
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Media Partners</Subheading>
          <FlatList
            data={media}
            keyExtractor={item => item.id}
            renderItem={itemData => (
              <ExternalList
                name={itemData.item.name}
                picture={itemData.item.picture}
                size={35}
                onSelect={() => { openModal(itemData.item.id) }}
              />
            )}
            ListEmptyComponent={
              <Text>-</Text>
            }
          />
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