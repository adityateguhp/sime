import React, { useState, useContext } from 'react';
import { View, StyleSheet, Keyboard, ScrollView } from 'react-native';
import { Appbar, Portal } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useMutation } from '@apollo/react-hooks';
import { Dropdown } from 'react-native-material-dropdown-v2';

import { positionNameValidator } from '../../util/validator';
import { FETCH_POSITIONS_QUERY, ADD_POSITION_MUTATION } from '../../util/graphql';
import TextInput from '../common/TextInput';
import { SimeContext } from '../../context/SimePovider'
import LoadingModal from '../common/LoadingModal';

const FormPosition = props => {
    const sime = useContext(SimeContext);

    const [errors, setErrors] = useState({
        position_name_error: '',
    });

    const coreValue = [
        { value: true, label: "Panitia Inti" },
        { value: false, label: "Non Panitia Inti" }
    ]

    const [values, setValues] = useState({
        name: '',
        organizationId: sime.user.organization_id,
        core: false,
        order: '9'
    });

    const onChange = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' })
    };

    const [addPosition, { loading }] = useMutation(ADD_POSITION_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSITIONS_QUERY,
                variables: {organizationId: sime.user.organization_id}
            });
            data.getPositions = [result.data.addPosition, ...data.getPositions];
            props.addPositionsStateUpdate(result.data.addPosition);
            proxy.writeQuery({ query: FETCH_POSITIONS_QUERY, data, variables: {organizationId: sime.user.organization_id} });
            values.name = '';
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
        addPosition();
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
                            <Appbar.Content title="New Position" />
                            <Appbar.Action icon="check" onPress={onSubmit}/>
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
                                <View style={styles.inputStyle}>
                                        <Dropdown
                                            label='Committee Type'
                                            value={values.core}
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

export default FormPosition;