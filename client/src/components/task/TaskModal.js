import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, TouchableOpacity, TouchableNativeFeedback, Platform, ScrollView } from 'react-native';
import { Paragraph, Portal, Title, Appbar, Caption, Chip, Divider, Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal";
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import DateTimePicker from 'react-native-modal-datetime-picker';

import TextInput from '../common/TextInput';
import { taskNameValidator } from '../../util/validator';
import { FETCH_TASKS_QUERY, UPDATE_TASK_MUTATION, FETCH_STAFF_QUERY, FETCH_ORGANIZATION_QUERY } from '../../util/graphql';
import Colors from '../../constants/Colors';
import PersonInChargeChipContainer from './PersonInChargeChipContainer'
import AssignedToModal from './AssignedToModal'
import LoadingModal from '../common/LoadingModal';
import { SimeContext } from '../../context/SimePovider';

const TaskModal = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const [visible, setVisible] = useState(false);

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

    const [roadmapDate, setRoadmapDate] = useState({
        start_date: '',
        end_date: ''
    });

    const onChange = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' });
    };

    const onCheck = () => {
        setValues({ ...values, completed: !values.completed, completed_date: values.completed ? '' : new Date() });
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
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.task])

    useEffect(() => {
        if (props.roadmap) {
            setRoadmapDate({
                start_date: props.roadmap.start_date,
                end_date: props.roadmap.end_date,
            })
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.roadmap])

    const [createdByName, setCreatedByName] = useState(null)

    const [loadOrganization, { data: organization, error: errorOrganization, loading: loadingOrganization }] = useLazyQuery(
        FETCH_ORGANIZATION_QUERY, {
        variables: {
            organizationId: props.createdBy
        }
    });

    const { data: staff, error: errorStaff, loading: loadingStaff } = useQuery(
        FETCH_STAFF_QUERY, {
        variables: {
            staffId: props.createdBy
        },
        onCompleted: () => {
            setCreatedByName(staff.getStaff.name)
        },
        onError: () => {
            loadOrganization();
        }
    });

    useEffect(() => {
        if (organization) {
            setCreatedByName(organization.getOrganization.name)
        } else {
            setCreatedByName('-')
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [organization])

    const updateTaskScreen = (proxy, result) => {
        const data = proxy.readQuery({
            query: FETCH_TASKS_QUERY,
            variables: { roadmapId: props.task.roadmap_id }
        });
        props.updateTasksStateUpdate(result.data.updateTask);
        props.closeButton();
        proxy.writeQuery({ query: FETCH_TASKS_QUERY, data, variables: { roadmapId: props.task.roadmap_id } });
    }

    const updateMyTaskScreen = (result) => {
        props.updateTasksStateUpdate(result.data.updateTask);
        props.closeButton();
    }

    const [updateTask, { loading }] = useMutation(UPDATE_TASK_MUTATION, {
        update(proxy, result) {
            props.taskScreen ? updateTaskScreen(proxy, result) : updateMyTaskScreen(result);
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

    const onSubmit = (event) => {
        event.preventDefault();
        updateTask();
        props.closeButton();
    }

    const closeModal = () => {
        setVisible(false);
    }

    const openModal = () => {
        setVisible(true);
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
                            {
                                sime.user_type === "Organization"
                                    || props.userPersonInCharge.order === '1'
                                    || props.userPersonInCharge.order === '2'
                                    || props.userPersonInCharge.order === '3'
                                    || props.userPersonInCharge.order === '6' && props.userPersonInCharge.committee_id === props.committeeId
                                    || props.userPersonInCharge.order === '7' && props.userPersonInCharge.committee_id === props.committeeId
                                    || props.checkAssignedTask.length > 0 ?
                                    <Appbar.Action icon="window-close" onPress={onSubmit} color="white" />
                                    :
                                    <Appbar.Action icon="window-close" onPress={() => { props.closeButton() }} color="white" />
                            }
                            <Appbar.Content />
                            {
                                sime.user_type === "Organization"
                                    || props.userPersonInCharge.order === '1'
                                    || props.userPersonInCharge.order === '2'
                                    || props.userPersonInCharge.order === '3'
                                    || props.userPersonInCharge.order === '6' && props.userPersonInCharge.committee_id === props.committeeId
                                    || props.userPersonInCharge.order === '7' && props.userPersonInCharge.committee_id === props.committeeId ?
                                    <Appbar.Action icon="delete" onPress={props.deleteButton} color="white" /> : null}
                            {
                                sime.user_type === "Organization"
                                    || props.userPersonInCharge.order === '1'
                                    || props.userPersonInCharge.order === '2'
                                    || props.userPersonInCharge.order === '3'
                                    || props.userPersonInCharge.order === '6' && props.userPersonInCharge.committee_id === props.committeeId
                                    || props.userPersonInCharge.order === '7' && props.userPersonInCharge.committee_id === props.committeeId
                                    || props.checkAssignedTask.length > 0 ?
                                    <Appbar.Action icon={values.completed ? "checkbox-marked" : "checkbox-blank-outline"} color="white" onPress={() => onCheck()} />
                                    :
                                    <Appbar.Action icon={values.completed ? "checkbox-marked" : "checkbox-blank-outline"} color="white" disabled={true} />
                            }
                        </Appbar>
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior="padding"
                        >
                            <ScrollView>
                                <View style={styles.formViewStyle}>
                                    {
                                        sime.user_type === "Organization"
                                            || props.userPersonInCharge.order === '1'
                                            || props.userPersonInCharge.order === '2'
                                            || props.userPersonInCharge.order === '3'
                                            || props.userPersonInCharge.order === '6' && props.userPersonInCharge.committee_id === props.committeeId
                                            || props.userPersonInCharge.order === '7' && props.userPersonInCharge.committee_id === props.committeeId ?
                                            taskNameInput ?
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
                                                </View>
                                            :
                                            <View style={styles.containerText}>
                                                <Title>{values.name}</Title>
                                            </View>
                                    }
                                    <View style={styles.createdByView}>
                                        <Caption>Created by </Caption>
                                        <Caption style={{ fontWeight: "bold" }}>{createdByName + " "}</Caption>
                                        <Caption>{"on " + moment(props.createdAt).format('MMM D YYYY h:mm a')}</Caption>
                                    </View>
                                    <View style={styles.completedDateView}>
                                        {values.completed ? <Caption style={{ opacity: 0.6 }}>{"Completed on " + moment(values.completed_date).format('MMM D YYYY h:mm a')}</Caption> : null}
                                    </View>
                                    {
                                        sime.user_type === "Organization"
                                            || props.userPersonInCharge.order === '1'
                                            || props.userPersonInCharge.order === '2'
                                            || props.userPersonInCharge.order === '3'
                                            || props.userPersonInCharge.order === '6' && props.userPersonInCharge.committee_id === props.committeeId
                                            || props.userPersonInCharge.order === '7' && props.userPersonInCharge.committee_id === props.committeeId ?
                                            taskDescriptionInput ?
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
                                            :
                                            <View>
                                                <View style={styles.containerText}>
                                                    <View style={styles.descriptionView}>
                                                        {values.description ? <Paragraph style={{ fontSize: 15 }}>{values.description}</Paragraph> : <Paragraph style={{ color: Colors.secondaryColor, opacity: 0.6, fontSize: 15 }}>No description</Paragraph>}
                                                    </View>
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
                                        {
                                            sime.user_type === "Organization"
                                                || props.userPersonInCharge.order === '1'
                                                || props.userPersonInCharge.order === '2'
                                                || props.userPersonInCharge.order === '3'
                                                || props.userPersonInCharge.order === '6' && props.userPersonInCharge.committee_id === props.committeeId
                                                || props.userPersonInCharge.order === '7' && props.userPersonInCharge.committee_id === props.committeeId ?
                                                <View style={styles.buttonContainer}>
                                                    <Button
                                                        style={styles.button}
                                                        labelStyle={{ color: Colors.primaryColor }}
                                                        onPress={showDateTimepicker}
                                                        mode="outlined"
                                                    >
                                                        {values.due_date ? due_date : 'SELECT DUE DATE'}
                                                    </Button>
                                                    {values.due_date ?
                                                        <Button
                                                            style={{ marginRight: 3 }}
                                                            icon="close"
                                                            labelStyle={{ color: Colors.primaryColor }}
                                                            onPress={() => onChangeDateTime('due_date', '', '')}
                                                            mode="outlined"
                                                            compact={true}
                                                        >
                                                        </Button> : null}
                                                </View>
                                                :
                                                <View style={styles.buttonContainer}>
                                                    <Button
                                                        style={styles.button}
                                                        labelStyle={{ color: Colors.primaryColor }}
                                                        mode="outlined"
                                                    >
                                                        {values.due_date ? due_date : 'NO DUE DATE'}
                                                    </Button>
                                                </View>
                                        }
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <View style={styles.label}>
                                            <Icon name="alert-box" size={25} color={Colors.primaryColor} />
                                            <Text style={styles.text}>
                                                Priority
                                            </Text>
                                        </View>
                                        {
                                            sime.user_type === "Organization"
                                                || props.userPersonInCharge.order === '1'
                                                || props.userPersonInCharge.order === '2'
                                                || props.userPersonInCharge.order === '3'
                                                || props.userPersonInCharge.order === '6' && props.userPersonInCharge.committee_id === props.committeeId
                                                || props.userPersonInCharge.order === '7' && props.userPersonInCharge.committee_id === props.committeeId ?
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
                                                :
                                                <View style={styles.buttonContainer}>
                                                    <Button
                                                        style={{
                                                            ...styles.button, ...{
                                                                backgroundColor:
                                                                    values.priority === "high" ? "#ff4943" :
                                                                        values.priority === "medium" ? "#a3cd3b" :
                                                                            values.priority === "low" ? "#ffc916" : "#e2e2e2",
                                                            }
                                                        }}
                                                        labelStyle={{ color: Colors.primaryColor }}
                                                        mode="outlined"
                                                    >
                                                        {values.priority ? values.priority : "no status"}
                                                    </Button>
                                                </View>
                                        }
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
                                                    <View style={styles.chip} key={assigned.id}>
                                                        <PersonInChargeChipContainer
                                                            personInChargeId={assigned.person_in_charge_id}
                                                            assignedId={assigned.id}
                                                            taskId={assigned.task_id}
                                                            deleteAssignedTasksStateUpdate={props.deleteAssignedTasksStateUpdate}
                                                            roadmapId={props.roadmapId}
                                                            userPersonInCharge={props.userPersonInCharge}
                                                            committeeId={props.committeeId}
                                                        />
                                                    </View>
                                                ))
                                        }
                                        {
                                            sime.user_type === "Organization"
                                                || props.userPersonInCharge.order === '1'
                                                || props.userPersonInCharge.order === '2'
                                                || props.userPersonInCharge.order === '3'
                                                || props.userPersonInCharge.order === '6' && props.userPersonInCharge.committee_id === props.committeeId
                                                || props.userPersonInCharge.order === '7' && props.userPersonInCharge.committee_id === props.committeeId ?
                                                <View>
                                                    <Chip icon="plus" onPress={openModal}>ADD</Chip>
                                                </View>
                                                : null
                                        }
                                    </View>
                                </View>
                                <Portal>
                                    <DateTimePicker
                                        isVisible={showDateTime}
                                        onConfirm={(val) => onChangeDateTime('due_date', val, '')}
                                        onCancel={closeDateTimepicker}
                                        mode="datetime"
                                        display="default"
                                        minimumDate={new Date(roadmapDate.start_date)}
                                        maximumDate={new Date(roadmapDate.end_date)}
                                    />
                                </Portal>
                                <AssignedToModal
                                    visible={visible}
                                    closeButton={closeModal}
                                    priority={values.priority}
                                    taskId={props.taskId}
                                    roadmapId={props.roadmapId}
                                    eventId={props.eventId}
                                    projectId={props.projectId}
                                    personInCharges={props.personInCharges}
                                    committee={props.committee}
                                    assignedTasks={props.assignedTasks}
                                    assignedTasksStateUpdate={props.assignedTasksStateUpdate}
                                    deleteAssignedTasksStateUpdate={props.deleteAssignedTasksStateUpdate}
                                />
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </View>
                <LoadingModal loading={loading} />
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
        marginVertical: 15,
        justifyContent: 'flex-start',
    },
    createdByView: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    completedDateView: {
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