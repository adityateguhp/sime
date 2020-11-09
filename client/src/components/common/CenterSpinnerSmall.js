import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper'
import Colors from '../../constants/Colors'

const CenterSpinnerSmall = () => (
  <View style={styles.container}>
    <ActivityIndicator animating={true} color={Colors.primaryColor} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  }
});


export default CenterSpinnerSmall;