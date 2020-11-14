import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Text } from 'react-native-paper';

import HeaderButton from '../../components/common/HeaderButton';
import StaffOrganizationProfileScreen from '../../screens/user_profile/StaffOrganizationProfileScreen';
import Colors from '../../constants/Colors';

const StaffOrganizationProfileStack = createStackNavigator();

export default function StaffOrganizationProfileNavigator({ route, navigation }) {
  return (
    <StaffOrganizationProfileStack.Navigator
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
      <StaffOrganizationProfileStack.Screen name="Staff Organization Profile" component={StaffOrganizationProfileScreen} options={{
        headerTitle: () => (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>Your Organization Information</Text>
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

    </StaffOrganizationProfileStack.Navigator>
  );
}