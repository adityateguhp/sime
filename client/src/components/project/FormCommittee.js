import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Keyboard, ScrollView } from 'react-native';
import { Button, Appbar, Portal, Text } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Dropdown } from 'react-native-material-dropdown-v2';

import Colors from '../../constants/Colors';
import { staffValidator, positionValidator, divisionValidator } from '../../util/validator';
import { FETCH_COMMITTEES_IN_DIVISION_QUERY, ADD_COMMITTEE_MUTATION, } from '../../util/graphql';
import { SimeContext } from '../../context/SimePovider'

const FormCommittee = props => {

    const [keyboardSpace, setKeyboarSpace] = useState(0);

    const sime = useContext(SimeContext);

    const [positionsFiltered, setPositionsFiltered] = useState([]);

    const [errors, setErrors] = useState({
        staff_error: '',
        position_error: '',
        division_error: ''
    });

    const [values, setValues] = useState({
        staffId: '',
        positionId: '',
        divisionId: '',
        projectId: sime.project_id
    });

    const onChange = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' })
    };

    const onChangeDivision = (key, val, err, index) => {
        setValues({ ...values, [key]: val, positionId: '' });
        setErrors({ ...errors, [err]: '' })
        if (index === 0) {
            const pos = props.positions.filter((e) => e.core === true);
            setPositionsFiltered(pos)
        } else {
            const pos = props.positions.filter((e) => e.core === false);
            setPositionsFiltered(pos)
        }
    };

    let checkStaffs = [];
    props.committees.map((committee) =>
        props.staffs.map((staff) => {
            if (staff.id === committee.staff_id && sime.project_id === committee.project_id) {
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
    props.committees.map((committee) =>
        positionsFiltered.map((position) => {
            if (position.id === committee.position_id
                && sime.project_id === committee.project_id
                && values.divisionId === committee.division_id
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
            return null
        } else {
            filteredPositions.push(position)
        }
    })

    const [addCommittee, { loading }] = useMutation(ADD_COMMITTEE_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_COMMITTEES_IN_DIVISION_QUERY,
                variables: { divisionId: values.divisionId }
            });
            data.getCommitteesInDivision = [result.data.addCommittee, ...data.getCommitteesInDivision];
            proxy.writeQuery({ query: FETCH_COMMITTEES_IN_DIVISION_QUERY, data, variables: { divisionId: values.divisionId } });
            props.addCommitteesStateUpdate(result.data.addCommittee)
            values.staffId = '';
            values.positionId = '';
            values.divisionId = '';
            props.closeModalForm();
        },
        onError(err) {
            const staffError = staffValidator(values.name);
            const positionError = positionValidator(values.position_name);
            const divisionError = divisionValidator(values.email);
            if (staffError || positionError || divisionError) {
                setErrors({
                    ...errors,
                    staff_error: staffError,
                    position_error: positionError,
                    division_error: divisionError,
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
        addCommittee();
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
                            <Appbar.Content title="New Committee" />
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
                                    />
                                </View>
                                <View>
                                    <Dropdown
                                        useNativeDriver={true}
                                        label='Division'
                                        value={values.divisionId}
                                        data={props.divisions}
                                        valueExtractor={({ id }) => id}
                                        labelExtractor={({ name }) => name}
                                        onChangeText={(val, index) => onChangeDivision('divisionId', val, 'division_error', index)}
                                    />
                                </View>
                                <View>
                                    <Dropdown
                                        useNativeDriver={true}
                                        label='Position'
                                        disabled={values.divisionId ? false : true}
                                        value={values.positionId}
                                        data={filteredPositions}
                                        valueExtractor={({ id }) => id}
                                        labelExtractor={({ name }) => name}
                                        onChangeText={(val) => onChange('positionId', val, 'position_error')}
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
    }
});


export default FormCommittee;