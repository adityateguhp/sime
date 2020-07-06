import React, { memo } from 'react';
import Background from '../../components/common/Background';
import Paragraph from '../../components/common/Paragraph';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';

const HomeScreen = ({ navigation }) => (
  <Background>
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
  </Background>
);

export default memo(HomeScreen);
