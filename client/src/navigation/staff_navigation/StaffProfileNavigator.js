import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Text } from 'react-native-paper';

import HeaderButton from '../../components/common/HeaderButton';
import StaffIndividualProfileScreen from '../../screens/user_profile/StaffIndividualProfileScreen';
import Colors from '../../constants/Colors';

const StaffIndividualProfileStack = createStackNavigator();

export default function StaffProfileNavigator({ route, navigation }) {
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