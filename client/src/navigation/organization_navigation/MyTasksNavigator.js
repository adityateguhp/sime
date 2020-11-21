import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Avatar } from 'react-native-paper';
import { useLazyQuery } from '@apollo/react-hooks';

import { SimeContext } from '../../context/SimePovider';
import { FETCH_ORGANIZATION_QUERY } from '../../util/graphql';
import CreatedByMeScreen from '../../screens/my_task/CreatedByMeScreen';
import Colors from '../../constants/Colors';

const TopTabMyTask = createMaterialTopTabNavigator();

function TopTabMytasks() {
  return (
    <TopTabMyTask.Navigator
      initialRouteName="Created By Me"
      backBehavior="none"
      tabBarOptions={{
        activeTintColor: Colors.secondaryColor,
        inactiveTintColor: 'white',
        labelStyle: { fontSize: 12, fontWeight: 'bold' },
        indicatorStyle: { backgroundColor: Colors.secondaryColor },
        style: { backgroundColor: Colors.primaryColor }
      }}
    >
      <TopTabMyTask.Screen name="Created By Me" component={CreatedByMeScreen} />
    </TopTabMyTask.Navigator>
  );
}

const MyTasksStack = createStackNavigator();

export default function MyTasksNavigator({ route, navigation }) {
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
      <MyTasksStack.Navigator
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
        <MyTasksStack.Screen
          name="My Tasks"
          component={TopTabMytasks}
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
      </MyTasksStack.Navigator>
    );
  }