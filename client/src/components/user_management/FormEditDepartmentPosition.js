import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Keyboard, ScrollView } from 'react-native';
import { Appbar, Portal } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useMutation } from '@apollo/react-hooks';

import { positionNameValidator } from '../../util/validator';
import TextInput from '../common/TextInput';
import { SimeContext } from '../../context/SimePovider'
import { UPDATE_DEPARTMENT_POSITION_MUTATION, FETCH_DEPARTMENT_POSITIONS_QUERY } from '../../util/graphql';
import LoadingModal from '../common/LoadingModal';

const FormEditDepartmentPosition = props => {
    const sime = useContext(SimeContext);

    const [errors, setErrors] = useState({
        position_name_error: '',
    });

    const [values, setValues] = useState({
        departmentPositionId: '',
        name: ''
    });

    const onChange = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' })
    };

    useEffect(() => {
        if (props.position) {
            setValues({
                departmentPositionId: props.position.id,
                name: props.position.name
            })
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.position])

    const [updateDepartmentPosition, { loading }] = useMutation(UPDATE_DEPARTMENT_POSITION_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_DEPARTMENT_POSITIONS_QUERY,
                variables: { organizationId: sime.user.organization_id }
            });
            props.updateDepartmentPositionsStateUpdate(result.data.updateDepartmentPosition)
            props.updateDepartmentPositionStateUpdate(result.data.updateDepartmentPosition)
            proxy.writeQuery({ query: FETCH_DEPARTMENT_POSITIONS_QUERY, data, variables: { organizationId: sime.user.organization_id } });
            props.closeModalForm();
        },
        onError() {
            const positionError = positionNameValidator(values.name);
            if (positionError) {
                setErrors({ ...errors, position_name_error: positionError })
            }
        },
        variables: values
    });

    const onSubmit = (event) => {
        event.preventDefault();
        updateDepartmentPosition();
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
                            <Appbar.Content title={"Edit Position"} />
                            <Appbar.Action icon="delete" onPress={props.deleteButton} />
                            <Appbar.Action icon="check" onPress={onSubmit} />
                        </Appbar>
                        <ScrollView>
                            <View style={styles.formViewStyle}>
                                <View style={styles.inputStyle}>
                                <TextInput
                                        style={styles.input}
                                        label='Position Name'
                                        value={values.name}
                                        onChangeText={(val) => onChange('name', val, 'position_name_error')}
                                        error={errors.position_name_error? true : false}
                                        errorText={errors.position_name_error}
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

export default FormEditDepartmentPosition;