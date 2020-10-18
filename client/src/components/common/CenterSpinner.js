import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import LottieView from 'lottie-react-native';

const CenterSpinner = () => (
  <View style={styles.container}>
   <LottieView source={require('../../assets/loading_animation2.json')} autoPlay loop />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});


export default CenterSpinner;