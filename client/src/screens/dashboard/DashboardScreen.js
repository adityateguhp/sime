import React, { useContext, useState, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import { SimeContext } from '../../context/SimePovider';
import { AuthContext } from '../../context/auth';
import CenterSpinner from '../../components/common/CenterSpinner';
import { FETCH_ORGANIZATION_QUERY } from '../../util/graphql';


const DashboardScreen = props => {
  const sime = useContext(SimeContext);

  const { data: org, error, loading } = useQuery(
    FETCH_ORGANIZATION_QUERY
  );

  function userDataCheck() {
    if (loading === false) {
      sime.setUser(org.getUserOrganization)
    }
  }

  useEffect(() => {
    userDataCheck()
    return () => {
      console.log("This will be logged on unmount userDataCheck");
    }
  }, [loading])

  if (loading) {
    return <CenterSpinner />;
  }

  if (error) {
    console.log(error);
    return <Text>Error</Text>;
  }

  return (
    <View style={styles.screen}>
      <Text>{JSON.stringify(sime.user)}</Text>
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