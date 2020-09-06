import React, { useContext, useState, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';

import { SimeContext } from '../../context/SimePovider';
import { AuthContext } from '../../context/auth';

const DashboardScreen = props => {
  const sime = useContext(SimeContext);
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    email: '',
    picture: '',
    typename: ''
  })
  
  useEffect(() => {
    if(sime.user){
      setUserData({
        id: sime.user.id,
        name: sime.user.name,
        email: sime.user.email,
        picture: sime.user.picture,
        typename: sime.user.typename
      })
      
    }
    return () => {
      console.log("This will be logged on unmount");
    }
  },[sime.user])
  
  return (
    <View style={styles.screen}>
      <Text>{JSON.stringify(userData.id)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  }
});

export default DashboardScreen;