import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Avatar, Text} from 'react-native-paper';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { SimeContext } from '../../context/SimePovider';
import { FETCH_STAFF_QUERY, FETCH_COMMITTEE_QUERY } from '../../util/graphql';
import ProjectListScreen from '../../screens/project/ProjectListScreen';
import ProjectOverviewScreen from '../../screens/project/ProjectOverviewScreen';
import CommitteeListScreen from '../../screens/committee/CommitteeListScreen';
import EventListScreen from '../../screens/event/EventListScreen';
import EventOverviewScreen from '../../screens/event/EventOverviewScreen';
import TaskScreen from '../../screens/task/TaskScreen';
import RoadmapScreen from '../../screens/roadmap/RoadmapScreen';
import ExternalScreen from '../../screens/external/ExternalScreen';
import RundownScreen from '../../screens/rundown/RundownScreen';
import ExternalListScreen from '../../screens/external/ExternalListScreen';
import ExternalProfileScreen from '../../screens/external/ExternalProfileScreen';
import PersonInChargeProfileScreen from '../../screens/committee/PersonInChargeProfileScreen';
import StaffOrganizationProfileScreen from '../../screens/user_profile/StaffOrganizationProfileScreen';
import Colors from '../../constants/Colors';

const TopTabProject = createMaterialTopTabNavigator();

function TopTabProjects() {
  return (
    <TopTabProject.Navigator
      initialRouteName="Event List"
      backBehavior="none"
      tabBarOptions={{
        activeTintColor: Colors.secondaryColor,
        inactiveTintColor: 'white',
        labelStyle: { fontSize: wp(3), fontWeight: 'bold' },
        indicatorStyle: { backgroundColor: Colors.secondaryColor },
        style: { backgroundColor: Colors.primaryColor }
      }}
    >
      <TopTabProject.Screen name="Event List" component={EventListScreen} />
      <TopTabProject.Screen name="Committee" component={CommitteeListScreen} />
      <TopTabProject.Screen name="Project Overview" component={ProjectOverviewScreen} />
    </TopTabProject.Navigator>
  );
}


const TopTabEvent = createMaterialTopTabNavigator();

function TopTabEvents() {
  return (
    <TopTabEvent.Navigator
      initialRouteName="Roadmap"
      backBehavior="none"
      tabBarOptions={{
        activeTintColor: Colors.secondaryColor,
        inactiveTintColor: 'white',
        labelStyle: { fontSize: wp(3), fontWeight: 'bold' },
        indicatorStyle: { backgroundColor: Colors.secondaryColor },
        style: { backgroundColor: Colors.primaryColor }
      }}
    >
      <TopTabEvent.Screen name="Roadmap" component={RoadmapScreen} />
      <TopTabEvent.Screen name="Rundown" component={RundownScreen} />
      <TopTabEvent.Screen name="External" component={ExternalScreen} />
      <TopTabEvent.Screen name="Event Overview" component={EventOverviewScreen} />
    </TopTabEvent.Navigator>
  );
}


const ProjectsStack = createStackNavigator();

export default function ProjectNavigator({ route, navigation }) {
  const sime = useContext(SimeContext);
  const [userId, setUserId] = useState(null)
  const [userPict, setUserPict] = useState('')
  const [committeeName, setCommitteeName] = useState('')


  const [loadData, { data: staff, error: error1, loading: loading1 }] = useLazyQuery(
    FETCH_STAFF_QUERY, {
    variables: {
      staffId: userId
    }
  });

  useEffect(() => {
    if (sime.user) {
      setUserId(sime.user.id)
      loadData();
      if (staff) {
        setUserPict(staff.getStaff.picture)
      }
    }
    return () => {
      console.log("This will be logged on unmount");
    }
  }, [sime.user, staff])


  const [loadCommittee, { data: committee, error: errorCommittee, loading: loadingCommittee}] = useLazyQuery(
    FETCH_COMMITTEE_QUERY,
    {
        variables: { committeeId: sime.committee_id }
    }
);

  useEffect(() => {
    if (sime.committee_id) {
      loadCommittee();
      if (committee) {
        if(committee.getCommittee){
          setCommitteeName(committee.getCommittee.name)
        }else{
          setCommitteeName('[committee not found]')
        }
      }
    }
    return () => {
      console.log("This will be logged on unmount");
    }
  }, [sime.committee_id, committee])

  return (
    <ProjectsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primaryColor,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      }}
    >
      <ProjectsStack.Screen
        name="Projects"
        component={ProjectListScreen}
        options={{
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => {
                navigation.toggleDrawer();
              }}
            >
              <Avatar.Image
                size={wp(9.7)}
                source={userPict ? { uri: userPict } : require('../../assets/avatar.png')}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <ProjectsStack.Screen name="Project Menu" component={TopTabProjects} options={({ route }) => ({ title: route.params?.projectName })} />
      <ProjectsStack.Screen name="Staff Organization Profile" component={StaffOrganizationProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: wp(4.8), fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>Organization Information</Text>
          </View>),
      }} />
      <ProjectsStack.Screen name="Person in Charge Profile" component={PersonInChargeProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: wp(4.8), fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>Person in Charge Information</Text>
          </View>),
      }} />
      <ProjectsStack.Screen name="Event Detail" component={TopTabEvents} options={{
        headerTitle: () =>
          <View>
            <Text style={{ fontSize: wp(4.8), fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>{sime.event_name}</Text>
            <Text style={{ fontSize: wp(3.4), color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>{sime.project_name}</Text>
          </View>
      }} />
      <ProjectsStack.Screen name="External List" component={ExternalListScreen} options={{
        headerTitle: () =>
          <View>
            <Text style={{ fontSize: wp(4.8), fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>{sime.external_type_name}</Text>
            <Text style={{ fontSize: wp(3.4), color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>{sime.event_name}</Text>
          </View>
      }} />
      <ProjectsStack.Screen name="External Profile" component={ExternalProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: wp(4.8), fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>External Information</Text>
          </View>),
      }} />
      <ProjectsStack.Screen name="Task" component={TaskScreen} options={{
        headerTitle: () =>
          <View>
            <Text style={{ fontSize: wp(4.8), fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>{sime.roadmap_name}</Text>
            <Text style={{ fontSize: wp(3.4), color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>{committeeName}</Text>
          </View>
      }} />
    </ProjectsStack.Navigator>
  );
}