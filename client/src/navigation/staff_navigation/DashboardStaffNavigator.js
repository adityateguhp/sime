import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Avatar, Text } from 'react-native-paper';
import { useLazyQuery } from '@apollo/react-hooks';

import { SimeContext } from '../../context/SimePovider';
import { FETCH_STAFF_QUERY, FETCH_COMMITTEE_QUERY } from '../../util/graphql';
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
import DashboardStaffScreen from '../../screens/dashboard/DashboardStaffScreen';

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


const DashboardStaffStack = createStackNavigator();

export default function DashboardStaffNavigator({ route, navigation }) {
  const sime = useContext(SimeContext);
  const [userId, setUserId] = useState(null)
  const [userName, setUserName] = useState('')
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
        var stringArray = staff.getStaff.name.split(/(\s+)/)
        setUserName(stringArray[0])
      }
    }
    return () => {
      console.log("This will be logged on unmount");
    }
  }, [sime.user, staff])

  const [loadCommittee, { data: committee, error: errorCommittee, loading: loadingCommittee }] = useLazyQuery(
    FETCH_COMMITTEE_QUERY,
    {
      variables: { committeeId: sime.committee_id }
    }
  );

  useEffect(() => {
    if (sime.committee_id) {
      loadCommittee();
      if (committee) {
        if (committee.getCommittee) {
          setCommitteeName(committee.getCommittee.name)
        } else {
          setCommitteeName('[committee not found]')
        }
      }
    }
    return () => {
      console.log("This will be logged on unmount");
    }
  }, [sime.committee_id, committee])

  var hour = new Date().getHours();

  return (
    <DashboardStaffStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primaryColor,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        }
      }}
    >
      <DashboardStaffStack.Screen
        name="Dashboard"
        component={DashboardStaffScreen}
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
          title: "Good " + (hour < 12 && "Morning " || hour < 18 && "Afternoon " || "Evening ") + userName + "!"
        }}
      />
      <DashboardStaffStack.Screen name="Project Menu" component={TopTabProjectsStaff} options={({ route }) => ({ title: route.params?.projectName })} />
      <DashboardStaffStack.Screen name="Staff Organization Profile" component={StaffOrganizationProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>Organization Information</Text>
          </View>),
      }} />
      <DashboardStaffStack.Screen name="Person in Charge Profile" component={PersonInChargeProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>Person in Charge Information</Text>
          </View>),
      }} />
      <DashboardStaffStack.Screen name="Event Detail" component={TopTabEvents} options={{
        headerTitle: () =>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>{sime.event_name}</Text>
            <Text style={{ fontSize: 14, color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>{sime.project_name}</Text>
          </View>
      }} />
      <DashboardStaffStack.Screen name="External List" component={ExternalListScreen} options={{
        headerTitle: () =>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>{sime.external_type_name}</Text>
            <Text style={{ fontSize: 14, color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>{sime.event_name}</Text>
          </View>
      }} />
      <DashboardStaffStack.Screen name="External Profile" component={ExternalProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>External Information</Text>
          </View>),
      }} />
      <DashboardStaffStack.Screen name="Task" component={TaskScreen} options={{
        headerTitle: () =>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>{sime.roadmap_name}</Text>
            <Text style={{ fontSize: 14, color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>{committeeName}</Text>
          </View>
      }} />
    </DashboardStaffStack.Navigator>
  );
}