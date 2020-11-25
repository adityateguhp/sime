import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Keyboard, ScrollView, TouchableOpacity, TouchableNativeFeedback, Platform, Image } from 'react-native';
import { Button, Appbar, Portal, Text } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useMutation } from '@apollo/react-hooks';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { Dropdown } from 'react-native-material-dropdown-v2';

import Colors from '../../constants/Colors';
import { SimeContext } from '../../context/SimePovider'
import { roadmapNameValidator, dateValidator, committeeValidator } from '../../util/validator';
import { FETCH_ROADMAPS_QUERY, ADD_ROADMAP_MUTATION } from '../../util/graphql';
import TextInput from '../common/TextInput';
import { theme } from '../../constants/Theme';
import LoadingModal from '../common/LoadingModal';

const FormRoadmap = props => {

    const [keyboardSpace, setKeyboarSpace] = useState(0);

    const sime = useContext(SimeContext);

    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const [errors, setErrors] = useState({
        roadmap_name_error: '',
        date_error: '',
        committee_error: ''
    });

    //const [keyboardSpace, setKeyboarSpace] = useState(0);

    const [values, setValues] = useState({
        name: '',
        event_id: sime.event_id,
        project_id: sime.project_id,
        committee_id: '',
        start_date: '',
        end_date: '',
    });

    const [eventDate, setEventDate] = useState({
        start_date: '',
        end_date: ''
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
        if (props.event) {
            setEventDate({
                start_date: props.event.start_date,
                end_date: props.event.end_date,
            })
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.event])

    useEffect(() => {
        if (sime.order === '6' || sime.order === '7') {
            setValues({ ...values, committee_id: sime.userPicCommittee });
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.openForm])

    const [addRoadmap, { loading }] = useMutation(ADD_ROADMAP_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_ROADMAPS_QUERY,
                variables: { eventId: sime.event_id }
            });
            data.getRoadmaps = [result.data.addRoadmap, ...data.getRoadmaps];
            props.addRoadmapsStateUpdate(result.data.addRoadmap);
            proxy.writeQuery({ query: FETCH_ROADMAPS_QUERY, data, variables: { eventId: sime.event_id } });
            values.name = '';
            values.start_date = '';
            values.end_date = '';
            values.committee_id = '';
            props.closeModalForm();
        },
        onError(err) {
            const roadmapNameError = roadmapNameValidator(values.name);
            const dateError = dateValidator(values.start_date, values.end_date);
            const committeeError = committeeValidator(values.committee_id);
            if (roadmapNameError || dateError || committeeError) {
                setErrors({
                    ...errors,
                    roadmap_name_error: roadmapNameError,
                    date_error: dateError,
                    committee_error: committeeError
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
        addRoadmap();
    };


    //for get keyboard height
    Keyboard.addListener('keyboardDidShow', (frames) => {
        if (!frames.endCoordinates) return;
        setKeyboarSpace(frames.endCoordinates.height);
    });
    Keyboard.addListener('keyboardDidHide', (frames) => {
        setKeyboarSpace(0);
    });

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
                    top: keyboardSpace ? -10 - keyboardSpace : 0,
                }}
                statusBarTranslucent>
                <View style={styles.buttomView}>
                    <View style={styles.formView}>
                        <Appbar style={styles.appbar}>
                            <Appbar.Action icon="window-close" onPress={props.closeButton} />
                            <Appbar.Content title="New Roadmap" />
                            <Appbar.Action icon="check" onPress={onSubmit} />
                        </Appbar>
                        <ScrollView>
                            <View style={styles.formViewStyle}>
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
                                        label='Roadmap Name'
                                        value={values.name}
                                        onChangeText={(val) => onChange('name', val, 'roadmap_name_error')}
                                        error={errors.roadmap_name_error ? true : false}
                                        errorText={errors.roadmap_name_error}
                                    />
                                </View>
                                <View>
                                    {sime.order === '6' || sime.order === '7' ?
                                        <Dropdown
                                            useNativeDriver={true}
                                            label='Committee'
                                            disabled={true}
                                            value={values.committee_id}
                                            data={props.committees}
                                            valueExtractor={({ id }) => id}
                                            labelExtractor={({ name }) => name}
                                        /> :
                                        <Dropdown
                                            useNativeDriver={true}
                                            label='Committee'
                                            value={values.committee_id}
                                            data={props.committees}
                                            valueExtractor={({ id }) => id}
                                            labelExtractor={({ name }) => name}
                                            onChangeText={(val) => onChange('committee_id', val, 'committee_error')}
                                            error={errors.committee_error}
                                        />}
                                    {errors.committee_error ? <Text style={styles.error}>{errors.committee_error}</Text> : null}
                                </View>
                            </View>
                            <Portal>
                                <DateTimePicker
                                    isVisible={showStartDate}
                                    onConfirm={(val) => onChangeStartDate('start_date', val, 'date_error')}
                                    onCancel={closeStartDatepicker}
                                    mode="date"
                                    display="default"
                                    maximumDate={values.end_date ? new Date(values.end_date) : new Date(eventDate.end_date)}
                                />
                                <DateTimePicker
                                    isVisible={showEndDate}
                                    onConfirm={(val) => onChangeEndDate('end_date', val, 'date_error')}
                                    onCancel={closeEndDatepicker}
                                    mode="date"
                                    display="default"
                                    minimumDate={values.start_date ? new Date(values.start_date) : null}
                                    maximumDate={new Date(eventDate.end_date)}
                                />
                            </Portal>
                        </ScrollView>
                    </View>
                </View>
                <LoadingModal loading={loading} />
            </Modal>
        </Portal >
    );
};

const modalFormWidth = wp(100);
const modalFormHeight = hp(54);

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
        opacity: 0.6
    },
    error: {
        fontSize: 14,
        color: theme.colors.error,
        paddingHorizontal: 4,
    }
});


export default FormRoadmap;