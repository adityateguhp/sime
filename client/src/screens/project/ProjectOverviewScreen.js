import React, { useState, useContext, useCallback, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Image } from 'react-native';
import { Text, List, Avatar, Subheading, Divider, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { NetworkStatus } from '@apollo/client';

import Status from '../../components/common/Status';
import ModalProfile from '../../components/common/ModalProfile';
import { FETCH_STAFF_QUERY, FETCH_PROJECT_QUERY, FETCH_POSITION_QUERY, FETCH_HEADPROJECT_QUERY, FETCH_ORGANIZATION_QUERY } from '../../util/graphql';
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
    cancel: false,
    organization_id: '',
    picture: ''
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

  const [organization, setOrganization] = useState({
    name: '',
    email: '',
    picture: ''
  });

  const [position, setPosition] = useState({
    name: ''
  });

  const selectInfoHandler = (id) => {
    props.navigation.navigate('Committee Profile', {
      committeeId: id
    });
    setVisible(false);
  };

  const selectOrganizationHandler = (organization_id) => {
    props.navigation.navigate('Staff Organization Profile', {
      organizationId: organization_id,
    })
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
          cancel: projectData.getProject.cancel,
          organization_id: projectData.getProject.organization_id,
          picture: projectData.getProject.picture
        });
        loadOrganizationData();
      }
    });

  const { data: headProjectData, error: error2, loading: loading2, refetch: refetchHeadProject, networkStatus: networkStatusHeadProject } = useQuery(
    FETCH_HEADPROJECT_QUERY, {
    variables: {
      projectId: sime.project_id,
      order: '1'
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
      }
    }
  });

  const [loadStaffData, { called: called1, data: staffData, error: error3, loading: loading3, refetch: refetchStaff, networkStatus: networkStatusStaff }] = useLazyQuery(
    FETCH_STAFF_QUERY, {
    variables: {
      staffId: headProject.staff_id
    },
    notifyOnNetworkStatusChange: true
  });

  const [loadPositionData, { called: called2, data: positionData, error: error4, loading: loading4, refetch: refecthPositions, networkStatus: networkStatusPosition }] = useLazyQuery(
    FETCH_POSITION_QUERY, {
    variables: {
      positionId: headProject.position_id
    },
    notifyOnNetworkStatusChange: true
  });

  const [loadOrganizationData, { called: called3, data: organizationData, error: error5, loading: loading5, refetch: refetchOrganization, networkStatus: networkStatusOrganization }] = useLazyQuery(
    FETCH_ORGANIZATION_QUERY,
    {
      variables: { organizationId: project.organization_id },
      notifyOnNetworkStatusChange: true
    });

  useEffect(() => {
    if (staffData) {
      setStaff({
        name: staffData.getStaff.name,
        email: staffData.getStaff.email,
        phone_number: staffData.getStaff.phone_number,
        picture: staffData.getStaff.picture
      })
    }
  }, [staffData])

  useEffect(() => {
    if (positionData) {
      setPosition({
        name: positionData.getPosition.name
      })
    }
  }, [positionData])

  useEffect(() => {
    if (organizationData) {
      setOrganization({
        name: organizationData.getOrganization.name,
        email: organizationData.getOrganization.email,
        picture: organizationData.getOrganization.picture
      })
    }
  }, [organizationData])

  const onRefresh = () => {
    refetchProject();
    refetchOrganization();
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

  if (called3 && error5) {
    console.error(error5);
    return <Text>Error 5</Text>;
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

  if (loading5) {
    return <CenterSpinner />;
  }

  if (networkStatusProject === NetworkStatus.refetch) console.log('Refetching project!');
  if (networkStatusHeadProject === NetworkStatus.refetch) console.log('Refetching head project!');
  if (networkStatusPosition === NetworkStatus.refetch) console.log('Refetching position!');
  if (networkStatusStaff === NetworkStatus.refetch) console.log('Refetching staff!');
  if (networkStatusOrganization === NetworkStatus.refetch) console.log('Refetching organization!');

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
          <View  style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={project.picture === null || project.picture === '' ? require('../../assets/folder.png') : { uri: project.picture }}
            />
          </View>
          <Subheading style={{ fontWeight: 'bold' }}>Organization</Subheading>
          <List.Item
            title={organization.name === null || organization.name === '' ? "-" : organization.name}
            left={() => <Avatar.Image size={35} source={organization.picture === null || organization.picture === '' ? require('../../assets/avatar.png') : { uri: organization.picture }} />}
            onPress={() => { selectOrganizationHandler(project.organization_id) }}
          />
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
            onPressInfo={() => { selectInfoHandler(headProject.id) }}
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
    marginBottom: 10,
    marginHorizontal: 20
  },
  overviewDivider: {
    marginVertical: 5
  },
  imageContainer:{
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

export default ProjectOverviewScreen;