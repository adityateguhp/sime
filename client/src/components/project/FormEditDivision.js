import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Keyboard, ScrollView } from 'react-native';
import { Button, Appbar, Portal, Snackbar } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useMutation } from '@apollo/react-hooks';


import { divisionNameValidator } from '../../util/validator';
import { FETCH_DIVISIONS_QUERY, UPDATE_DIVISION_MUTATION } from '../../util/graphql';
import TextInput from '../common/TextInput';
import Colors from '../../constants/Colors';
import { SimeContext } from '../../context/SimePovider';

const FormEditDivision = props => {

    const sime = useContext(SimeContext);

    const [errors, setErrors] = useState({
        division_name_error: '',
    });

    const [values, setValues] = useState({
        divisionId: '',
        name: ''
    });

    const onChange = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' })
    };

    useEffect(() => {
        if (props.division) {
            setValues({
                divisionId: props.division.id,
                name: props.division.name
            })
        }
    }, [props.division])

    const [updateDivision, { loading }] = useMutation(UPDATE_DIVISION_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_DIVISIONS_QUERY,
                variables: { projectId: sime.project_id }
            });
            props.updateDivisionsStateUpdate(result.data.updateDivision)
            props.updateDivisionStateUpdate(result.data.updateDivision)
            proxy.writeQuery({ query: FETCH_DIVISIONS_QUERY, data, variables: { projectId: sime.project_id } });
            props.closeModalForm();
        },
        onError(err) {
            const divisionNameError = divisionNameValidator(values.name);
            if (divisionNameError) {
                setErrors({ ...errors, division_name_error: divisionNameError })
            }
            if (err.graphQLErrors[0].extensions.exception.errors) {
                setErrors({
                    ...errors,
                    division_name_error: 'Core Committee is already exist'
                })
            }
        },
        variables: values
    });

    const onSubmit = (event) => {
        event.preventDefault();
        updateDivision();
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
    const safeArea = useSafeArea();

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
                            <Appbar.Content title="Edit Division" />
                            <Appbar.Action icon="delete" onPress={props.deleteButton} />
                            <Appbar.Action icon="check" onPress={onSubmit} />
                        </Appbar>
                        <ScrollView>
                            <View style={styles.formViewStyle}>
                                <View style={styles.inputStyle}>
                                    <TextInput
                                        style={styles.input}
                                        label='Division Name'
                                        value={values.name}
                                        onChangeText={(val) => onChange('name', val, 'division_name_error')}
                                        error={errors.division_name_error ? true : false}
                                        errorText={errors.division_name_error}
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


export default FormEditDivision;