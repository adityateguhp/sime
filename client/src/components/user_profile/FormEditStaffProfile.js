import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Appbar, Portal, Text, Avatar } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-picker';
import { useMutation } from '@apollo/react-hooks';

import Colors from '../../constants/Colors';
import { staffNameValidator, emailValidator, phoneNumberValidator } from '../../util/validator';
import { FETCH_STAFF_QUERY, UPDATE_STAFF_MUTATION } from '../../util/graphql';
import { SimeContext } from '../../context/SimePovider'
import TextInput from '../common/TextInput';
import LoadingModal from '../common/LoadingModal';

const FormEditStaffProfile = props => {

    const sime = useContext(SimeContext);

    // const [keyboardSpace, setKeyboarSpace] = useState(0);

    const [errors, setErrors] = useState({
        staff_name_error: '',
        email_error: '',
        phone_number_error: '',
    });

    const [values, setValues] = useState({
        staffId: '',
        name: '',
        position_name: '',
        department_id: '',
        department_position_id: '',
        email: '',
        phone_number: '',
        picture: null,
        organizationId: ''
    });

    const options1 = {
        title: 'Choose Photo Profile',
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
        maxWidth: 500,
        maxHeight: 500
    };

    const options2 = {
        title: 'Change Photo Profile',
        customButtons: [{ name: 'remove', title: 'Remove Photo...' }],
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
        maxWidth: 500,
        maxHeight: 500
    };

    const handleUpload = () => {
        ImagePicker.showImagePicker(values.picture ? options2 : options1, response => {
            if (response.didCancel) {
                return;
            }

            if (response.customButton) {
                setValues({ ...values, picture: '' });
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
                name: props.staff.name,
                position_name: props.staff.position_name,
                department_id: props.staff.department_id,
                department_position_id: props.staff.department_position_id,
                email: props.staff.email,
                phone_number: props.staff.phone_number,
                picture: props.staff.picture,
                organizationId: props.staff.organization_id
            })
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.staff])

    const [updateStaff, { loading }] = useMutation(UPDATE_STAFF_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_STAFF_QUERY,
                variables: { staffId: sime.user.id }
            });
            props.updateStaffStateUpdate(result.data.updateStaff)
            sime.setUser(result.data.updateStaff)
            proxy.writeQuery({ query: FETCH_STAFF_QUERY, data, variables: { staffId: sime.user.id } });
            props.closeModalForm();
        },
        onError(err) {
            const staffNameError = staffNameValidator(values.name);
            const emailError = emailValidator(values.email);
            const phoneNumberError = phoneNumberValidator(values.phone_number);
            if (staffNameError || emailError || phoneNumberError) {
                setErrors({
                    ...errors,
                    staff_name_error: staffNameError,
                    email_error: emailError,
                    phone_number_error: phoneNumberError
                })
                return;
            }
            if (err) {
                setErrors({
                    ...errors,
                    email_error: 'Email address is already exist'
                })
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
                            {props.deleteButtonVisible ? <Appbar.Action icon="delete" onPress={props.deleteButton} /> : null}
                            <Appbar.Action icon="check" onPress={onSubmit} />
                        </Appbar>
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior="padding"
                            keyboardVerticalOffset={hp(36)}
                        >
                            <ScrollView>
                                <View style={styles.formViewStyle}>
                                    <View style={styles.imageUploadContainer}>
                                        <Avatar.Image style={{ marginBottom: 10 }} size={100} source={values.picture ? { uri: values.picture } : require('../../assets/avatar.png')} />
                                        <Text style={{ fontSize: wp(3.89), color: Colors.primaryColor }} onPress={handleUpload}>{values.picture ? "Change Photo Profile" : "Choose Photo Profile"}</Text>
                                    </View>
                                    <View style={styles.inputStyle}>
                                        <TextInput
                                            style={styles.input}
                                            label='Name'
                                            returnKeyType="next"
                                            value={values.name}
                                            onChangeText={(val) => onChange('name', val, 'staff_name_error')}
                                            error={errors.staff_name_error ? true : false}
                                            errorText={errors.staff_name_error}
                                        />
                                    </View>
                                    <View style={styles.inputStyle}>
                                        <TextInput
                                            style={styles.input}
                                            label='Email Address'
                                            returnKeyType="next"
                                            value={values.email}
                                            onChangeText={(val) => onChange('email', val, 'email_error')}
                                            error={errors.email_error ? true : false}
                                            errorText={errors.email_error}
                                            autoCapitalize="none"
                                            autoCompleteType="email"
                                            textContentType="emailAddress"
                                            keyboardType="email-address"
                                        />
                                    </View>
                                    <View style={styles.inputStyle}>
                                        <TextInput
                                            style={styles.input}
                                            label='Phone Number'
                                            returnKeyType="done"
                                            value={values.phone_number}
                                            onChangeText={(val) => onChange('phone_number', val, 'phone_number_error')}
                                            error={errors.phone_number_error ? true : false}
                                            errorText={errors.phone_number_error}
                                            keyboardType="phone-pad"
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </View>
                <LoadingModal loading={loading} />
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


export default FormEditStaffProfile
    ;