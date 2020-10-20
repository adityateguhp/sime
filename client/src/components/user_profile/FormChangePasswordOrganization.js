import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, TouchableNativeFeedback, Platform, Alert } from 'react-native';
import { Button, Appbar, Portal, Text, Avatar, Snackbar } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-picker';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Dropdown } from 'react-native-material-dropdown-v2';

import Colors from '../../constants/Colors';
import { singlePasswordValidator, confirmPasswordValidator } from '../../util/validator';
import { UPDATE_PASSWORD_ORGANIZATION_MUTATION, FETCH_ORGANIZATION_QUERY } from '../../util/graphql';
import { SimeContext } from '../../context/SimePovider'
import TextInput from '../common/TextInput';
import CenterSpinner from '../common/CenterSpinner';


const FormChangePasswordOrganization = props => {
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
        organizationId: sime.user.id,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const onChange = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' })
    };

    const [updatePasswordOrganization, { loading }] = useMutation(UPDATE_PASSWORD_ORGANIZATION_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_ORGANIZATION_QUERY,
                variables: { organizationId: sime.user.id }
            });
            proxy.writeQuery({ query: FETCH_ORGANIZATION_QUERY, data, variables: { organizationId: sime.user.id } });
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
        updatePasswordOrganization();
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


export default FormChangePasswordOrganization;