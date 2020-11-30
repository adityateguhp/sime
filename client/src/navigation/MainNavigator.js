import React, { useContext, useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';

import { SimeContext } from '../context/SimePovider';
import { AuthContext } from '../context/auth';
import LoginScreen from '../screens/login/LoginScreen';
import RegisterScreen from '../screens/login/RegisterScreen';
import RegisterCompletedScreen from '../screens/login/RegisterCompletedScreen';
import DrawerContentOrganization from '../components/common/DrawerContentOrganization';
import DrawerContentStaff from '../components/common/DrawerContentStaff';
import ProjectNavigator from './organization_navigation/ProjectNavigator'
import ProjectStaffNavigator from './staff_navigation/ProjectStaffNavigator'
import DashboardNavigator from './organization_navigation/DashboardNavigator'
import DashboardStaffNavigator from './staff_navigation/DashboardStaffNavigator'
import UsersManagementNavigator from './organization_navigation/UsersManagementNavigator'
import OrganizationProfileNavigator from './organization_navigation/OrganizationProfileNavigator'
import StaffProfileNavigator from './staff_navigation/StaffProfileNavigator'
import StaffAdminProfileNavigator from './organization_navigation/StaffAdminProfileNavigator'
import StaffOrganizationProfileNavigator from './staff_navigation/StaffOrganizationProfileNavigator'
import MyTasksStaffNavigator from './staff_navigation/MyTasksStaffNavigator'
import MyTasksNavigator from './organization_navigation/MyTasksNavigator'
import CommitteeManagementNavigator from './organization_navigation/CommitteeManagementNavigator'
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
    case 'My Tasks':
      return true;
    default:
      return false;
  }
}

function TabVisibleStaff(route) {
  const routeName = route.state
    ?
    route.state.routes[route.state.index].name
    :
    route.params?.screen || 'Dashboard';

  switch (routeName) {
    case 'Dashboard':
      return true;
    case 'My Projects':
      return true;
    case 'My Tasks':
      return true;
    default:
      return false;
  }
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
          else if (route.name === 'My Tasks') {
            iconName = focused ? 'clipboard-text' : 'clipboard-text-outline';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <BottomTab.Screen name="Dashboard" component={DashboardNavigator} />
      <BottomTabStaff.Screen name="My Tasks" component={MyTasksNavigator} />
      <BottomTab.Screen name="Projects" component={ProjectNavigator} />
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
        tabBarVisible: TabVisibleStaff(route),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          size = 23;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'My Projects') {
            iconName = focused ? 'folder-open' : 'folder';
          }
          else if (route.name === 'My Tasks') {
            iconName = focused ? 'clipboard-text' : 'clipboard-text-outline';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <BottomTabStaff.Screen name="Dashboard" component={DashboardStaffNavigator} />
      <BottomTabStaff.Screen name="My Tasks" component={MyTasksStaffNavigator} />
      <BottomTabStaff.Screen name="My Projects" component={ProjectStaffNavigator} />
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
      console.log("This will be logged on unmount");
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
              name="Staff Profile"
              component={StaffAdminProfileNavigator}
              options={{
                gestureEnabled: false,
              }}
            />
            <Drawer.Screen
              name="Organization Profile"
              component={OrganizationProfileNavigator}
              options={{
                gestureEnabled: false,
              }}
            />
            <Drawer.Screen
              name="Users Management"
              component={UsersManagementNavigator}
              options={{
                gestureEnabled: false,
              }}
            />
            <Drawer.Screen
              name="Committees Management"
              component={CommitteeManagementNavigator}
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
                component={StaffProfileNavigator}
                options={{
                  gestureEnabled: false,
                }}
              />
              <Drawer.Screen
                name="Staff Organization Profile"
                component={StaffOrganizationProfileNavigator}
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