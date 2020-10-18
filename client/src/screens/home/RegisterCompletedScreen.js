import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper'
import { CommonActions } from "@react-navigation/native";
import LottieView from 'lottie-react-native';

import Header from '../../components/common/Header';


const RegisterCompletedScreen = ({ navigation }) => {
  const selectHandler = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  }
  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.animationContainer}>
          <LottieView style={styles.animation} source={require('../../assets/success_animation.json')} autoPlay loop />
          <Header>Registration Completed!</Header>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button labelStyle={{fontWeight:"bold"}} icon={'arrow-left'} onPress={selectHandler}>Login</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:{
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  animationContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 300
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    margin: 18
  }
});

export default RegisterCompletedScreen;