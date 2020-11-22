import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Text } from 'react-native-paper';

import HeaderButton from '../../components/common/HeaderButton';
import CommitteeManagementScreen from '../../screens/committee/CommitteeManagementScreen';
import Colors from '../../constants/Colors';

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
        name="Committees Management"
        component={CommitteeManagementScreen}
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
