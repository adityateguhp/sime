import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, TouchableNativeFeedback, Platform, Image } from 'react-native';
import { Button, Appbar, Portal, Text, Snackbar } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-picker';
import { useMutation } from '@apollo/react-hooks';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

import Colors from '../../constants/Colors';
import { projectNameValidator, dateValidator } from '../../util/validator';
import { FETCH_PROJECTS_QUERY, UPDATE_PROJECT_MUTATION } from '../../util/graphql';
import { SimeContext } from '../../context/SimePovider'
import TextInput from '../common/TextInput';
import { theme } from '../../constants/Theme';

const FormEditProject = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    //const [keyboardSpace, setKeyboarSpace] = useState(0);

    const sime = useContext(SimeContext);

    const [errors, setErrors] = useState({
        project_name_error: '',
        date_error: ''
    });

    const [values, setValues] = useState({
        projectId: '',
        name: '',
        description: '',
        cancel: false,
        start_date: '',
        end_date: '',
        picture: null,
        organizationId: ''
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

    useEffect(() => {
        if (props.project) {
            setValues({
                projectId: props.project.id,
                name: props.project.name,
                description: props.project.description,
                cancel: props.project.cancel,
                start_date: props.project.start_date,
                end_date: props.project.end_date,
                picture: props.project.picture,
                organizationId: props.project.organization_id,
            })
        }
    }, [props.project])

    const [updateProject, { loading }] = useMutation(UPDATE_PROJECT_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_PROJECTS_QUERY,
                variables: {organizationId: sime.user.id}
            });
            props.updateProjectsStateUpdate(result.data.updateProject);
            props.updateProjectStateUpdate(result.data.updateProject)
            proxy.writeQuery({ query: FETCH_PROJECTS_QUERY, data,  variables: {organizationId: sime.user.id} });
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
        updateProject();
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
                <View style={styles.buttomView}>
                    <View style={styles.formView}>
                        <Appbar style={styles.appbar}>
                            <Appbar.Action icon="window-close" onPress={props.closeButton} />
                            <Appbar.Content title="Edit Project" />
                            <Appbar.Action icon="delete" onPress={props.deleteButton} />
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
                                        {values.picture === null || values.picture === '' ?
                                            <View style={styles.imageUpload}>
                                                <Icon name="image" size={70} color="black" />
                                                <Text>Select Project Cover Image</Text>
                                            </View>
                                            :
                                            <View>
                                                <Image source={{ uri: values.picture }} resizeMode="cover" style={styles.imageUploaded} />
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
                                                {values.start_date === null || values.start_date === '' ? 'FROM' : startDate}
                                            </Button>
                                            <Button
                                                style={styles.dateButton}
                                                labelStyle={{ color: Colors.primaryColor }}
                                                onPress={showEndDatepicker}
                                                mode="outlined"
                                            >
                                                {values.end_date === null || values.end_date === '' ? 'TO' : endDate}
                                            </Button>
                                        </View>
                                    </View>
                                    {errors.date_error ? <Text style={styles.error}>{errors.date_error}</Text> : null}

                                    <View style={styles.inputStyle}>
                                        <TextInput
                                            style={styles.input}
                                            label='Project Name'
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
        fontSize: 16,
        marginLeft: 5,
        color: 'black',
        opacity: 0.6
    },
    imageUpload: {
        borderStyle: 'dotted',
        borderWidth: 2,
        borderRadius: 5,
        height: 200,
        marginBottom: 20,
        opacity: 0.6,
        justifyContent: "center",
        alignItems: "center"

    },
    imageUploaded: {
        borderWidth: 2,
        borderRadius: 5,
        height: 200,
        marginBottom: 20,
        justifyContent: "center",
        alignItems: "center"

    },
    error: {
        fontSize: 14,
        color: theme.colors.error,
        paddingHorizontal: 4,
        paddingTop: 4,
    }
});


export default FormEditProject;