import React, { memo, useState, useContext } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { ActivityIndicator, List } from 'react-native-paper';
import { CommonActions } from "@react-navigation/native";

import Header from '../../components/common/Header';
import Background from '../../components/common/Background';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import TextInput from '../../components/common//TextInput';
import { theme } from '../../constants/Theme';
import { AuthContext } from '../../context/auth';
import { SimeContext } from '../../context/SimePovider';
import { LOGIN_ORGANIZATION } from '../../util/graphql';

const LoginOrganizationScreen = ({ navigation }) => {
  const {login} = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const onChange = (key, val) => {
    setValues({ ...values, [key]: val });
  };

  const [loginUserOrganization, { loading }] = useMutation(LOGIN_ORGANIZATION, {
    update(_,
      {
        data: { loginOrganization: userData }
      }
    ) {
      login(userData);
      console.log("success");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  const onSubmit = (event) => {
    event.preventDefault();
    loginUserOrganization();
  };


  return (
    <Background>
      <ScrollView>
        <View style={styles.container}>
          <Logo />

          <Header>Login as Organization</Header>

          <TextInput
            label="Email"
            returnKeyType="next"
            value={values.email}
            error={errors.email ? true : false}
            onChangeText={(val) => onChange('email', val)}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />

          <TextInput
            label="Password"
            returnKeyType="done"
            value={values.password}
            error={errors.password ? true : false}
            onChangeText={(val) => onChange('password', val)}
            secureTextEntry
          />

          {Object.keys(errors).length > 0 && (
            <View style={styles.errorContainer}>
              <List.Section style={styles.errorSection}>
                <Text style={styles.errorHeader}>Error</Text>
                {Object.values(errors).map((value) => (
                  <List.Item
                    key={value}
                    title={value}
                    titleStyle={styles.errorItem}
                    titleNumberOfLines={2}
                    left={() => <List.Icon color={theme.colors.error} style={{ margin: 0 }} icon="alert-circle" />}
                  />
                ))}
              </List.Section>
            </View>
          )}

          <Button mode="contained" style={styles.button} onPress={onSubmit} loading={loading ? true : false}>
            Login
      </Button>

          <View style={styles.row}>
            <Text style={styles.label}>Don’t have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  container: {
    flex: 1,
    padding: 10,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center'
  },
  errorSection: {
    borderStyle: 'solid',
    borderWidth: 1,
    width: wp(100),
    maxWidth: 320,
    borderRadius: 5,
    borderColor: theme.colors.error,
    marginTop: 12
  },
  errorHeader: {
    fontSize: 16,
    color: theme.colors.error,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 15,
    marginBottom: 5
  },
  errorItem: {
    fontSize: 14,
    color: theme.colors.error
  }
});

export default memo(LoginOrganizationScreen);
