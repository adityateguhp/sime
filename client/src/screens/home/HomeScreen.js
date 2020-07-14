import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Background from '../../components/common/Background';
import Paragraph from '../../components/common/Paragraph';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';

const HomeScreen = ({ navigation }) => (
  <Background>
    <ScrollView contentContainerStyle={{flex: 1}}>
     <View style={styles.container}>
    <Logo />
    <Paragraph>
      Sistem Informasi Manajemen Event
    </Paragraph>
    <Button mode="contained" onPress={() => navigation.navigate('Login Organization')}>
      Login as Organization
    </Button>
    <Button
      mode="outlined"
      onPress={() => navigation.navigate('Login Staff')}
    >
       Login as Staff
    </Button>
    </View>
    </ScrollView>
  </Background>
);

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 20,
      width: '100%',
      maxWidth: 340,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
  }
});

export default memo(HomeScreen);
