import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Button, Appbar, Portal, Text } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useMutation } from '@apollo/react-hooks';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

import Colors from '../../constants/Colors';
import { SimeContext } from '../../context/SimePovider';
import { singleDateValidator, timeValidator, agendaValidator } from '../../util/validator';
import { FETCH_RUNDOWNS_QUERY, UPDATE_RUNDOWN_MUTATION } from '../../util/graphql';
import TextInput from '../common/TextInput';
import { theme } from '../../constants/Theme';
import LoadingModal from '../common/LoadingModal';


const FormRundown = props => {

    const [keyboardSpace, setKeyboarSpace] = useState(0);

    const sime = useContext(SimeContext);

    const [errors, setErrors] = useState({
        agenda_error: '',
        date_error: '',
        time_error: ''
    });

    const [values, setValues] = useState({
        rundownId: '',
        agenda: '',
        date: '',
        start_time: '',
        end_time: '',
        details: ''
    });

    const [eventDate, setEventDate] = useState({
        start_date: '',
        end_date: ''
    });

    const [showStartTime, setShowStartTime] = useState(false);
    const [showEndTime, setShowEndTime] = useState(false);
    const [showDate, setShowDate] = useState(false)

    const showStartTimepicker = () => {
        setShowStartTime(true);
    };

    const showEndTimepicker = () => {
        setShowEndTime(true);
    };

    const showDatepicker = () => {
        setShowDate(true);
    };

    const closeStartTimepicker = () => {
        setShowStartTime(false);
    };

    const closeEndTimepicker = () => {
        setShowEndTime(false);
    };

    const closeDatepicker = () => {
        setShowDate(false);
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

    const onChange = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' })
    };

    const onChangeStartTime = (key, dateVal, val, err) => {
        const h = (val.getHours() < 10 ? '0' : '') + val.getHours();
        const m = (val.getMinutes() < 10 ? '0' : '') + val.getMinutes();
        const time = h + ':' + m;
        let timeVal = dateVal.concat(' ', time);
        setValues({ ...values, [key]: timeVal });
        setErrors({ ...errors, [err]: '' });
        closeStartTimepicker();
    };

    const onChangeEndTime = (key, dateVal, val, err) => {
        const h = (val.getHours() < 10 ? '0' : '') + val.getHours();
        const m = (val.getMinutes() < 10 ? '0' : '') + val.getMinutes();
        const time = h + ':' + m;
        let timeVal = dateVal.concat(' ', time);
        setValues({ ...values, [key]: timeVal });
        setErrors({ ...errors, [err]: '' });
        closeEndTimepicker();
    };

    const onChangeDate = (key, val, err) => {
        const year = (val.getFullYear() < 10 ? '0' : '') + val.getFullYear();
        const mes = ((val.getMonth() + 1) < 10 ? '0' : '') + (val.getMonth() + 1);
        const dia = (val.getDate() < 10 ? '0' : '') + val.getDate();;
        const date = year + "-" + mes + "-" + dia;
        setValues({ ...values, [key]: date, start_time: '', end_time: '' });
        setErrors({ ...errors, [err]: '' });
        closeDatepicker();
    };

    useEffect(() => {
        if (props.rundown) {
            setValues({
                rundownId: props.rundown.id,
                agenda: props.rundown.agenda,
                date: props.rundown.date,
                start_time: props.rundown.start_time,
                end_time: props.rundown.end_time,
                details: props.rundown.details
            })
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.rundown])

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

    const [updateRundown, { loading }] = useMutation(UPDATE_RUNDOWN_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_RUNDOWNS_QUERY,
                variables: { eventId: sime.event_id }
            });
            data.getRundowns = [result.data.updateRundown, ...data.getRundowns];
            props.updateRundownsStateUpdate(result.data.updateRundown);
            props.updateRundownStateUpdate(result.data.updateRundown);
            proxy.writeQuery({ query: FETCH_RUNDOWNS_QUERY, data, variables: { eventId: sime.event_id } });
            values.agenda = '';
            values.start_time = '';
            values.end_time = '';
            values.date = '';
            values.details = '';
            props.closeModalForm();
        },
        onError(err) {
            const agendaError = agendaValidator(values.agenda);
            const dateError = singleDateValidator(values.date);
            const timeError = timeValidator(values.start_time, values.end_time)
            if (agendaError || dateError || timeError) {
                setErrors({
                    ...errors,
                    agenda_error: agendaError,
                    date_error: dateError,
                    time_error: timeError
                })
                return;
            }
        },
        variables: values
    });

    const date = moment(values.date).format('dddd, MMM D YYYY');
    const startTime = moment(values.start_time).format('LT');
    const endTime = moment(values.end_time).format('LT');

    const onSubmit = (event) => {
        event.preventDefault();
        updateRundown();
    };

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
                            <Appbar.Action icon="window-close" onPress={props.closeButton} />
                            <Appbar.Content title="New Agenda" />
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
                                                onPress={showDatepicker}
                                                mode="outlined"
                                            >
                                                {values.date ? date : 'SELECT DATE'}
                                            </Button>
                                        </View>
                                    </View>
                                    <View style={{ marginBottom: 15 }}>
                                        {errors.date_error ? <Text style={styles.error}>{errors.date_error}</Text> : null}
                                    </View>

                                    <View style={styles.dateInputContainer}>
                                        <View style={styles.dateLabel}>
                                            <Icon name="clock" size={25} color={Colors.primaryColor} />
                                            <Text style={styles.textDate}>
                                                Time :
                                </Text>
                                        </View>
                                        <View style={styles.dateButtonContainer}>
                                            <Button
                                                style={styles.dateButton}
                                                disabled={values.date ? false : true}
                                                labelStyle={{ color: Colors.primaryColor }}
                                                onPress={showStartTimepicker}
                                                mode="outlined"
                                            >
                                                {values.start_time ? startTime : 'FROM'}
                                            </Button>
                                            <Button
                                                style={styles.dateButton}
                                                disabled={values.date ? false : true}
                                                labelStyle={{ color: Colors.primaryColor }}
                                                onPress={showEndTimepicker}
                                                mode="outlined"
                                            >
                                                {values.end_time ? endTime : 'TO'}
                                            </Button>
                                        </View>
                                    </View>
                                    {errors.time_error ? <Text style={styles.error}>{errors.time_error}</Text> : null}

                                    <View style={styles.inputStyle}>
                                        <TextInput
                                            style={styles.input}
                                            label='Agenda'
                                            returnKeyType="next"
                                            value={values.agenda}
                                            onChangeText={(val) => onChange('agenda', val, 'agenda_error')}
                                            error={errors.agenda_error ? true : false}
                                            errorText={errors.agenda_error}
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
                                <Portal>
                                    <DateTimePicker
                                        isVisible={showStartTime}
                                        onConfirm={(val) => onChangeStartTime('start_time', values.date, val, 'time_error')}
                                        onCancel={closeStartTimepicker}
                                        mode="time"
                                        display="default"
                                    />
                                    <DateTimePicker
                                        isVisible={showEndTime}
                                        onConfirm={(val) => onChangeEndTime('end_time', values.date, val, 'time_error')}
                                        onCancel={closeEndTimepicker}
                                        mode="time"
                                        display="default"
                                    />
                                    <DateTimePicker
                                        isVisible={showDate}
                                        onConfirm={(val) => onChangeDate('date', val, 'date_error')}
                                        onCancel={closeDatepicker}
                                        mode="date"
                                        display="default"
                                        minimumDate={new Date(eventDate.start_date)}
                                        maximumDate={new Date(eventDate.end_date)}
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
        fontSize: wp(3.89),
        marginLeft: 5,
        opacity: 0.6
    },
    error: {
        fontSize: wp(3.4),
        color: theme.colors.error,
        paddingHorizontal: 4,
    }
});


export default FormRundown;