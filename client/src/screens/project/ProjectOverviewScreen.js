import React, { useState, useContext, useCallback, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Text, List, Avatar, Subheading, Divider, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { NetworkStatus } from '@apollo/client';

import Status from '../../components/common/Status';
import ModalProfile from '../../components/common/ModalProfile';
import { FETCH_STAFF_QUERY, FETCH_PROJECT_QUERY, FETCH_POSITION_QUERY, FETCH_HEADPROJECT_QUERY } from '../../util/graphql';
import { SimeContext } from '../../context/SimePovider';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';
import CenterSpinner from '../../components/common/CenterSpinner';

const ProjectOverviewScreen = props => {
  const sime = useContext(SimeContext);

  const [headProject, setHeadProject] = useState({
    id: '',
    staff_id: '',
    position_id: '',
  });

  const [staff, setStaff] = useState({
    name: '',
    email: '',
    phone_number: '',
    picture: ''
  });

  const [position, setPosition] = useState({
    name: ''
  });

  const selectItemHandler = (id) => {
    props.navigation.navigate('Committee Profile', {
      committeeId: id
    });
    setVisible(false);
  };

  const [visible, setVisible] = useState(false);

  const openModal = () => {
    setVisible(true);
  }

  const closeModal = () => {
    setVisible(false);
  }

  const { data: headProjectData, error: error2, loading: loading2, refetch: refetchHeadProject, networkStatus } = useQuery(
    FETCH_HEADPROJECT_QUERY, {
    variables: {
      projectId: sime.project_id,
      positionId: '5f58d8288ba59232dcda020d'
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      if (headProjectData.getHeadProject === null) {
        return;
      } else {
        setHeadProject({
          id: headProjectData.getHeadProject.id,
          position_id: headProjectData.getHeadProject.position_id,
          staff_id: headProjectData.getHeadProject.staff_id,
        })
        loadStaffData()
        loadPositionData()
        console.log('fecthed')
      }
    }
  });

  const [loadStaffData, { called: called1, data: staffData, error: error3, loading: loading3, refetch: refetchStaff }] = useLazyQuery(
    FETCH_STAFF_QUERY, {
    variables: {
      staffId: headProject.staff_id
    },
    onCompleted: () => {
      setStaff({
        name: staffData.getStaff.name,
        email: staffData.getStaff.email,
        phone_number: staffData.getStaff.phone_number,
        picture: staffData.getStaff.picture
      })
      console.log('staffFetct')
    }
  });

  const [loadPositionData, { called: called2, data: positionData, error: error4, loading: loading4, refetch: refecthPositions }] = useLazyQuery(
    FETCH_POSITION_QUERY, {
    variables: {
      positionId: headProject.position_id
    },
    onCompleted: () => {
      setPosition({
        name: positionData.getPosition.name
      })
      console.log('posFetct')
    }
  });

  const onRefresh = () => {
    refetchHeadProject();
    if (headProjectData.getHeadProject === null) {
      setStaff(
        {
          name: '',
          email: '',
          phone_number: '',
          picture: ''
        }
      );
      setPosition(
        {
          name: ''
        }
      )
    } else {
      refetchStaff();
      refecthPositions();
      setStaff({
        name: staffData.getStaff.name,
        email: staffData.getStaff.email,
        phone_number: staffData.getStaff.phone_number,
        picture: staffData.getStaff.picture
      })
      setPosition({
        name: positionData.getPosition.name
      })
    }
  };


  if (error2) {
    console.error(error2);
    return <Text>Error 2</Text>;
  }

  if (called1 && error3) {
    console.error(error3);
    return <Text>Error 3</Text>;
  }

  if (called2 && error4) {
    console.error(error4);
    return <Text>Error 4</Text>;
  }

  if (loading2) {
    return <CenterSpinner />;
  }

  if (loading3) {
    return <CenterSpinner />;
  }

  if (loading4) {
    return <CenterSpinner />;
  }

  if (networkStatus === NetworkStatus.refetch) return console.log('Refetching!');

  const startDate = moment(sime.projectData.start_date).format('ddd, MMM D YYYY');
  const endDate = moment(sime.projectData.end_date).format('ddd, MMM D YYYY');

  return (
    <Provider theme={theme}>
      <ScrollView
        style={styles.overviewContainer}
        refreshControl={
          <RefreshControl
            refreshing={loading4}
            onRefresh={onRefresh} />
        }
      >
        <View style={styles.overview}>
          <Subheading style={{ fontWeight: 'bold' }}>Head of Project</Subheading>
          <List.Item
            title={staff.name === null || staff.name === '' ? "-" : staff.name}
            left={() => <Avatar.Image size={35} source={staff.picture === null || staff.picture === '' ? require('../../assets/avatar.png') : { uri: staff.picture }} />}
            onPress={openModal}
          />
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Status</Subheading>
          <List.Item
            left={() =>
              <Status start_date={sime.projectData.start_date} end_date={sime.projectData.end_date} cancel={sime.projectData.cancel} fontSize={wp(3)} />}
          />
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Project Description</Subheading>
          <List.Item
            title={sime.projectData.description === null || sime.projectData.description === '' ? "-" : sime.projectData.description}
            titleNumberOfLines={10}
            titleStyle={{ textAlign: 'justify' }}
          />
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Project Work Date</Subheading>
          <List.Item
            title={
              <Text>
                <Icon name="calendar" size={16} color='black' /> {startDate} - {endDate}
              </Text>}
            titleNumberOfLines={10}
            titleStyle={{ textAlign: 'justify' }}
          />
        </View>
      </ScrollView>
      {
        headProjectData.getHeadProject === null ? null :
          <ModalProfile
            visible={visible}
            onBackButtonPress={closeModal}
            onBackdropPress={closeModal}
            name={staff.name}
            position_name={position.name}
            email={staff.email}
            phone_number={staff.phone_number}
            picture={staff.picture}
            positionName={true}
            onPressInfo={() => { selectItemHandler(headProject.id) }}
            onPressIn={closeModal}
          />
      }

    </Provider>
  );
}

const overviewWidth = wp(100);
const overviewHeight = hp(100);

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
  }
});

export default ProjectOverviewScreen;