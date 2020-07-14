import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';

const RegisterCompletedScreen = props => {
  return (
    <View style={styles.screen}>
      <Text>Register Completed!</Text>
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

export default RegisterCompletedScreen;