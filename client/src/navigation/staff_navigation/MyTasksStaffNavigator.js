import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Avatar } from 'react-native-paper';
import { useLazyQuery } from '@apollo/react-hooks';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { SimeContext } from '../../context/SimePovider';
import { FETCH_STAFF_QUERY } from '../../util/graphql';
import AssignedToMeScreen from '../../screens/my_task/AssignedToMeScreen';
import CreatedByMeScreen from '../../screens/my_task/CreatedByMeScreen';
import Colors from '../../constants/Colors';

const TopTabMyTaskStaff = createMaterialTopTabNavigator();

function TopTabMyTasksStaff() {
  return (
    <TopTabMyTaskStaff.Navigator
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
      <TopTabMyTaskStaff.Screen name="Assigned To Me" component={AssignedToMeScreen} />
      <TopTabMyTaskStaff.Screen name="Created By Me" component={CreatedByMeScreen} />
    </TopTabMyTaskStaff.Navigator>
  );
}

const MyTasksStaffStack = createStackNavigator();

export default function MyTasksStaffNavigator({ route, navigation }) {
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
      <MyTasksStaffStack.Navigator
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
        <MyTasksStaffStack.Screen
          name="My Tasks"
          component={TopTabMyTasksStaff}
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
      </MyTasksStaffStack.Navigator>
    );
  }