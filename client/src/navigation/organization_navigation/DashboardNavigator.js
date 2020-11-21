import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Avatar } from 'react-native-paper';
import { useLazyQuery } from '@apollo/react-hooks';

import { SimeContext } from '../../context/SimePovider';
import { FETCH_ORGANIZATION_QUERY } from '../../util/graphql';
import DashboardScreen from '../../screens/dashboard/DashboardScreen';
import Colors from '../../constants/Colors';

const DashboardStack = createStackNavigator();

export default function DashboardNavigator({ route, navigation }) {
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
                source={userPict ? { uri: userPict } : require('../../assets/avatar.png')}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </DashboardStack.Navigator>
  );
}