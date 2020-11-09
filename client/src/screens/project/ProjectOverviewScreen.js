import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Image } from 'react-native';
import { Text, List, Avatar, Subheading, Divider, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';

import Status from '../../components/common/Status';
import ModalProfile from '../../components/common/ModalProfile';
import {
  FETCH_STAFF_QUERY,
  FETCH_PROJECT_QUERY,
  FETCH_POSITION_QUERY,
  FETCH_HEADPROJECT_QUERY,
  FETCH_ORGANIZATION_QUERY
} from '../../util/graphql';
import { SimeContext } from '../../context/SimePovider';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';

const ProjectOverviewScreen = ({ navigation }) => {
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
    navigation.navigate('Committee Profile', {
      committeeId: id
    });
    setVisible(false);
  };

  const selectOrganizationHandler = (organization_id) => {
    navigation.navigate('Staff Organization Profile', {
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

  const { data: projectData, error: error1, loading: loading1, refetch: refetchProject } = useQuery(
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

  const { data: headProjectData, error: error2, loading: loading2, refetch: refetchHeadProject } = useQuery(
    FETCH_HEADPROJECT_QUERY, {
    variables: {
      projectId: sime.project_id,
      order: '1'
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
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
        setHeadProject({
          id: headProjectData.getHeadProject.id,
          position_id: headProjectData.getHeadProject.position_id,
          staff_id: headProjectData.getHeadProject.staff_id,
        });
        loadStaffData();
        loadPositionData();
        if (staffData) {
          setStaff({
            name: staffData.getStaff.name,
            email: staffData.getStaff.email,
            phone_number: staffData.getStaff.phone_number,
            picture: staffData.getStaff.picture
          })
        }
        if (positionData) {
          setPosition({
            name: positionData.getPosition.name
          })
        }
      }
    }
  });

  const [loadStaffData, { called: called1, data: staffData, error: error3 }] = useLazyQuery(
    FETCH_STAFF_QUERY, {
    variables: {
      staffId: headProject.staff_id
    },
    notifyOnNetworkStatusChange: true
  });

  const [loadPositionData, { called: called2, data: positionData, error: error4 }] = useLazyQuery(
    FETCH_POSITION_QUERY, {
    variables: {
      positionId: headProject.position_id
    },
    notifyOnNetworkStatusChange: true
  });

  const [loadOrganizationData, { called: called3, data: organizationData, error: error5 }] = useLazyQuery(
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
    refetchHeadProject();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      onRefresh();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

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

  const startDate = moment(project.start_date).format('ddd, MMM D YYYY');
  const endDate = moment(project.end_date).format('ddd, MMM D YYYY');

  return (
    <Provider theme={theme}>
      <ScrollView
        style={styles.overviewContainer}
        refreshControl={
          <RefreshControl
            refreshing={loading1 && loading2}
            onRefresh={onRefresh} />
        }
      >
        <View style={styles.overview}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={project.picture ? { uri: project.picture } : require('../../assets/folder.png')}
            />
          </View>
          <Subheading style={{ fontWeight: 'bold' }}>Organization</Subheading>
          <List.Item
            title={organization.name ? organization.name : "-"}
            left={() => <Avatar.Image size={35} source={organization.picture ? { uri: organization.picture } : require('../../assets/avatar.png')} />}
            onPress={() => { selectOrganizationHandler(project.organization_id) }}
          />
          <Subheading style={{ fontWeight: 'bold' }}>Head of Project</Subheading>
          <List.Item
            title={staff.name ? staff.name : "-"}
            left={() => <Avatar.Image size={35} source={staff.picture ? { uri: staff.picture } : require('../../assets/avatar.png')} />}
            onPress={headProjectData.getHeadProject? openModal : null}
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
            title={project.description ? project.description : "-"}
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
        headProjectData.getHeadProject ?
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
          /> : null
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

export default ProjectOverviewScreen;