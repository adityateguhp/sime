import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Button, Appbar, Portal, Text, Avatar, Snackbar } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-picker';
import { useMutation } from '@apollo/react-hooks';

import Colors from '../../constants/Colors';
import { SimeContext } from '../../context/SimePovider';
import { emailValidator, phoneNumberValidator, externalNameValidator } from '../../util/validator';
import { FETCH_EXBYTYPE_QUERY, ADD_EXTERNAL_MUTATION } from '../../util/graphql';
import TextInput from '../common/TextInput';
import { theme } from '../../constants/Theme';

const FormExternal = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const [visible, setVisible] = useState(false);

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);

    // const [keyboardSpace, setKeyboarSpace] = useState(0);

    const [errors, setErrors] = useState({
        external_name_error: '',
        email_error: '',
        phone_number_error: ''
    });

    const [values, setValues] = useState({
        name: '',
        external_type: sime.external_type,
        event_id: sime.event_id,
        email: '',
        phone_number: '',
        details: '',
        picture: null,
    });

    const handleUpload = () => {
        ImagePicker.showImagePicker({ maxWidth: 500, maxHeight: 500 }, response => {
            if (response.didCancel) {
                return;
            }

            let apiUrl = 'https://api.cloudinary.com/v1_1/sime/image/upload';

            let data = {
                "file": 'data:image/jpg;base64,' + response.data,
                "upload_preset": "oj5r0s34",
            }

            fetch(apiUrl, {
                body: JSON.stringify(data),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
            }).then(async r => {
                let data = await r.json()
                setValues({...values, picture: data.secure_url })
            }).catch(err => console.log(err))
        })
    }

    const onChange = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' })
    };

    const [addExternal, { loading }] = useMutation(ADD_EXTERNAL_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_EXBYTYPE_QUERY,
                variables: {eventId: values.event_id, externalType: values.external_type}
            });
            data.getExternalByType = [result.data.addExternal, ...data.getExternalByType];
            props.addExternalsStateUpdate(result.data.addExternal);
            proxy.writeQuery({ query: FETCH_EXBYTYPE_QUERY, data, variables: {eventId: values.event_id, externalType: values.external_type} });
            values.name = '';
            values.email = '';
            values.phone_number = '';
            values.details = '';
            values.picture = '';
            props.closeModalForm();
            onToggleSnackBar();
        },
        onError(err) {
            const externalNameError = externalNameValidator(values.name);
            const emailError = emailValidator(values.email);
            const phoneNumberError = phoneNumberValidator(values.phone_number);
            if (externalNameError || emailError || phoneNumberError) {
                setErrors({ ...errors, 
                    external_name_error: externalNameError,
                    email_error: emailError,
                    phone_number_error: phoneNumberError
                })
                return;
            }
        },
        variables: values
    });

    const onSubmit = (event) => {
        event.preventDefault();
        addExternal();
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
                            <Appbar.Content title={<Text style={{ fontWeight: "bold", color: "white" }}>New {sime.external_type_name}</Text>} />
                            <Appbar.Action icon="check" onPress={onSubmit} />
                        </Appbar>
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior="padding"
                            keyboardVerticalOffset={hp(26)}
                        >
                            <ScrollView>
                                <View style={styles.formViewStyle}>
                                    <View style={styles.imageUploadContainer}>
                                    <Avatar.Image style={{ marginBottom: 10 }} size={100} source={values.picture === null || values.picture === '' ? require('../../assets/avatar.png') : { uri: values.picture }} />
                                        <Text style={{ fontSize: 16, color: Colors.primaryColor }} onPress={handleUpload}>Change Profile Photo</Text>
                                    </View>

                                    <View style={styles.inputStyle}>
                                        <TextInput
                                            style={styles.input}
                                            label='Name'
                                            value={values.name}
                                            onChangeText={(val) => onChange('name', val, 'external_name_error')}
                                            error={errors.external_name_error ? true : false}
                                            errorText={errors.external_name_error}
                                        />
                                    </View>
                                    <View style={styles.inputStyle}>
                                        <TextInput
                                            style={styles.input}
                                            label='Email Address'
                                            value={values.email}
                                            onChangeText={(val) => onChange('email', val, 'email_error')}
                                            error={errors.email_error ? true : false}
                                            errorText={errors.email_error}
                                        />
                                    </View>
                                    <View style={styles.inputStyle}>
                                        <TextInput
                                           style={styles.input}
                                           label='Phone Number'
                                           value={values.phone_number}
                                           onChangeText={(val) => onChange('phone_number', val, 'phone_number_error')}
                                           error={errors.phone_number_error ? true : false}
                                           errorText={errors.phone_number_error}
                                        />
                                    </View>
                                    <View style={styles.inputStyle}>
                                        <TextInput
                                           style={styles.input}
                                           multiline={true}
                                           label='Details'
                                           value={values.details}
                                           onChangeText={(val) => onChange('details', val, '')}
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </View>
            </Modal>
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
            >
                External added!
            </Snackbar>
        </Portal >
    );
};

const modalFormWidth = wp(100);
const modalFormHeight = hp(80);

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


export default FormExternal;