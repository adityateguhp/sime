import React, { useContext, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import { SimeContext } from '../../context/SimePovider';
import { AuthContext } from '../../context/auth';
import CenterSpinner from '../../components/common/CenterSpinner';
import { FETCH_ORGANIZATION_QUERY } from '../../util/graphql';


const DashboardScreen = props => {
  const sime = useContext(SimeContext);

  const { data: org, error, loading } = useQuery(
    FETCH_ORGANIZATION_QUERY,
    {
      onCompleted: () => {sime.setUser(org.getUserOrganization)}
    }
  );

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