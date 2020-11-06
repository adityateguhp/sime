import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Appbar, Portal } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useMutation } from '@apollo/react-hooks';

import { singlePasswordValidator, confirmPasswordValidator } from '../../util/validator';
import { UPDATE_PASSWORD_STAFF_MUTATION, FETCH_STAFF_QUERY } from '../../util/graphql';
import { SimeContext } from '../../context/SimePovider'
import TextInput from '../common/TextInput';

const FormChangePasswordStaff = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    // const [keyboardSpace, setKeyboarSpace] = useState(0);

    const [errors, setErrors] = useState({
        current_password_error: '',
        new_password_error: '',
        confirm_password_error: ''
    });

    const [values, setValues] = useState({
        staffId: sime.user.id,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const onChange = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' })
    };

    const [updatePasswordStaff, { loading }] = useMutation(UPDATE_PASSWORD_STAFF_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_STAFF_QUERY,
                variables: { staffId: sime.user.id }
            });
            proxy.writeQuery({ query: FETCH_STAFF_QUERY, data, variables: { staffId: sime.user.id } });
            values.currentPassword = ''
            values.newPassword = ''
            values.confirmNewPassword = ''
            props.closeModalForm();
        },
        onError(err) {
            const currentPassword = singlePasswordValidator(values.currentPassword);
            const newPasswordError = singlePasswordValidator(values.newPassword);
            const confirmPasswordError = confirmPasswordValidator(values.newPassword, values.confirmNewPassword);
            if ( currentPassword || newPasswordError || confirmPasswordError) {
                setErrors({
                    ...errors,
                    current_password_error: currentPassword,
                    new_password_error: newPasswordError,
                    confirm_password_error: confirmPasswordError
                })
                return;
            }
            if (err) {
                setErrors({
                    ...errors,
                    current_password_error: 'Wrong credentials'
                })
            }


        },
        variables: values
    });

    const onSubmit = (event) => {
        event.preventDefault();
        updatePasswordStaff();
    };

    //for get keyboard height
    // Keyboard.addListener('keyboardDidShow', (frames) => {
    //     if (!frames.endCoordinates) return;
    //     setKeyboarSpace(frames.endCoordinates.height);
    // });
    // Keyboard.addListener('keyboardDidHide', (frames) => {
    //     setKeyboarSpace(0);
    // });
    // const safeArea = useSafeArea();

    return (
        <Portal>
            <Modal
                useNativeDriver={true}
                isVisible={props.visibleForm}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                onBackButtonPress={props.closeModalForm}
                onBackdropPress={props.closeModalForm}
                style={{
                    justifyContent: 'flex-end',
                    margin: 0,
                    // top: keyboardSpace ? -10 - keyboardSpace : 0,
                }}
                statusBarTranslucent>
                <View style={styles.buttomView}>
                    <View style={styles.formView}>
                        <Appbar style={styles.appbar}>
                            <Appbar.Action icon="window-close" onPress={props.closeModalForm} />
                            <Appbar.Content title="Change Password" />
                            <Appbar.Action icon="check" onPress={onSubmit} />
                        </Appbar>
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior="padding"
                            keyboardVerticalOffset={hp(36)}
                        >
                            <ScrollView>
                                <View style={styles.formViewStyle}>
                                    <View style={styles.inputStyle}>
                                        <TextInput
                                            style={styles.input}
                                            label='Current Password'
                                            returnKeyType="next"
                                            value={values.currentPassword}
                                            onChangeText={(val) => onChange('currentPassword', val, 'current_password_error')}
                                            error={errors.current_password_error ? true : false}
                                            errorText={errors.current_password_error}
                                            secureTextEntry
                                        />
                                    </View>

                                    <View style={styles.inputStyle}>
                                        <TextInput
                                            style={styles.input}
                                            label='New Password'
                                            returnKeyType="next"
                                            value={values.newPassword}
                                            onChangeText={(val) => onChange('newPassword', val, 'new_password_error')}
                                            error={errors.new_password_error ? true : false}
                                            errorText={errors.new_password_error}
                                            secureTextEntry
                                        />
                                    </View>

                                    <View style={styles.inputStyle}>
                                        <TextInput
                                            style={styles.input}
                                            label='Confirm New Password'
                                            returnKeyType="done"
                                            value={values.confirmNewPassword}
                                            onChangeText={(val) => onChange('confirmNewPassword', val, 'confirm_password_error')}
                                            error={errors.confirm_password_error ? true : false}
                                            errorText={errors.confirm_password_error}
                                            secureTextEntry
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </View>
            </Modal>
        </Portal >
    );
};

const modalFormWidth = wp(100);
const modalFormHeight = hp(70);

const styles = StyleSheet.create({
    appbar: {

    },
    formView: {
        backgroundColor: 'white',
        height: modalFormHeight,
        width: modalFormWidth,
        alignSelf: 'center',
        justifyContent: 'flex-start'
    },
    formViewStyle: {
        flex: 1,
        marginHorizontal: 20,
        marginVertical: 25,
        justifyContent: 'flex-start',
    },
    formViewStyle: {
        flex: 1,
        marginHorizontal: 20,
        marginVertical: 25,
        justifyContent: 'flex-start',
    },
    inputStyle: {
        marginBottom: 10
    },
    input: {
        backgroundColor: 'white'
    },
    imageUploadContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    }
});


export default FormChangePasswordStaff;