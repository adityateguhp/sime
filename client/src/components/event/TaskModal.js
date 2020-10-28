import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, TouchableOpacity, TouchableNativeFeedback, Platform, ScrollView } from 'react-native';
import { Paragraph, Portal, Title, Appbar, Caption, Chip, Divider, Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal";
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useMutation } from '@apollo/react-hooks';
import DateTimePicker from 'react-native-modal-datetime-picker';

import TextInput from '../common/TextInput';
import { taskNameValidator } from '../../util/validator';
import { FETCH_TASKS_QUERY, UPDATE_TASK_MUTATION } from '../../util/graphql';
import { theme } from '../../constants/Theme';
import Colors from '../../constants/Colors';
import CommitteeChipContainer from './CommitteeChipContainer'

const TaskModal = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const [errors, setErrors] = useState({
        task_name_error: '',
    });

    const [values, setValues] = useState({
        taskId: '',
        name: '',
        description: '',
        completed: false,
        due_date: '',
        completed_date: '',
        priority: ''
    });

    const onChange = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' });
    };

    const onCheck = () => {
        setValues({ ...values, completed: !values.completed, completed_date: values.completed === true ? '' : new Date() });
    };

    const onChangeDateTime = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' });
        closeDateTimepicker();
    };

    useEffect(() => {
        if (props.task) {
            setValues({
                taskId: props.task.id,
                name: props.task.name,
                description: props.task.description,
                completed: props.task.completed,
                due_date: props.task.due_date,
                completed_date: props.task.completed_date,
                priority: props.task.priority
            })
        }
    }, [props.task])

    const [updateTask, { loading }] = useMutation(UPDATE_TASK_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_TASKS_QUERY,
                variables: { roadmapId: props.task.roadmap_id }
            });
            props.updateTasksStateUpdate(result.data.updateTask);
            proxy.writeQuery({ query: FETCH_TASKS_QUERY, data, variables: { roadmapId: props.task.roadmap_id } });
        },
        onError(err) {
            const taskNameError = taskNameValidator(values.name);
            if (taskNameError) {
                setErrors({
                    ...errors,
                    task_name_error: taskNameError,
                })
                setTaskNameInput(true);
                return;
            }
        },
        variables: values
    });

    const [taskNameInput, setTaskNameInput] = useState(false);
    const [taskDescriptionInput, setTaskDescriptionInput] = useState(false);
    const [showDateTime, setShowDateTime] = useState(false)


    const onClickTaskName = () => {
        setTaskNameInput(true);
    }

    const onClickTaskDescription = () => {
        setTaskDescriptionInput(true);
    }

    const showDateTimepicker = () => {
        setShowDateTime(true);
    };

    const onCloseTaskName = () => {
        setTaskNameInput(false);
    }

    const onCloseTaskDescription = () => {
        setTaskDescriptionInput(false);
    }

    const closeDateTimepicker = () => {
        setShowDateTime(false);
    };

    const onCloseButton = (event) => {
        event.preventDefault();
        updateTask();
        props.closeButton();
    }

    const due_date = moment(values.due_date).format('ddd, MMM D YYYY h:mm a');

    return (
        <Portal>
            <Modal
                useNativeDriver={true}
                isVisible={props.visible}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                style={styles.modalStyle}
                statusBarTranslucent
            >
                <View>
                    <View style={styles.modalView}>
                        <Appbar style={{
                            ...styles.appbar, ...{
                                backgroundColor:
                                    values.priority === "high" ? "#ff4943" :
                                        values.priority === "medium" ? "#a3cd3b" :
                                            values.priority === "low" ? "#ffc916" : "#e2e2e2",
                            }
                        }}>
                            <Appbar.Action icon={values.completed ? "checkbox-marked" : "checkbox-blank-outline"} onPress={() => onCheck()} />
                            <Appbar.Content />
                            <Appbar.Action icon="delete" onPress={props.deleteButton} />
                            <Appbar.Action icon="window-close" onPress={onCloseButton} />
                        </Appbar>
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior="padding"
                        >
                            <ScrollView>
                                <View style={styles.formViewStyle}>
                                    {taskNameInput ?
                                        <View>
                                            <TextInput
                                                style={styles.input}
                                                label='Task Name'
                                                value={values.name}
                                                onChangeText={(val) => onChange('name', val, 'task_name_error')}
                                                error={errors.task_name_error ? true : false}
                                                errorText={errors.task_name_error}
                                                onBlur={onCloseTaskName}
                                            />
                                        </View>
                                        :
                                        <View style={styles.containerText}>
                                            <TouchableCmp onPress={onClickTaskName}>
                                                <View style={styles.edit}>
                                                    <Title>{values.name}</Title>
                                                    <Icon name="pencil" size={15} color='grey' style={{ marginLeft: 10, opacity: 0.5 }} />
                                                </View>
                                            </TouchableCmp>
                                        </View>}
                                    <View style={styles.createdByView}>
                                        <Caption>Created by </Caption>
                                        <Caption style={{ fontWeight: "bold" }}>{props.createdBy + " "}</Caption>
                                        <Caption>{"on " + moment(props.createdAt).format('MMM D YYYY h:mm a')}</Caption>
                                    </View>
                                    {taskDescriptionInput ?
                                        <View>
                                            <TextInput
                                                style={styles.input}
                                                label='Description'
                                                value={values.description}
                                                onChangeText={(val) => onChange('description', val, '')}
                                                onBlur={onCloseTaskDescription}
                                                multiline={true}
                                            />
                                        </View>
                                        :
                                        <View>
                                            <View style={styles.containerText}>
                                                <TouchableCmp onPress={onClickTaskDescription}>
                                                    <View style={styles.descriptionView}>
                                                        {values.description ? <Paragraph style={{ fontSize: 15 }}>{values.description}</Paragraph> : <Paragraph style={{ color: Colors.secondaryColor, opacity: 0.6, fontSize: 15 }}>Add description</Paragraph>}
                                                        <Icon name="pencil" size={15} color='grey' style={{ marginLeft: 10, marginTop: 5, opacity: 0.5 }} />
                                                    </View>
                                                </TouchableCmp>
                                            </View>
                                            <Divider />
                                        </View>
                                    }
                                    <View style={styles.dateInputContainer}>
                                        <View style={styles.label}>
                                            <Icon name="calendar" size={25} color={Colors.primaryColor} />
                                            <Text style={styles.text}>
                                                Due date
                                            </Text>
                                        </View>
                                        <View style={styles.buttonContainer}>
                                            <Button
                                                style={styles.button}
                                                labelStyle={{ color: Colors.primaryColor }}
                                                onPress={showDateTimepicker}
                                                mode="outlined"
                                            >
                                                {values.due_date === null || values.due_date === '' ? 'SELECT DUE DATE' : due_date}
                                            </Button>
                                            {values.due_date === null || values.due_date === '' ? null :
                                                <Button
                                                    style={{ marginRight: 3 }}
                                                    icon="close"
                                                    labelStyle={{ color: Colors.primaryColor }}
                                                    onPress={() => onChangeDateTime('due_date', '', '')}
                                                    mode="outlined"
                                                    compact={true}
                                                >
                                                </Button>}
                                        </View>
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <View style={styles.label}>
                                            <Icon name="alert-box" size={25} color={Colors.primaryColor} />
                                            <Text style={styles.text}>
                                                Priority
                                            </Text>
                                        </View>
                                        <View style={styles.buttonContainer}>
                                            <Button
                                                style={{
                                                    ...styles.button, ...{
                                                        backgroundColor:
                                                            values.priority === "low" ? "#ffc916" : "white",
                                                    }
                                                }}
                                                labelStyle={{ color: Colors.primaryColor }}
                                                onPress={values.priority === 'low' ? () => onChange('priority', '', '') : () => onChange('priority', 'low', '')}
                                                mode="outlined"
                                            >
                                                low
                                            </Button>
                                            <Button
                                                style={{
                                                    ...styles.button, ...{
                                                        backgroundColor:
                                                            values.priority === "medium" ? "#a3cd3b" : "white",
                                                    }
                                                }}
                                                labelStyle={{ color: Colors.primaryColor }}
                                                onPress={values.priority === 'medium' ? () => onChange('priority', '', '') : () => onChange('priority', 'medium', '')}
                                                mode="outlined"
                                            >
                                                medium
                                            </Button>
                                            <Button
                                                style={{
                                                    ...styles.button, ...{
                                                        backgroundColor:
                                                            values.priority === "high" ? "#ff4943" : "white",
                                                    }
                                                }}
                                                labelStyle={{ color: Colors.primaryColor }}
                                                onPress={values.priority === 'high' ? () => onChange('priority', '', '') : () => onChange('priority', 'high', '')}
                                                mode="outlined"
                                            >
                                                high
                                            </Button>
                                        </View>
                                    </View>
                                    <View style={styles.assignedLabel}>
                                        <View style={styles.label}>
                                            <Icon name="account-plus" size={25} color={Colors.primaryColor} />
                                            <Text style={styles.text}>
                                                Assigned to
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.assignedInputContainer}>
                                        {
                                            props.assignedTasks.length === 0 ? null :
                                                props.assignedTasks.map((assigned) => (
                                                    <View style={styles.chip}>
                                                        <CommitteeChipContainer
                                                            committeeId={assigned.committee_id}
                                                            assignedId={assigned.id}
                                                            taskId={assigned.task_id}
                                                            deleteAssignedTasksStateUpdate={props.deleteAssignedTasksStateUpdate}
                                                            roadmapId={props.roadmapId}
                                                        />
                                                    </View>
                                                ))
                                        }
                                        <View>
                                            <Button
                                                icon="plus"
                                                onPress={showDateTimepicker}
                                                mode="outlined"
                                                compact={true}
                                            >
                                            </Button>
                                        </View>
                                    </View>
                                </View>
                                <Portal>
                                    <DateTimePicker
                                        isVisible={showDateTime}
                                        onConfirm={(val) => onChangeDateTime('due_date', val, '')}
                                        onCancel={closeDateTimepicker}
                                        mode="datetime"
                                        display="default"
                                    />
                                </Portal>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </View>
            </Modal>
        </Portal>
    )
}

const modalWidth = wp(100);
const modalHeight = hp(100);

const styles = StyleSheet.create({
    appbar: {

    },
    modalView: {
        backgroundColor: 'white',
        height: modalHeight,
        width: modalWidth,
        alignSelf: 'center',
        justifyContent: 'flex-start'
    },
    modalStyle: {
        justifyContent: 'flex-end',
        margin: 0
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    subtitle: {
        fontSize: 10
    },
    input: {
        backgroundColor: 'white'
    },
    formViewStyle: {
        flex: 1,
        marginHorizontal: 20,
        marginVertical: 25,
        justifyContent: 'flex-start',
    },
    createdByView: {
        flexDirection: 'row',
        marginBottom: 20,
        flexWrap: 'wrap'
    },
    descriptionView: {
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    edit: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    containerText: {
        marginRight: 25
    },
    label: {
        flexDirection: "row",
        alignItems: "center"
    },
    dateInputContainer: {
        flexDirection: "column",
        marginTop: 35
    },
    button: {
        flex: 1,
        marginRight: 3
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        marginTop: 10
    },
    text: {
        fontSize: 16,
        marginLeft: 5,
        opacity: 0.6
    },
    inputContainer: {
        flexDirection: "column",
        marginTop: 20
    },
    assignedInputContainer: {
        flexDirection: "row",
        flexWrap: 'wrap',
        marginTop: 10,
        marginRight: 3
    },
    assignedLabel: {
        marginTop: 20
    },
    chip: {
        marginBottom: 10,
        marginRight: 10,
    }
});


export default TaskModal;