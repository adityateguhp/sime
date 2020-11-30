import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Text } from 'react-native-paper';

import HeaderButton from '../../components/common/HeaderButton';
import CommitteeManagementScreen from '../../screens/committee/CommitteeManagementScreen';
import PositionManagementScreen from '../../screens/committee/PositionManagementScreen';
import Colors from '../../constants/Colors';

const TopTabCommitteesManagement = createMaterialTopTabNavigator();

function TopTabCommitteesManagements() {
  return (
    <TopTabCommitteesManagement.Navigator
      initialRouteName="Committees"
      backBehavior="none"
      tabBarOptions={{
        activeTintColor: Colors.secondaryColor,
        inactiveTintColor: 'white',
        labelStyle: { fontSize: 12, fontWeight: 'bold' },
        indicatorStyle: { backgroundColor: Colors.secondaryColor },
        style: { backgroundColor: Colors.primaryColor }
      }}
    >
      <TopTabCommitteesManagement.Screen name="Committees" component={CommitteeManagementScreen} />
      <TopTabCommitteesManagement.Screen name="Positions" component={PositionManagementScreen} />
    </TopTabCommitteesManagement.Navigator>
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
        name="Committee Management"
        component={TopTabCommitteesManagements}
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
    </UsersManagementStack.Navigator>
  );
}
