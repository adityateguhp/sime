import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Keyboard, ScrollView } from 'react-native';
import { Appbar, Portal, Text } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useMutation } from '@apollo/react-hooks';
import { Dropdown } from 'react-native-material-dropdown-v2';

import { staffValidator, positionValidator, committeeValidator } from '../../util/validator';
import { FETCH_PICS_QUERY, UPDATE_PIC_MUTATION } from '../../util/graphql';
import { SimeContext } from '../../context/SimePovider'
import { theme } from '../../constants/Theme';
import LoadingModal from '../common/LoadingModal';

const FormEditPic = props => {

    const [keyboardSpace, setKeyboarSpace] = useState(0);

    const sime = useContext(SimeContext);

    const [errors, setErrors] = useState({
        staff_error: '',
        position_error: '',
        committee_error: ''
    });

    const [values, setValues] = useState({
        personInChargeId: '',
        staffId: '',
        positionId: '',
        committeeId: '',
        order: ''
    });

    const [positionsFiltered, setPositionsFiltered] = useState([]);

    const onChange = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' })
    };

    const onChangePosition = (key, val, err) => {
        let orderPosition = null
        props.positions.map((position) => {
            if (position.id === val) {
                orderPosition = position.order
            } else {
                return null
            }
            return null;
        })
        setValues({ ...values, [key]: val, order: orderPosition });
        setErrors({ ...errors, [err]: '' })
    };

    let coreCommittee = null
    props.committees.map((committee) => {
        if (committee.name === "Core Committee") {
            coreCommittee = committee.id
        } else {
            return null
        }
        return null;
    })

    const onChangeCommittee = (key, val, err) => {
        setValues({ ...values, [key]: val, positionId: '' });
        setErrors({ ...errors, [err]: '' })
        if (coreCommittee === val) {
            const pos = props.positions.filter((e) => e.core === true);
            setPositionsFiltered(pos)
        } else {
            const pos = props.positions.filter((e) => e.core === false);
            setPositionsFiltered(pos)
        }
    };

    useEffect(() => {
        if (props.personInCharge) {
            setValues({
                personInChargeId: props.personInCharge.id,
                staffId: props.personInCharge.staff_id,
                positionId: props.personInCharge.position_id,
                committeeId: props.personInCharge.committee_id,
                order: props.personInCharge.order
            })
            const div = props.committees.find((d) => d.name === "Core Committee");
            if (div.id === props.personInCharge.committee_id) {
                const pos = props.positions.filter((p) => p.core === true);
                setPositionsFiltered(pos)
            } else {
                const pos = props.positions.filter((p) => p.core === false);
                setPositionsFiltered(pos)
            }

        }
    }, [props.personInCharge])

    let checkPositions = [];
    props.personInCharges.map((personInCharge) =>
        positionsFiltered.map((position) => {
            if (position.id === personInCharge.position_id
                && sime.project_id === personInCharge.project_id
                && values.committeeId === personInCharge.committee_id
                && position.name !== "Member"
            ) {
                checkPositions.push(position.id)
            } else {
                return null
            }
            return null;
        })
    );

    let filteredPositions = []
    positionsFiltered.map((position) => {
        if (checkPositions.indexOf(position.id) > -1) {
            if (props.personInCharge.position_id === position.id) {
                filteredPositions.push(position)
            } else {
                return null
            }
        } else {
            filteredPositions.push(position)
        }
    })

    const [updatePersonInCharge, { loading }] = useMutation(UPDATE_PIC_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_PICS_QUERY,
                variables: { projectId: sime.project_id }
            });
            props.updatePersonInChargesStateUpdate(result.data.updatePersonInCharge);
            props.updatePersonInChargeStateUpdate(result.data.updatePersonInCharge);
            proxy.writeQuery({ query: FETCH_PICS_QUERY, data, variables: { projectId: sime.project_id } });
            props.closeModalForm();
        },
        onError(err) {
            const staffError = staffValidator(values.staffId);
            const positionError = positionValidator(values.positionId);
            const committeeError = committeeValidator(values.committeeId);
            if (staffError || positionError || committeeError) {
                setErrors({
                    ...errors,
                    staff_error: staffError,
                    position_error: positionError,
                    committee_error: committeeError,
                })
                return;
            }
        },
        variables: values
    });

    //for get keyboard height
    Keyboard.addListener('keyboardDidShow', (frames) => {
        if (!frames.endCoordinates) return;
        setKeyboarSpace(frames.endCoordinates.height);
    });
    Keyboard.addListener('keyboardDidHide', (frames) => {
        setKeyboarSpace(0);
    });

    const onSubmit = (event) => {
        event.preventDefault();
        updatePersonInCharge();
    };

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
                            <Appbar.Content title="Edit Person in Charge" />
                            <Appbar.Action icon="delete" onPress={props.deleteButton} />
                            <Appbar.Action icon="check" onPress={onSubmit} />
                        </Appbar>
                        <ScrollView>
                            <View style={styles.formViewStyle}>
                                <View>
                                    <Dropdown
                                        useNativeDriver={true}
                                        label='Staff'
                                        disabled={true}
                                        value={values.staffId}
                                        data={props.staffs}
                                        valueExtractor={({ id }) => id}
                                        labelExtractor={({ name }) => name}
                                    />
                                </View>
                                <View>
                                    {sime.order === '6' ||sime.order === '7' ?
                                        <Dropdown
                                            useNativeDriver={true}
                                            label='Committee'
                                            disabled={true}
                                            value={values.committeeId}
                                            data={props.committees}
                                            valueExtractor={({ id }) => id}
                                            labelExtractor={({ name }) => name}
                                        /> :
                                        <Dropdown
                                            useNativeDriver={true}
                                            label='Committee'
                                            value={values.committeeId}
                                            data={props.committees}
                                            valueExtractor={({ id }) => id}
                                            labelExtractor={({ name }) => name}
                                            onChangeText={(val) => onChangeCommittee('committeeId', val, 'committee_error')}
                                            error={errors.committee_error}
                                        />}
                                    {errors.committee_error ? <Text style={styles.error}>{errors.committee_error}</Text> : null}
                                </View>
                                <View>
                                    <Dropdown
                                        useNativeDriver={true}
                                        label='Position'
                                        value={values.positionId}
                                        data={filteredPositions}
                                        valueExtractor={({ id }) => id}
                                        labelExtractor={({ name }) => name}
                                        onChangeText={(val) => onChangePosition('positionId', val, 'position_error')}
                                        error={errors.position_error}
                                    />
                                    {errors.position_error ? <Text style={styles.error}>{errors.position_error}</Text> : null}
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
const modalFormHeight = hp(54);

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
    },
    error: {
        fontSize: 14,
        color: theme.colors.error,
        paddingHorizontal: 4
    },
});


export default FormEditPic;