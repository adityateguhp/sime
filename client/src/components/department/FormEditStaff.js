import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, TouchableNativeFeedback, Platform, Alert } from 'react-native';
import { Button, Appbar, Portal, Text, Avatar } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-picker';
import { useMutation } from '@apollo/react-hooks';

import Colors from '../../constants/Colors';
import { staffNameValidator, positionNameValidator, emailValidator, phoneNumberValidator } from '../../util/validator';
import { FETCH_STAFFS_QUERY, UPDATE_STAFF_MUTATION } from '../../util/graphql';
import { SimeContext } from '../../context/SimePovider'
import TextInput from '../common/TextInput';


const FormEditStaff = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    // const [keyboardSpace, setKeyboarSpace] = useState(0);

    const [errors, setErrors] = useState({
        staff_name_error: '',
        position_name_error: '',
        email_error: '',
        phone_number_error: '',
    });

    const [values, setValues] = useState({
        staffId: '',
        staff_name: '',
        position_name: '',
        email: '',
        phone_number: '',
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
                console.log(data)
                setValues({ ...values, picture: data.secure_url })
            }).catch(err => console.log(err))
        })
    }

    const onChange = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' })
    };

    useEffect(() => {
        if (props.staff) {
            setValues({
                staffId: props.staff.id,
                staff_name: props.staff.staff_name,
                position_name: props.staff.position_name,
                email: props.staff.email,
                phone_number: props.staff.phone_number,
                picture: props.staff.picture,
            })
        }
    }, [props.staff])

    const [updateStaff, { loading }] = useMutation(UPDATE_STAFF_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_STAFFS_QUERY,
                variables: { departmentId: sime.department_id }
            });
            proxy.writeQuery({ query: FETCH_STAFFS_QUERY, data, variables: { departmentId: sime.department_id } });
            props.closeModalForm();
        },
        onError(err) {
            const staffNameError = staffNameValidator(values.staff_name);
            const positionNameError = positionNameValidator(values.position_name);
            const emailError = emailValidator(values.email);
            const phoneNumberError = phoneNumberValidator(values.phone_number);
            if (staffNameError || positionNameError || emailError || phoneNumberError) {
                setErrors({
                    ...errors,
                    staff_name_error: staffNameError,
                    position_name_error: positionNameError,
                    email_error: emailError,
                    phone_number_error: phoneNumberError
                })
                return;
            }
            if(err.graphQLErrors[0].extensions.exception.errors){
                Alert.alert('Hmmm...', 'Email address is already exist', [
                    { text: 'Close', style: 'default' },
                ]);
            }
        },
        variables: values
    });

    const onSubmit = (event) => {
        event.preventDefault();
        updateStaff();
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
                            <Appbar.Content title="Edit Staff" />
                            {props.deleteButtonVisible? <Appbar.Action icon="delete" onPress={props.deleteButton} />: null}
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
                                            value={values.staff_name}
                                            onChangeText={(val) => onChange('staff_name', val, 'staff_name_error')}
                                            error={errors.staff_name_error ? true : false}
                                            errorText={errors.staff_name_error}
                                        />
                                    </View>
                                    <View style={styles.inputStyle}>
                                        <TextInput
                                            style={styles.input}
                                            label='Position'
                                            value={values.position_name}
                                            onChangeText={(val) => onChange('position_name', val, 'position_name_error')}
                                            error={errors.position_name_error ? true : false}
                                            errorText={errors.position_name_error}
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


export default FormEditStaff;