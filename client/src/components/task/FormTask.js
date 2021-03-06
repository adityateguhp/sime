import React, { useState, useContext } from 'react';
import { View, StyleSheet, Keyboard, ScrollView } from 'react-native';
import { Appbar, Portal} from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useMutation } from '@apollo/react-hooks';

import { taskNameValidator } from '../../util/validator';
import { FETCH_TASKS_QUERY, ADD_TASK_MUTATION } from '../../util/graphql';
import TextInput from '../common/TextInput';
import { SimeContext } from '../../context/SimePovider';
import LoadingModal from '../common/LoadingModal';

const FormTask = props => {

    const sime = useContext(SimeContext);

    const [errors, setErrors] = useState({
        task_name_error: '',
    });

    const [values, setValues] = useState({
        name: '',
        description: '',
        completed: false,
        due_date: '',
        priority:'',
        roadmapId: sime.roadmap_id,
        projectId: sime.project_id,
        eventId: sime.event_id,
        createdBy: sime.user.id
    });

    const onChange = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' })
    };

    const [addTask, { loading }] = useMutation(ADD_TASK_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_TASKS_QUERY,
                variables: {roadmapId: values.roadmapId}
            });
            data.getTasks = [result.data.addTask, ...data.getTasks];
            props.addTasksStateUpdate(result.data.addTask);
            proxy.writeQuery({ query: FETCH_TASKS_QUERY, data, variables: {roadmapId: values.roadmapId}});
            values.name = '';
            props.closeModalForm();
        },
        onError() {
            const taskNameError = taskNameValidator(values.name);
            if (taskNameError) {
                setErrors({ ...errors, task_name_error: taskNameError })
            }
        },
        variables: values
    });

    const onSubmit = (event) => {
        event.preventDefault();
        addTask();
    };

    const [keyboardSpace, setKeyboarSpace] = useState(0);

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
                    top: keyboardSpace ? -10 -keyboardSpace : 0,
                }}
                statusBarTranslucent>
                <View style={styles.buttomView}>
                    <View style={styles.formView}>
                        <Appbar style={styles.appbar}>
                            <Appbar.Action icon="window-close" onPress={props.closeButton} />
                            <Appbar.Content title="New Task" />
                            <Appbar.Action icon="check" onPress={onSubmit} />
                        </Appbar>
                            <ScrollView>
                                <View style={styles.formViewStyle}>
                                    <View style={styles.inputStyle}>
                                        <TextInput
                                            style={styles.input}
                                            label='Task Name'
                                            value={values.name}
                                            onChangeText={(val) => onChange('name', val, 'task_name_error')}
                                            error={errors.task_name_error? true : false}
                                            errorText={errors.task_name_error}
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                    </View>
                </View>
                <LoadingModal loading={loading} />
            </Modal>
        </Portal >
    );
};

const modalFormWidth = wp(100);
const modalFormHeight = hp(34);

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
    }
});


export default FormTask;