import React, { useContext, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSafeArea } from 'react-native-safe-area-context';
import { Avatar, Text } from 'react-native-paper';
import { SimeContext } from '../provider/SimePovider';
import HeaderButton from '../components/common/HeaderButton';

import HomeScreen from '../screens/dashboard/HomeScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ProjectListScreen from '../screens/project/ProjectListScreen';
import ProjectOverviewScreen from '../screens/project/ProjectOverviewScreen';
import DivisionListScreen from '../screens/project/DivisionListScreen';
import EventListScreen from '../screens/project/EventListScreen';
import EventOverviewScreen from '../screens/event/EventOverviewScreen';
import EditEventScreen from '../screens/event/EditEventScreen';
import DepartmentsScreen from '../screens/department/DepartmentsScreen';
import StaffsScreen from '../screens/department/StaffsScreen';
import TaskScreen from '../screens/event/TaskScreen';
import DrawerContent from '../components/common/DrawerContent';
import RoadmapScreen from '../screens/event/RoadmapScreen';
import ComiteeListScreen from '../screens/project/ComiteeListScreen';
import EditComiteeScreen from '../screens/project/EditComiteeScreen';
import ExternalScreen from '../screens/event/ExternalScreen';
import RundownScreen from '../screens/event/RundownScreen';
import ExternalListScreen from '../screens/event/ExternalListScreen';
import TaskDivisionScreen from '../screens/event/TaskDivisionScreen';
import ExternalProfileScreen from '../screens/event/ExternalProfileScreen';
import StaffProfileScreen from '../screens/department/StaffProfileScreen';
import ComiteeProfileScreen from '../screens/project/ComiteeProfileScreen';
import Colors from '../constants/Colors';

function TabVisible(route) {
  const routeName = route.state
    ?
    route.state.routes[route.state.index].name
    :
    route.params?.screen || 'Dashboard';

  switch (routeName) {
    case 'Dashboard':
      return true;
    case 'Projects':
      return true;
    default:
      return false;
  }
}

const DashboardStack = createStackNavigator();

function DashboardStackScreen({ route, navigation }) {
  const safeArea = useSafeArea();
  return (
    <DashboardStack.Navigator
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
      <DashboardStack.Screen
        name="Dashboard"
        component={DashboardScreen}
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
                source={{
                  uri:
                    'https://media-exp1.licdn.com/dms/image/C4E0BAQG-FO7nOawetA/company-logo_200_200/0?e=2159024400&v=beta&t=fuuDA0lUgEqIfSw7FIIiayJPFhO7SsTVl9Obyvk8Zx4',
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </DashboardStack.Navigator>
  );
}

const ProjectsStack = createStackNavigator();

function ProjectStackSceen({ route, navigation }) {
  const safeArea = useSafeArea();
  const sime = useContext(SimeContext);
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
                source={{
                  uri:
                    'https://media-exp1.licdn.com/dms/image/C4E0BAQG-FO7nOawetA/company-logo_200_200/0?e=2159024400&v=beta&t=fuuDA0lUgEqIfSw7FIIiayJPFhO7SsTVl9Obyvk8Zx4',
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <ProjectsStack.Screen name="Project Menu" component={TopTabProjects} options={({ route }) => ({ title: route.params?.projectName })} />
      <ProjectsStack.Screen name="Comitee List" component={ComiteeListScreen} options={{
        headerTitle: () =>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{sime.division_name}</Text>
            <Text style={{ fontSize: 14, color: 'white' }}>{sime.project_name}</Text>
          </View>
      }} />
      <ProjectsStack.Screen name="Comitee Profile" component={ComiteeProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Profile Information</Text>
          </View>),
      }} />
      <ProjectsStack.Screen name="Edit Comitee" component={EditComiteeScreen} />
      <ProjectsStack.Screen name="Event Detail" component={TopTabEvents} options={{
        headerTitle: () =>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{sime.event_name}</Text>
            <Text style={{ fontSize: 14, color: 'white' }}>{sime.project_name}</Text>
          </View>
      }} />
      <ProjectsStack.Screen name="External List" component={ExternalListScreen} options={{
        headerTitle: () =>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{sime.external_type_name}</Text>
            <Text style={{ fontSize: 14, color: 'white' }}>{sime.event_name}</Text>
          </View>
      }} />
      <ProjectsStack.Screen name="External Profile" component={ExternalProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Profile Information</Text>
          </View>),
      }} />
      <ProjectsStack.Screen name="Task Division" component={TaskDivisionScreen} options={{
        headerTitle: () =>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{sime.roadmap_name}</Text>
            <Text style={{ fontSize: 14, color: 'white' }}>{sime.event_name}</Text>
          </View>
      }} />
      <ProjectsStack.Screen name="Task" component={TaskScreen} options={{
        headerTitle: () =>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{sime.division_name}</Text>
            <Text style={{ fontSize: 14, color: 'white' }}>{sime.roadmap_name}</Text>
          </View>
      }} />
      <ProjectsStack.Screen name="EditEvent" component={EditEventScreen} />
    </ProjectsStack.Navigator>
  );
}

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
      <TopTabProject.Screen name="Comitee" component={DivisionListScreen} />
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

const DepartmentsStack = createStackNavigator();

function DepartmentsStackScreen({ route, navigation }) {
  const safeArea = useSafeArea();
  return (
    <DepartmentsStack.Navigator
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
      <DepartmentsStack.Screen
        name="Departments"
        component={DepartmentsScreen}
        options={{
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
              <Item
                iconName="arrow-left"
                onPress={() => { navigation.navigate('Dashboard') }}
              />
            </HeaderButtons>
          ),
        }}
      />
      <DepartmentsStack.Screen
        name="Staff List"
        component={StaffsScreen}
        options={({ route }) => ({ title: route.params?.departmentName })}
      />
      <DepartmentsStack.Screen name="Staff Profile" component={StaffProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Profile Information</Text>
          </View>),
      }} />
    </DepartmentsStack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <BottomTab.Navigator
      barStyle={{ backgroundColor: '#fff' }}
      tabBarOptions={{
        activeTintColor: Colors.primaryColor,
      }}
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: 'black',
        tabBarVisible: TabVisible(route),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          size = 23;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'Projects') {
            iconName = focused ? 'folder-open' : 'folder';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <BottomTab.Screen name="Dashboard" component={DashboardStackScreen} />
      <BottomTab.Screen name="Projects" component={ProjectStackSceen} />
    </BottomTab.Navigator>
  );
}

const Drawer = createDrawerNavigator();
const Main = createStackNavigator();

export default function MainNavigator() {
  const [userToken, setUserToken] = useState();

  return (
    userToken == null ? (
      <>
        <Main.Navigator>
          <Main.Screen
            name="Home"
            component={HomeScreen}
          />
        </Main.Navigator>
      </>
    ) : (
        <>
          <Drawer.Navigator
            drawerContent={props => <DrawerContent {...props} />}
          >
            <Drawer.Screen
              name="Dashboard"
              component={BottomTabs}
            />
            <Drawer.Screen
              name="Departments"
              component={DepartmentsStackScreen}
              options={{
                gestureEnabled: false,
              }}
            />
          </Drawer.Navigator>
        </>
      )
  );
}