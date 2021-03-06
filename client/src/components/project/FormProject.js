import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, TouchableNativeFeedback, Platform, Image } from 'react-native';
import { Button, Appbar, Portal, Text } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-picker';
import { useMutation } from '@apollo/react-hooks';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

import Colors from '../../constants/Colors';
import { projectNameValidator, dateValidator } from '../../util/validator';
import { FETCH_PROJECTS_QUERY, ADD_PROJECT_MUTATION } from '../../util/graphql';
import TextInput from '../common/TextInput';
import { theme } from '../../constants/Theme';
import { SimeContext } from '../../context/SimePovider';
import LoadingModal from '../common/LoadingModal';

const FormProject = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    //const [keyboardSpace, setKeyboarSpace] = useState(0);

    const [errors, setErrors] = useState({
        project_name_error: '',
        date_error: ''
    });

    const [values, setValues] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        picture: null,
        organizationId: sime.user.organization_id
    });

    const [showStartDate, setShowStartDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);

    const showStartDatepicker = () => {
        setShowStartDate(true);
    };

    const showEndDatepicker = () => {
        setShowEndDate(true);
    };

    const closeStartDatepicker = () => {
        setShowStartDate(false);
    };

    const closeEndDatepicker = () => {
        setShowEndDate(false);
    };

    const options1 = {
        title: 'Choose Project Cover Image',
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
        maxWidth: 500,
        maxHeight: 500
    };

    const options2 = {
        title: 'Change Project Cover Image',
        customButtons: [{ name: 'remove', title: 'Remove Image...' }],
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

    const onChangeStartDate = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' });
        closeStartDatepicker();
    };

    const onChangeEndDate = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' });
        closeEndDatepicker();
    };

    const [addProject, { loading }] = useMutation(ADD_PROJECT_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_PROJECTS_QUERY,
                variables: { organizationId: sime.user.organization_id }
            });
            data.getProjects = [result.data.addProject, ...data.getProjects];
            props.addProjectsStateUpdate(result.data.addProject);
            proxy.writeQuery({ query: FETCH_PROJECTS_QUERY, data, variables: { organizationId: sime.user.organization_id } });
            values.name = '';
            values.description = '';
            values.start_date = '';
            values.end_date = '';
            values.picture = '';
            props.closeModalForm();
        },
        onError(err) {
            const projectNameError = projectNameValidator(values.name);
            const dateError = dateValidator(values.start_date, values.end_date);
            if (projectNameError || dateError) {
                setErrors({
                    ...errors,
                    project_name_error: projectNameError,
                    date_error: dateError
                })
                return;
            }
        },
        variables: values
    });

    const startDate = moment(values.start_date).format('ll');
    const endDate = moment(values.end_date).format('ll');

    const onSubmit = (event) => {
        event.preventDefault();
        addProject();
    };
    //for get keyboard height
    // Keyboard.addListener('keyboardDidShow', (frames) => {
    //     if (!frames.endCoordinates) return;
    //     setKeyboarSpace(frames.endCoordinates.height);
    // });
    // Keyboard.addListener('keyboardDidHide', (frames) => {
    //     setKeyboarSpace(0);
    // });

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
                    // top: keyboardSpace ? -10 -keyboardSpace : 0,
                }}
                statusBarTranslucent>
                <View>
                    <View style={styles.formView}>
                        <Appbar style={styles.appbar}>
                            <Appbar.Action icon="window-close" onPress={props.closeButton} />
                            <Appbar.Content title="New Project" />
                            <Appbar.Action icon="check" onPress={onSubmit} />
                        </Appbar>
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior="padding"
                            keyboardVerticalOffset={hp(26)}
                        >
                            <ScrollView>

                                <View style={styles.formViewStyle}>
                                    <TouchableCmp onPress={handleUpload}>
                                        {values.picture ?
                                            <View>
                                                <Image source={{ uri: values.picture }} resizeMode="cover" style={styles.imageUploaded} />
                                            </View>
                                            :
                                            <View style={styles.imageUpload}>
                                                <Icon name="image" size={70} color="black" />
                                                <Text>Choose Project Cover Image</Text>
                                            </View>
                                        }
                                    </TouchableCmp>

                                    <View style={styles.dateInputContainer}>
                                        <View style={styles.dateLabel}>
                                            <Icon name="calendar" size={25} color={Colors.primaryColor} />
                                            <Text style={styles.textDate}>
                                                Date :
                                            </Text>
                                        </View>
                                        <View style={styles.dateButtonContainer}>
                                            <Button
                                                style={styles.dateButton}
                                                labelStyle={{ color: Colors.primaryColor }}
                                                onPress={showStartDatepicker}
                                                mode="outlined"
                                            >
                                                {values.start_date ? startDate : 'FROM'}
                                            </Button>
                                            <Button
                                                style={styles.dateButton}
                                                labelStyle={{ color: Colors.primaryColor }}
                                                onPress={showEndDatepicker}
                                                mode="outlined"
                                            >
                                                {values.end_date ? endDate : 'TO'}
                                            </Button>
                                        </View>
                                    </View>
                                    {errors.date_error ? <Text style={styles.error}>{errors.date_error}</Text> : null}

                                    <View style={styles.inputStyle}>
                                        <TextInput
                                            style={styles.input}
                                            label='Project Name'
                                            returnKeyType="next"
                                            value={values.name}
                                            onChangeText={(val) => onChange('name', val, 'project_name_error')}
                                            error={errors.project_name_error ? true : false}
                                            errorText={errors.project_name_error}
                                        />
                                    </View>
                                    <View style={styles.inputStyle}>
                                        <TextInput
                                            style={styles.input}
                                            label='Project Description'
                                            value={values.description}
                                            onChangeText={(val) => onChange('description', val, '')}
                                            multiline={true}
                                        />
                                    </View>
                                </View>
                                <Portal>
                                    <DateTimePicker
                                        isVisible={showStartDate}
                                        onConfirm={(val) => onChangeStartDate('start_date', val, 'date_error')}
                                        onCancel={closeStartDatepicker}
                                        mode="date"
                                        display="default"
                                        maximumDate={values.end_date ? new Date(values.end_date) : null}
                                    />
                                    <DateTimePicker
                                        isVisible={showEndDate}
                                        onConfirm={(val) => onChangeEndDate('end_date', val, 'date_error')}
                                        onCancel={closeEndDatepicker}
                                        mode="date"
                                        display="default"
                                        minimumDate={values.start_date ? new Date(values.start_date) : null}
                                    />
                                </Portal>
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
        marginBottom: 15
    },
    input: {
        backgroundColor: 'white'
    },
    dateLabel: {
        flexDirection: "row",
        alignItems: "center"
    },
    dateInputContainer: {
        flexDirection: "row",
        marginBottom: 15
    },
    dateButton: {
        flex: 1,
        marginLeft: 10,
    },
    dateButtonContainer: {
        flex: 1,
        flexDirection: "row",
    },
    textDate: {
        fontSize: wp(3.89),
        marginLeft: 5,
        color: 'black',
        opacity: 0.6
    },
    imageUpload: {
        borderStyle: 'dotted',
        borderWidth: 2,
        borderRadius: 5,
        height: wp(48),
        marginBottom: 20,
        opacity: 0.6,
        justifyContent: "center",
        alignItems: "center"

    },
    imageUploaded: {
        borderWidth: 2,
        borderRadius: 5,
        height: wp(48),
        marginBottom: 20,
        justifyContent: "center",
        alignItems: "center"

    },
    error: {
        fontSize: wp(3.4),
        color: theme.colors.error,
        paddingHorizontal: 4
    }
});


export default FormProject;