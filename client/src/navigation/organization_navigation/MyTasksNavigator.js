import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Avatar } from 'react-native-paper';
import { useLazyQuery } from '@apollo/react-hooks';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { SimeContext } from '../../context/SimePovider';
import { FETCH_STAFF_QUERY } from '../../util/graphql';
import CreatedByMeScreen from '../../screens/my_task/CreatedByMeScreen';
import AssignedToMeScreen from '../../screens/my_task/AssignedToMeScreen';
import Colors from '../../constants/Colors';

const TopTabMyTask = createMaterialTopTabNavigator();

function TopTabMytasks() {
  return (
    <TopTabMyTask.Navigator
      initialRouteName="Assigned To Me"
      backBehavior="none"
      tabBarOptions={{
        activeTintColor: Colors.secondaryColor,
        inactiveTintColor: 'white',
        labelStyle: { fontSize: wp(3), fontWeight: 'bold' },
        indicatorStyle: { backgroundColor: Colors.secondaryColor },
        style: { backgroundColor: Colors.primaryColor }
      }}
    >
      <TopTabMyTask.Screen name="Assigned To Me" component={AssignedToMeScreen} />
      <TopTabMyTask.Screen name="Created By Me" component={CreatedByMeScreen} />
    </TopTabMyTask.Navigator>
  );
}

const MyTasksStack = createStackNavigator();

export default function MyTasksNavigator({ route, navigation }) {
  const sime = useContext(SimeContext);
  const [userId, setUserId] = useState(null)
  const [userPict, setUserPict] = useState('')

  const [loadData, { data: staff, error: error1, loading: loading1 }] = useLazyQuery(
    FETCH_STAFF_QUERY, {
    variables: {
      staffId: userId
    }
  });

  useEffect(() => {
    if (sime.user) {
      setUserId(sime.user.id)
      loadData();
      if (staff) {
        setUserPict(staff.getStaff.picture)
      }
    }
    return () => {
      console.log("This will be logged on unmount");
    }
  }, [sime.user, staff])

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
                size={wp(9.7)}
                source={userPict ? { uri: userPict } : require('../../assets/avatar.png')}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </MyTasksStack.Navigator>
  );
}