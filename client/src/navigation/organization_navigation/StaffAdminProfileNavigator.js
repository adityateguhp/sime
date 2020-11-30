import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Text } from 'react-native-paper';

import HeaderButton from '../../components/common/HeaderButton';
import StaffAdminIndividualProfileScreen from '../../screens/user_profile/StaffAdminIndividualProfileScreen';
import Colors from '../../constants/Colors';

const StaffAdminIndividualProfileStack = createStackNavigator();

export default function StaffAdminProfileNavigator({ route, navigation }) {
  return (
    <StaffAdminIndividualProfileStack.Navigator
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
      <StaffAdminIndividualProfileStack.Screen name="Staff Profile" component={StaffAdminIndividualProfileScreen} options={{
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

    </StaffAdminIndividualProfileStack.Navigator>
  );
}