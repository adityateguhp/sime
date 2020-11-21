import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Avatar, Text } from 'react-native-paper';
import { useLazyQuery } from '@apollo/react-hooks';

import { SimeContext } from '../../context/SimePovider';
import { FETCH_STAFF_QUERY } from '../../util/graphql';
import ProjectListStaffScreen from '../../screens/project/ProjectListStaffScreen';
import ProjectOverviewScreen from '../../screens/project/ProjectOverviewScreen';
import CommitteeListStaffScreen from '../../screens/committee/CommitteeListStaffScreen';
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


const TopTabProjectStaff = createMaterialTopTabNavigator();

function TopTabProjectsStaff() {
  return (
    <TopTabProjectStaff.Navigator
      initialRouteName="Event List"
      backBehavior="none"
      tabBarOptions={{
        activeTintColor: Colors.secondaryColor,
        inactiveTintColor: 'white',
        labelStyle: { fontSize: 12, fontWeight: 'bold' },
        indicatorStyle: { backgroundColor: Colors.secondaryColor },
        style: { backgroundColor: Colors.primaryColor }
      }}
    >
      <TopTabProjectStaff.Screen name="Event List" component={EventListScreen} />
      <TopTabProjectStaff.Screen name="Committee" component={CommitteeListStaffScreen} />
      <TopTabProjectStaff.Screen name="Project Overview" component={ProjectOverviewScreen} />
    </TopTabProjectStaff.Navigator>
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
        labelStyle: { fontSize: 12, fontWeight: 'bold' },
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


const ProjectsStackStaff = createStackNavigator();

export default function ProjectStaffNavigator({ route, navigation }) {
  const sime = useContext(SimeContext);
  const [userId, setUserId] = useState(null)
  const [userPict, setUserPict] = useState('')

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
      console.log("This will be logged on unmount dashboard header pict");
    }
  }, [sime.user, staff])
  return (
    <ProjectsStackStaff.Navigator
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
      <ProjectsStackStaff.Screen
        name="My Projects"
        component={ProjectListStaffScreen}
        options={{
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => {
                navigation.toggleDrawer();
              }}
            >
              <Avatar.Image
                size={40}
                source={userPict ? { uri: userPict } : require('../../assets/avatar.png')}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <ProjectsStackStaff.Screen name="Project Menu" component={TopTabProjectsStaff} options={({ route }) => ({ title: route.params?.projectName })} />
      <ProjectsStackStaff.Screen name="Staff Organization Profile" component={StaffOrganizationProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>Organization Information</Text>
          </View>),
      }} />
      <ProjectsStackStaff.Screen name="Person in Charge Profile" component={PersonInChargeProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>Person in Charge Information</Text>
          </View>),
      }} />
      <ProjectsStackStaff.Screen name="Event Detail" component={TopTabEvents} options={{
        headerTitle: () =>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>{sime.event_name}</Text>
            <Text style={{ fontSize: 14, color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>{sime.project_name}</Text>
          </View>
      }} />
      <ProjectsStackStaff.Screen name="External List" component={ExternalListScreen} options={{
        headerTitle: () =>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>{sime.external_type_name}</Text>
            <Text style={{ fontSize: 14, color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>{sime.event_name}</Text>
          </View>
      }} />
      <ProjectsStackStaff.Screen name="External Profile" component={ExternalProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>External Information</Text>
          </View>),
      }} />
      <ProjectsStackStaff.Screen name="Task" component={TaskScreen} options={{ title: sime.roadmap_name }} />
    </ProjectsStackStaff.Navigator>
  );
}