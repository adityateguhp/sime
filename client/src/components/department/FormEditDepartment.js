import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Keyboard, ScrollView } from 'react-native';
import { Button, Appbar, Portal, Text } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { departmentNameValidator } from '../../util/validator';
import TextInput from '../common/TextInput';
import CenterSpinner from '../common/CenterSpinner';
import { SimeContext } from '../../context/SimePovider'
import { UPDATE_DEPARTMENT_MUTATION, FETCH_DEPARTMENTS_QUERY } from '../../util/graphql';

const FormEditDepartment = props => {

    const [errors, setErrors] = useState({
        department_name_error: '',
    });

    const [values, setValues] = useState({
        departmentId: '',
        name: ''
    });

    const onChange = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' })
    };

    useEffect(() => {
        if(props.department){
            setValues({
                departmentId: props.department.id, 
                name: props.department.name
            })
        }
    }, [props.department])    

    const [updateDepartment] = useMutation(UPDATE_DEPARTMENT_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_DEPARTMENTS_QUERY
            });
            proxy.writeQuery({ query: FETCH_DEPARTMENTS_QUERY, data });
            props.closeModalForm();
        },
        onError() {
            const departementNameError = departmentNameValidator(values.name);
            if (departementNameError) {
                setErrors({ ...errors, department_name_error: departementNameError })
            }
        },
        variables: values
    });

    const onSubmit = (event) => {
        event.preventDefault();
        updateDepartment();
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
                    top: keyboardSpace ? -10 - keyboardSpace : 0,
                }}
                statusBarTranslucent>
                <View style={styles.buttomView}>
                    <View style={styles.formView}>
                        <Appbar style={styles.appbar}>
                            <Appbar.Action icon="window-close" onPress={props.closeButton} />
                            <Appbar.Content title={"Edit Department"} />
                            <Appbar.Action icon="delete" onPress={props.deleteButton} />
                            <Appbar.Action icon="check" onPress={onSubmit} />
                        </Appbar>
                        <ScrollView>
                            <View style={styles.formViewStyle}>
                                <View style={styles.inputStyle}>
                                    <TextInput
                                        style={styles.input}
                                        label='Department Name'
                                        value={values.name}
                                        onChangeText={(val) => onChange('name', val, 'department_name_error')}
                                        error={errors.department_name_error ? true : false}
                                        errorText={errors.department_name_error}
                                    />
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
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

export default FormEditDepartment;