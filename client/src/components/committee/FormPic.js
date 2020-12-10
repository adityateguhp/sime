import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Keyboard, ScrollView } from 'react-native';
import { Appbar, Portal, Text } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useMutation } from '@apollo/react-hooks';
import { Dropdown } from 'react-native-material-dropdown-v2';

import { staffValidator, positionValidator, committeeValidator } from '../../util/validator';
import { FETCH_PICS_QUERY, ADD_PIC_MUTATION, } from '../../util/graphql';
import { SimeContext } from '../../context/SimePovider'
import { theme } from '../../constants/Theme';
import LoadingModal from '../common/LoadingModal';

const FormPic = props => {

    const [keyboardSpace, setKeyboarSpace] = useState(0);

    const sime = useContext(SimeContext);

    const [positionsFiltered, setPositionsFiltered] = useState([]);

    const [errors, setErrors] = useState({
        staff_error: '',
        position_error: '',
        committee_error: ''
    });

    const [values, setValues] = useState({
        staffId: '',
        positionId: '',
        committeeId: '',
        projectId: sime.project_id,
        organizationId: sime.user.organization_id,
        order: ''
    });

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
        if (committee.core) {
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
        if (sime.user_type === 'Staff' && sime.order === '6' || sime.user_type === 'Staff' && sime.order === '7') {
            setValues({ ...values, committeeId: sime.userPicCommittee, positionId: '', staffId: '' });
            const pos = props.positions.filter((e) => e.core === false);
            setPositionsFiltered(pos)
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.openForm])

    let checkStaffs = [];
    props.personInCharges.map((personInCharge) =>
        props.staffs.map((staff) => {
            if (staff.id === personInCharge.staff_id && sime.project_id === personInCharge.project_id) {
                checkStaffs.push(staff.id);
            } else {
                return null
            }
            return null;
        }))

    let filteredStaffs = []
    props.staffs.map((staff) => {
        if (checkStaffs.indexOf(staff.id) > -1) {
            return null
        } else {
            filteredStaffs.push(staff)
        }
    })

    let checkPositions = [];
    props.personInCharges.map((personInCharge) =>
        positionsFiltered.map((position) => {
            if (position.id === personInCharge.position_id
                && sime.project_id === personInCharge.project_id
                && values.committeeId === personInCharge.committee_id
                && position.order < '8'
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
            return null
        } else {
            filteredPositions.push(position)
        }
    })

    const [addPersonInCharge, { loading }] = useMutation(ADD_PIC_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_PICS_QUERY,
                variables: { projectId: sime.project_id }
            });
            data.getPersonInCharges = [result.data.addPersonInCharge, ...data.getPersonInCharges];
            proxy.writeQuery({ query: FETCH_PICS_QUERY, data, variables: { projectId: sime.project_id } });
            props.addPersonInChargesStateUpdate(result.data.addPersonInCharge)
            values.staffId = '';
            values.positionId = '';
            values.committeeId = '';
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
        addPersonInCharge();
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
                            <Appbar.Content title="New Person in Charge" />
                            <Appbar.Action icon="check" onPress={onSubmit} />
                        </Appbar>
                        <ScrollView>
                            <View style={styles.formViewStyle}>
                                <View>
                                    <Dropdown
                                        useNativeDriver={true}
                                        label='Staff'
                                        value={values.staffId}
                                        data={filteredStaffs}
                                        valueExtractor={({ id }) => id}
                                        labelExtractor={({ name }) => name}
                                        onChangeText={(val) => onChange('staffId', val, 'staff_error')}
                                        error={errors.staff_error}
                                    />
                                    {errors.staff_error ? <Text style={styles.error}>{errors.staff_error}</Text> : null}
                                </View>
                                <View>
                                    {sime.user_type === 'Staff' && sime.order === '6' || sime.user_type === 'Staff' && sime.order === '7' ?
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
                                        disabled={values.committeeId ? false : true}
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
        fontSize: wp(3.4),
        color: theme.colors.error,
        paddingHorizontal: 4
    },
});


export default FormPic;