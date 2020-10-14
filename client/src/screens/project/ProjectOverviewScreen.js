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

  const [project, setProject] = useState({
    start_date: '',
    end_date: '',
    description: '',
    cancel: false
  });

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

  const { data: projectData, error: error1, loading: loading1, refetch: refetchProject, networkStatus: networkStatusProject } = useQuery(
    FETCH_PROJECT_QUERY,
    {
      variables: { projectId: sime.project_id },
      notifyOnNetworkStatusChange: true,
      onCompleted: () => {
        setProject({
          start_date: projectData.getProject.start_date,
          end_date: projectData.getProject.end_date,
          description: projectData.getProject.description,
          cancel: projectData.getProject.cancel
        });
        console.log('fecthed project');
      }
    });

  const { data: headProjectData, error: error2, loading: loading2, refetch: refetchHeadProject, networkStatus: networkStatusHeadProject } = useQuery(
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
        });
        loadStaffData();
        loadPositionData();
        console.log('fecthed head project');
      }
    }
  });

  const [loadStaffData, { called: called1, data: staffData, error: error3, loading: loading3, refetch: refetchStaff, networkStatus: networkStatusStaff }] = useLazyQuery(
    FETCH_STAFF_QUERY, {
    variables: {
      staffId: headProject.staff_id
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      setStaff({
        name: staffData.getStaff.name,
        email: staffData.getStaff.email,
        phone_number: staffData.getStaff.phone_number,
        picture: staffData.getStaff.picture
      })
      console.log('fecthed staff');
    }
  });

  const [loadPositionData, { called: called2, data: positionData, error: error4, loading: loading4, refetch: refecthPositions, networkStatus: networkStatusPosition }] = useLazyQuery(
    FETCH_POSITION_QUERY, {
    variables: {
      positionId: headProject.position_id
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      setPosition({
        name: positionData.getPosition.name
      })
      console.log('fecthed position');
    }
  });

  const onRefresh = () => {
    refetchProject();
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

  if (error1) {
    console.error(error1);
    return <Text>Error 1</Text>;
  }

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

  if (loading1) {
    return <CenterSpinner />;
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

  if (networkStatusProject === NetworkStatus.refetch) return console.log('Refetching project!');
  if (networkStatusHeadProject === NetworkStatus.refetch) return console.log('Refetching head project!');
  if (networkStatusPosition === NetworkStatus.refetch) return console.log('Refetching position!');
  if (networkStatusStaff === NetworkStatus.refetch) return console.log('Refetching staff!');

  const startDate = moment(project.start_date).format('ddd, MMM D YYYY');
  const endDate = moment(project.end_date).format('ddd, MMM D YYYY');

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
              <Status start_date={project.start_date} end_date={project.end_date} cancel={project.cancel} fontSize={wp(3)} />}
          />
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Project Description</Subheading>
          <List.Item
            title={project.description === null || project.description === '' ? "-" : project.description}
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