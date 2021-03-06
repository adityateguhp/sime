import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Text } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import HeaderButton from '../../components/common/HeaderButton';
import OrganizationProfileScreen from '../../screens/user_profile/OrganizationProfileScreen';
import Colors from '../../constants/Colors';

const OrganizationProfileStack = createStackNavigator();

export default function OrganizationProfileNavigator({ route, navigation }) {
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

    </OrganizationProfileStack.Navigator>
  );
}