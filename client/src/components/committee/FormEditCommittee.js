import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Keyboard, ScrollView } from 'react-native';
import { Appbar, Portal } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useMutation } from '@apollo/react-hooks';


import { committeeNameValidator } from '../../util/validator';
import { FETCH_COMMITTEES_QUERY, UPDATE_COMMITTEE_MUTATION } from '../../util/graphql';
import TextInput from '../common/TextInput';
import { SimeContext } from '../../context/SimePovider';
import LoadingModal from '../common/LoadingModal';

const FormEditCommittee = props => {

    const sime = useContext(SimeContext);

    const [errors, setErrors] = useState({
        committee_name_error: '',
    });

    const [values, setValues] = useState({
        committeeId: '',
        name: ''
    });

    const [core, setCore ] = useState(false)

    const onChange = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' })
    };

    useEffect(() => {
        if (props.committee) {
            setValues({
                committeeId: props.committee.id,
                name: props.committee.name
            })
            setCore(props.committee.core)
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.committee])

    const [updateCommittee, { loading }] = useMutation(UPDATE_COMMITTEE_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_COMMITTEES_QUERY,
                variables: { organizationId: sime.user.organization_id }
            });
            props.updateCommitteesStateUpdate(result.data.updateCommittee)
            props.updateCommitteeStateUpdate(result.data.updateCommittee)
            proxy.writeQuery({ query: FETCH_COMMITTEES_QUERY, data, variables: { organizationId: sime.user.organization_id } });
            props.closeModalForm();
        },
        onError(err) {
            const committeeNameError = committeeNameValidator(values.name);
            if (committeeNameError) {
                setErrors({ ...errors, committee_name_error: committeeNameError })
            }
        },
        variables: values
    });

    const onSubmit = (event) => {
        event.preventDefault();
        updateCommittee();
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
                            <Appbar.Content title="Edit Committee" />
                            {core? null : <Appbar.Action icon="delete" onPress={props.deleteButton} />}
                            <Appbar.Action icon="check" onPress={onSubmit} />
                        </Appbar>
                        <ScrollView>
                            <View style={styles.formViewStyle}>
                                <View style={styles.inputStyle}>
                                    <TextInput
                                        style={styles.input}
                                        label='Committee Name'
                                        value={values.name}
                                        onChangeText={(val) => onChange('name', val, 'committee_name_error')}
                                        error={errors.committee_name_error ? true : false}
                                        errorText={errors.committee_name_error}
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


export default FormEditCommittee;