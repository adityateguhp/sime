import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Background from '../../components/common/Background';
import Logo from '../../components/common/Logo';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import TextInput from '../../components/common/TextInput';
import { theme } from '../../constants/Theme';
import {
    emailValidator,
    passwordValidator,
    nameValidator,
} from '../../util/Validator';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState({ value: '', error: '' });
    const [email, setEmail] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' });

    const _onSignUpPressed = () => {
        const nameError = nameValidator(name.value);
        const emailError = emailValidator(email.value);
        const passwordError = passwordValidator(password.value);
        const confirmPasswordError = confirmPasswordValidator(confirmPassword.value);

        if (emailError || passwordError || nameError || confirmPasswordError) {
            setName({ ...name, error: nameError });
            setEmail({ ...email, error: emailError });
            setPassword({ ...password, error: passwordError });
            setConfirmPassword({ ...confirmPassword, error: confirmPasswordError });
            return;
        }

        navigation.navigate('Dashboard');
    };

    return (
        <ScrollView>
            <Background>
                <Logo />

                <Header>Create Account</Header>

                <TextInput
                    label="Organization Name"
                    returnKeyType="next"
                    value={name.value}
                    onChangeText={text => setName({ value: text, error: '' })}
                    error={!!name.error}
                    errorText={name.error}
                />

                <TextInput
                    label="Organization E-mail"
                    returnKeyType="next"
                    value={email.value}
                    onChangeText={text => setEmail({ value: text, error: '' })}
                    error={!!email.error}
                    errorText={email.error}
                    autoCapitalize="none"
                    autoCompleteType="email"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                />

                <TextInput
                    label="Password"
                    returnKeyType="done"
                    value={password.value}
                    onChangeText={text => setPassword({ value: text, error: '' })}
                    error={!!password.error}
                    errorText={password.error}
                    secureTextEntry
                />

                <TextInput
                    label="Confirm Password"
                    returnKeyType="done"
                    value={confirmPassword.value}
                    onChangeText={text => setConfirmPassword({ value: text, error: '' })}
                    error={!!confirmPassword.error}
                    errorText={confirmPassword.error}
                    secureTextEntry
                />

                <Button mode="contained" onPress={_onSignUpPressed} style={styles.button}>
                    Sign Up
                </Button>

                <View style={styles.row}>
                    <Text style={styles.label}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login Organization')}>
                        <Text style={styles.link}>Login</Text>
                    </TouchableOpacity>
                </View>
            </Background>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    label: {
        color: theme.colors.secondary,
    },
    button: {
        marginTop: 24,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
});

export default memo(RegisterScreen);
