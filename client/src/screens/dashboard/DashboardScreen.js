import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';

const DashboardScreen = props => {
  return (
    <View style={styles.screen}>
      <Text>Dashboard Screen</Text>
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