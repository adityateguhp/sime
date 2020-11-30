import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Text } from 'react-native-paper';

import HeaderButton from '../../components/common/HeaderButton';
import DepartmentsScreen from '../../screens/user_management/DepartmentsScreen';
import StaffsScreen from '../../screens/user_management/StaffsScreen';
import StaffsInDepartmentScreen from '../../screens/user_management/StaffsInDepartmentScreen';
import DepartmentPositionsScreen from '../../screens/user_management/DepartmentPositionsScreen';
import StaffProfileScreen from '../../screens/user_management/StaffProfileScreen';
import Colors from '../../constants/Colors';


const TopTabUsersManagement = createMaterialTopTabNavigator();

function TopTabUsersManagements() {
  return (
    <TopTabUsersManagement.Navigator
      initialRouteName="Staffs"
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
      <TopTabUsersManagement.Screen name="Positions" component={DepartmentPositionsScreen} />
    </TopTabUsersManagement.Navigator>
  );
}

const UsersManagementStack = createStackNavigator();

export default function UsersManagementNavigator({ route, navigation }) {
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
        name="User Management"
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
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>Staff Information</Text>
          </View>),
      }} />
    </UsersManagementStack.Navigator>
  );
}
