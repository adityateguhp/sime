import React, { useState, useContext } from 'react';
import { View, StyleSheet, Keyboard, ScrollView } from 'react-native';
import { Appbar, Portal } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useMutation } from '@apollo/react-hooks';

import { committeeNameValidator } from '../../util/validator';
import { FETCH_COMMITTEES_QUERY, ADD_COMMITTEE_MUTATION } from '../../util/graphql';
import TextInput from '../common/TextInput';
import { SimeContext } from '../../context/SimePovider';
import LoadingModal from '../common/LoadingModal';

const FormCommittee = props => {

    const sime = useContext(SimeContext);

    const [errors, setErrors] = useState({
        committee_name_error: '',
    });

    const [values, setValues] = useState({
        name: '',
        organizationId: sime.user.organization_id,
        core: false
    });

    const onChange = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' })
    };

    const [addCommittee, { loading }] = useMutation(ADD_COMMITTEE_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_COMMITTEES_QUERY,
                variables: { organizationId: values.organizationId }
            });
            data.getCommittees = [result.data.addCommittee, ...data.getCommittees];
            props.addCommitteesStateUpdate(result.data.addCommittee);
            proxy.writeQuery({ query: FETCH_COMMITTEES_QUERY, data, variables: { organizationId: values.organizationId } });
            values.name = '';
            props.closeModalForm();
        },
        onError(err) {
            const committeeNameError = committeeNameValidator(values.name);
            if (committeeNameError) {
                setErrors({ ...errors, committee_name_error: committeeNameError })
            }
            if (err.graphQLErrors[0].extensions.exception.errors) {
                setErrors({
                    ...errors,
                    committee_name_error: 'Core Committee is already exist'
                })
            }
        },
        variables: values
    });

    const onSubmit = (event) => {
        event.preventDefault();
        addCommittee();
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
                            <Appbar.Content title="New Committee" />
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


export default FormCommittee;