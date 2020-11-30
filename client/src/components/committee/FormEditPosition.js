import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Keyboard, ScrollView } from 'react-native';
import { Appbar, Portal } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useMutation } from '@apollo/react-hooks';
import { Dropdown } from 'react-native-material-dropdown-v2';

import { positionNameValidator } from '../../util/validator';
import TextInput from '../common/TextInput';
import { SimeContext } from '../../context/SimePovider'
import { UPDATE_POSITION_MUTATION, FETCH_POSITIONS_QUERY } from '../../util/graphql';
import LoadingModal from '../common/LoadingModal';

const FormEditPosition = props => {
    const sime = useContext(SimeContext);

    const [errors, setErrors] = useState({
        position_name_error: '',
    });

    const coreValue = [
        { value: true, label: "Panitia Inti" },
        { value: false, label: "Non Panitia Inti" }
    ]

    const [values, setValues] = useState({
        positionId: '',
        name: '',
        core: false
    });

    const [order, setOrder] = useState('');

    const onChange = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' })
    };

    useEffect(() => {
        if (props.position) {
            setValues({
                positionId: props.position.id,
                name: props.position.name,
                core: props.position.core
            })
            setOrder(props.position.order)
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.position])

    const [updatePosition, { loading }] = useMutation(UPDATE_POSITION_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSITIONS_QUERY,
                variables: { organizationId: sime.user.organization_id }
            });
            props.updatePositionsStateUpdate(result.data.updatePosition)
            props.updatePositionStateUpdate(result.data.updatePosition)
            proxy.writeQuery({ query: FETCH_POSITIONS_QUERY, data, variables: { organizationId: sime.user.organization_id } });
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
        updatePosition();
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
                            <Appbar.Content title="Edit Position" />
                            {order < '9' ? null : <Appbar.Action icon="delete" onPress={props.deleteButton} />}
                            <Appbar.Action icon="check" onPress={onSubmit} />
                        </Appbar>
                        <ScrollView>
                            <View style={styles.formViewStyle}>
                                <View style={styles.inputStyle}>
                                    <TextInput
                                        style={styles.input}
                                        label={
                                            order === '1' ? 'Position Name for Head of Project'
                                                : order === '2' ? 'Position Name for Vice Head of Project'
                                                    : order === '3' ? 'Position Name for Secretary'
                                                        : order === '4' ? 'Position Name for Treasurer'
                                                            : order === '5' ? 'Position Name for Vice Treasurer'
                                                                : order === '6' ? 'Position Name for Coordinator'
                                                                    : order === '7' ? 'Position Name for Vice Coordinator'
                                                                        : order === '8' ? 'Position Name for Member'
                                                                            : 'Position Name'}
                                        value={values.name}
                                        onChangeText={(val) => onChange('name', val, 'position_name_error')}
                                        error={errors.position_name_error ? true : false}
                                        errorText={errors.position_name_error}
                                    />
                                </View>
                                <View style={styles.inputStyle}>
                                    <Dropdown
                                        label='Committee Type'
                                        value={values.core}
                                        disabled={order < '9' ? true : false}
                                        data={coreValue}
                                        onChangeText={(val) => onChange('core', val, '')}
                                        useNativeDriver={true}
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
const modalFormHeight = hp(44);

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

export default FormEditPosition;