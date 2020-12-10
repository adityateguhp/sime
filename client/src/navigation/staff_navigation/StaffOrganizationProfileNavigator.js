import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Text } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
            <Text style={{ fontSize: wp(4.8), fontWeight: 'bold', color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>Organization Information</Text>
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