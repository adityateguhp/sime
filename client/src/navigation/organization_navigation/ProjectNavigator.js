import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Avatar, Text} from 'react-native-paper';
import { useLazyQuery } from '@apollo/react-hooks';

import { SimeContext } from '../../context/SimePovider';
import { FETCH_ORGANIZATION_QUERY } from '../../util/graphql';
import ProjectListScreen from '../../screens/home/ProjectListScreen';
import ProjectOverviewScreen from '../../screens/project/ProjectOverviewScreen';
import CommitteeListScreen from '../../screens/project/CommitteeListScreen';
import EventListScreen from '../../screens/project/EventListScreen';
import EventOverviewScreen from '../../screens/event/EventOverviewScreen';
import TaskScreen from '../../screens/event/TaskScreen';
import RoadmapScreen from '../../screens/event/RoadmapScreen';
import ExternalScreen from '../../screens/event/ExternalScreen';
import RundownScreen from '../../screens/event/RundownScreen';
import ExternalListScreen from '../../screens/event/ExternalListScreen';
import ExternalProfileScreen from '../../screens/event/ExternalProfileScreen';
import CommitteeProfileScreen from '../../screens/project/CommitteeProfileScreen';
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
        labelStyle: { fontSize: 12, fontWeight: 'bold' },
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


const ProjectsStack = createStackNavigator();

export default function ProjectNavigator({ route, navigation }) {
  const sime = useContext(SimeContext);
  const [userId, setUserId] = useState(null)
  const [userPict, setUserPict] = useState('')

  const [loadData, { data: organization, error: error1, loading: loading1 }] = useLazyQuery(
    FETCH_ORGANIZATION_QUERY, {
    variables: {
      organizationId: userId
    }
  });

  useEffect(() => {
    if (sime.user) {
      setUserId(sime.user.id)
      loadData();
      if (organization) {
        setUserPict(organization.getOrganization.picture)
      }
    }
    return () => {
      console.log("This will be logged on unmount dashboard header pict");
    }
  }, [sime.user, organization])
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
                size={40}
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
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>Organization Information</Text>
          </View>),
      }} />
      <ProjectsStack.Screen name="Committee Profile" component={CommitteeProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>Committee Information</Text>
          </View>),
      }} />
      <ProjectsStack.Screen name="Event Detail" component={TopTabEvents} options={{
        headerTitle: () =>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>{sime.event_name}</Text>
            <Text style={{ fontSize: 14, color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>{sime.project_name}</Text>
          </View>
      }} />
      <ProjectsStack.Screen name="External List" component={ExternalListScreen} options={{
        headerTitle: () =>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>{sime.external_type_name}</Text>
            <Text style={{ fontSize: 14, color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>{sime.event_name}</Text>
          </View>
      }} />
      <ProjectsStack.Screen name="External Profile" component={ExternalProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>External Information</Text>
          </View>),
      }} />
      <ProjectsStack.Screen name="Task" component={TaskScreen} options={{ title: sime.roadmap_name }} />
    </ProjectsStack.Navigator>
  );
}