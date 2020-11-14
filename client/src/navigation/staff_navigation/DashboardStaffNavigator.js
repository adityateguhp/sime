import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Avatar } from 'react-native-paper';
import { useLazyQuery } from '@apollo/react-hooks';

import { SimeContext } from '../../context/SimePovider';
import { FETCH_STAFF_QUERY } from '../../util/graphql';
import DashboardScreen from '../../screens/home/DashboardScreen';
import Colors from '../../constants/Colors';

const DashboardStack = createStackNavigator();

export default function DashboardStaffNavigator({ route, navigation }) {
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
        console.log("This will be logged on unmount dashboard header pict");
      }
    }, [sime.user, staff])
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