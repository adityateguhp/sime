import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Image } from 'react-native';
import { Text, List, Subheading, Divider, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useQuery } from '@apollo/react-hooks';

import Status from '../../components/common/Status';
import { SimeContext } from '../../context/SimePovider';
import ExternalList from '../../components/event/ExternalList';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';
import { FETCH_EVENT_QUERY, FETCH_EXBYTYPE_QUERY } from '../../util/graphql';

const EventOverviewScreen = ({ navigation }) => {
  const sime = useContext(SimeContext);

  const [event, setEvent] = useState({
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    picture: ''
  });

  const [guest, setGuest] = useState([])

  const [sponsor, setSponsor] = useState([])

  const [media, setMedia] = useState([])

  const { data: eventData, error: errorEventData, loading: loadingEventData, refetch: refetchEvent } = useQuery(
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
        location: eventData.getEvent.location,
        picture: eventData.getEvent.picture
      })
    }
  });

  const { data: guestData, error: errorGuestData, loading: loadingGuestData, refetch: refetchGuest } = useQuery(
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

  const { data: sponsorData, error: errorSponsorData, loading: loadingSponsorData, refetch: refetchSponsor } = useQuery(
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

  const { data: mediaPartnerData, error: errorMediaPartnerData, loading: loadingMediaPartnerData, refetch: refetchMedia } = useQuery(
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

  const onRefresh = () => {
    refetchEvent();
    refetchGuest();
    refetchMedia();
    refetchSponsor();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      onRefresh();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

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

  const startDate = moment(event.start_date).format('ddd, MMM D YYYY');
  const endDate = moment(event.end_date).format('ddd, MMM D YYYY');

  return (
    <Provider theme={theme}>
      <ScrollView
        style={styles.overviewContainer}
        refreshControl={
          <RefreshControl
            refreshing={loadingGuestData && loadingEventData && loadingMediaPartnerData && loadingSponsorData}
            onRefresh={onRefresh} />
        }
      >
        <View style={styles.overview}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={event.picture ? { uri: event.picture } : require('../../assets/calendar.png')}
            />
          </View>
          <Subheading style={{ fontWeight: 'bold' }}>Guests</Subheading>
          {
            guest.length === 0 ? <Text>-</Text> :
              guest.map((Guest) => (
                <ExternalList
                  key={Guest.id}
                  id={Guest.id}
                  name={Guest.name}
                  picture={Guest.picture}
                  email={Guest.email}
                  phone_number={Guest.phone_number}
                  size={35}
                  navigation={navigation}
                  eventOverview={true}
                />
              ))
          }
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Sponsors</Subheading>
          {
            sponsor.length === 0 ? <Text>-</Text> :
              sponsor.map((Sponsor) => (
                <ExternalList
                  key={Sponsor.id}
                  id={Sponsor.id}
                  name={Sponsor.name}
                  picture={Sponsor.picture}
                  email={Sponsor.email}
                  phone_number={Sponsor.phone_number}
                  size={35}
                  navigation={navigation}
                  eventOverview={true}
                />
              ))
          }
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Media Partners</Subheading>
          {
            media.length === 0 ? <Text>-</Text> :
              media.map((Media) => (
                <ExternalList
                  key={Media.id}
                  id={Media.id}
                  name={Media.name}
                  picture={Media.picture}
                  email={Media.email}
                  phone_number={Media.phone_number}
                  size={35}
                  navigation={navigation}
                  eventOverview={true}
                />
              ))
          }
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Status</Subheading>
          <List.Item
            left={() =>
              <Status start_date={event.start_date} end_date={event.end_date} fontSize={wp(3)} />}
          />
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Event Description</Subheading>
          <List.Item
            title={event.description ? event.description : "-"}
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
              event.location ?
                <Text>
                  <Icon name="map-marker" size={16} color='black' /> {event.location}
                </Text>
                :
                "-"}
            titleNumberOfLines={10}
            titleStyle={{ textAlign: 'justify' }}
          />
        </View>
      </ScrollView>
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
    marginBottom: 10,
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
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 15,
    backgroundColor: Colors.primaryColor,
    elevation: 5
  },
  image: {
    height: wp(50),
    width: wp(100),
  }
});

export default EventOverviewScreen;