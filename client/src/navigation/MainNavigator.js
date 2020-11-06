import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Avatar, Text, Menu, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';
import { useLazyQuery } from '@apollo/react-hooks';


import { SimeContext } from '../context/SimePovider';
import HeaderButton from '../components/common/HeaderButton';
import { AuthContext } from '../context/auth';
import { FETCH_ORGANIZATION_QUERY, FETCH_STAFF_QUERY } from '../util/graphql';
import CenterSpinner from '../components/common/CenterSpinner';

import LoginScreen from '../screens/home/LoginScreen';
import RegisterScreen from '../screens/home/RegisterScreen';
import RegisterCompletedScreen from '../screens/home/RegisterCompletedScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ProjectListScreen from '../screens/project/ProjectListScreen';
import ProjectListStaffScreen from '../screens/project/ProjectListStaffScreen';
import ProjectOverviewScreen from '../screens/project/ProjectOverviewScreen';
import CommitteeListScreen from '../screens/project/CommitteeListScreen';
import CommitteeListStaffScreen from '../screens/project/CommitteeListStaffScreen';
import EventListScreen from '../screens/project/EventListScreen';
import EventOverviewScreen from '../screens/event/EventOverviewScreen';
import DepartmentsScreen from '../screens/user_management/DepartmentsScreen';
import StaffsScreen from '../screens/user_management/StaffsScreen';
import StaffsInDepartmentScreen from '../screens/user_management/StaffsInDepartmentScreen';
import TaskScreen from '../screens/event/TaskScreen';
import DrawerContentOrganization from '../components/common/DrawerContentOrganization';
import DrawerContentStaff from '../components/common/DrawerContentStaff';
import RoadmapScreen from '../screens/event/RoadmapScreen';
import ExternalScreen from '../screens/event/ExternalScreen';
import RundownScreen from '../screens/event/RundownScreen';
import ExternalListScreen from '../screens/event/ExternalListScreen';
import ExternalProfileScreen from '../screens/event/ExternalProfileScreen';
import StaffProfileScreen from '../screens/user_management/StaffProfileScreen';
import CommitteeProfileScreen from '../screens/project/CommitteeProfileScreen';
import OrganizationProfileScreen from '../screens/user_profile/OrganizationProfileScreen';
import StaffIndividualProfileScreen from '../screens/user_profile/StaffIndividualProfileScreen';
import StaffOrganizationProfileScreen from '../screens/user_profile/StaffOrganizationProfileScreen';

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
                source={userPict === null || userPict === '' ? require('../assets/avatar.png') : { uri: userPict }}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </DashboardStack.Navigator>
  );
}

function DashboardStackStaffScreen({ route, navigation }) {
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
                source={userPict === null || userPict === '' ? require('../assets/avatar.png') : { uri: userPict }}
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
                source={userPict === null || userPict === '' ? require('../assets/avatar.png') : { uri: userPict }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <ProjectsStack.Screen name="Project Menu" component={TopTabProjects} options={({ route }) => ({ title: route.params?.projectName })} />
      <ProjectsStackStaff.Screen name="Staff Organization Profile" component={StaffOrganizationProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>Organization Profile Information</Text>
          </View>),
      }} />
      <ProjectsStack.Screen name="Committee Profile" component={CommitteeProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}  numberOfLines={1} ellipsizeMode='tail'>Committee Profile Information</Text>
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
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>External Profile Information</Text>
          </View>),
      }} />
      <ProjectsStack.Screen name="Task" component={TaskScreen} options={{ title: sime.roadmap_name }} />
    </ProjectsStack.Navigator>
  );
}


const ProjectsStackStaff = createStackNavigator();

function ProjectStackStaffSceen({ route, navigation }) {
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
        name="Projects"
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
                source={userPict === null || userPict === '' ? require('../assets/avatar.png') : { uri: userPict }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <ProjectsStackStaff.Screen name="Project Menu" component={TopTabProjectsStaff} options={({ route }) => ({ title: route.params?.projectName })} />
      <ProjectsStackStaff.Screen name="Staff Organization Profile" component={StaffOrganizationProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>Organization Profile Information</Text>
          </View>),
      }} />
      <ProjectsStackStaff.Screen name="Committee Profile" component={CommitteeProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>Committee Profile Information</Text>
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
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>External Profile Information</Text>
          </View>),
      }} />
      <ProjectsStackStaff.Screen name="Task" component={TaskScreen} options={{ title: sime.roadmap_name }} />
    </ProjectsStackStaff.Navigator>
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
      <TopTabProject.Screen name="Committee" component={CommitteeListScreen} />
      <TopTabProject.Screen name="Project Overview" component={ProjectOverviewScreen} />
    </TopTabProject.Navigator>
  );
}

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

const UsersManagementStack = createStackNavigator();

function UsersManagementStackScreen({ route, navigation }) {
  return (
    <UsersManagementStack.Navigator
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
      <UsersManagementStack.Screen
        name="Users Management"
        component={TopTabUsersManagements}
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
      <UsersManagementStack.Screen
        name="Staff List in Department"
        component={StaffsInDepartmentScreen}
        options={({ route }) => ({ title: route.params?.departmentName })}
      />
      <UsersManagementStack.Screen name="Staff Profile" component={StaffProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>Staff Profile Information</Text>
          </View>),
      }} />
    </UsersManagementStack.Navigator>
  );
}

const TopTabUsersManagement = createMaterialTopTabNavigator();

function TopTabUsersManagements() {
  return (
    <TopTabUsersManagement.Navigator
      initialRouteName="Staff List"
      backBehavior="none"
      tabBarOptions={{
        activeTintColor: Colors.secondaryColor,
        inactiveTintColor: 'white',
        labelStyle: { fontSize: 12, fontWeight: 'bold' },
        indicatorStyle: { backgroundColor: Colors.secondaryColor },
        style: { backgroundColor: Colors.primaryColor }
      }}
    >
      <TopTabUsersManagement.Screen name="Staffs" component={StaffsScreen} />
      <TopTabUsersManagement.Screen name="Departments" component={DepartmentsScreen} />
    </TopTabUsersManagement.Navigator>
  );
}

const OrganizationProfileStack = createStackNavigator();

function OrganizationProfileStackScreen({ route, navigation }) {
  return (
    <OrganizationProfileStack.Navigator
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
      <OrganizationProfileStack.Screen name="Organization Profile" component={OrganizationProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>Profile Information</Text>
          </View>),
        headerLeft: () => (
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
              iconName="arrow-left"
              onPress={() => { navigation.navigate('Dashboard') }}
            />
          </HeaderButtons>
        )
      }} />

    </OrganizationProfileStack.Navigator>
  );
}

const StaffIndividualProfileStack = createStackNavigator();

function StaffIndividualProfileStackScreen({ route, navigation }) {
  return (
    <StaffIndividualProfileStack.Navigator
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
      <StaffIndividualProfileStack.Screen name="Staff Profile" component={StaffIndividualProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>Profile Information</Text>
          </View>),
        headerLeft: () => (
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
              iconName="arrow-left"
              onPress={() => { navigation.navigate('Dashboard') }}
            />
          </HeaderButtons>
        )
      }} />

    </StaffIndividualProfileStack.Navigator>
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

const BottomTabStaff = createBottomTabNavigator();

function BottomTabsStaff() {
  return (
    <BottomTabStaff.Navigator
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
      <BottomTabStaff.Screen name="Dashboard" component={DashboardStackStaffScreen} />
      <BottomTabStaff.Screen name="Projects" component={ProjectStackStaffSceen} />
    </BottomTabStaff.Navigator>
  );
}

const Drawer = createDrawerNavigator();
const Main = createStackNavigator();

export default function MainNavigator() {
  const sime = useContext(SimeContext);
  const { user, logout } = useContext(AuthContext);
  const [isLogin, setLogin] = useState(null);
  async function loginCheck() {
    if (await AsyncStorage.getItem('jwtToken')) {
      setLogin(await AsyncStorage.getItem('jwtToken'))
      sime.setUser((jwtDecode(await AsyncStorage.getItem('jwtToken'))))
    } else {
      setLogin(null)
    }
  }

  useEffect(() => {
    loginCheck()
    return () => {
      console.log("This will be logged on unmount loginCheck");
    }
  }, [isLogin, user, logout])

  return (
    user || isLogin ? (
      sime.user_type === "Organization" ? (
        <>
          <Drawer.Navigator
            drawerContent={props => <DrawerContentOrganization {...props} />}
          >
            <Drawer.Screen
              name="Dashboard"
              component={BottomTabs}
            />
            <Drawer.Screen
              name="Organization Profile"
              component={OrganizationProfileStackScreen}
              options={{
                gestureEnabled: false,
              }}
            />
            <Drawer.Screen
              name="Users Management"
              component={UsersManagementStackScreen}
              options={{
                gestureEnabled: false,
              }}
            />
          </Drawer.Navigator>
        </>) :
        (
          <>
            <Drawer.Navigator
              drawerContent={props => <DrawerContentStaff {...props} />}
            >
              <Drawer.Screen
                name="Dashboard"
                component={BottomTabsStaff}
              />
              <Drawer.Screen
              name="Staff Profile"
              component={StaffIndividualProfileStackScreen}
              options={{
                gestureEnabled: false,
              }}
            />
            </Drawer.Navigator>
          </>)
    ) : (
        <>
          <Main.Navigator
            screenOptions={{
              gestureEnabled: false
            }}
          >
            <Main.Screen
              name="Login"
              component={LoginScreen}
              options={{
                title: ""
              }}
            />
            <Main.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                title: ""
              }}
            />
            <Main.Screen
              name="Register Completed"
              component={RegisterCompletedScreen}
              options={{
                headerShown: false,
              }}
            />
          </Main.Navigator>
        </>
      )
  );
}