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
import { FETCH_COMMITTEES_IN_DIVISION_QUERY, UPDATE_COMMITTEE_MUTATION, FETCH_DIVISIONS_QUERY, FETCH_STAFFS_QUERY, FETCH_POSITIONS_QUERY, FETCH_COMMITTEES_QUERY } from '../../util/graphql';
import { SimeContext } from '../../context/SimePovider'
import TextInput from '../common/TextInput';
import CenterSpinner from '../common/CenterSpinner';

const FormCommittee = props => {

    const [keyboardSpace, setKeyboarSpace] = useState(0);

    const sime = useContext(SimeContext);

    const { data: staffs, error: errorStaffs, loading: loadingStaffs } = useQuery(
        FETCH_STAFFS_QUERY
    );

    const { data: divisions, error: errorDivisions, loading: loadingDivisions } = useQuery(
        FETCH_DIVISIONS_QUERY,
        {
            variables: { projectId: sime.project_id }
        }
    );

    const { data: committees, error: errorCommittees, loading: loadingCommittees } = useQuery(
        FETCH_COMMITTEES_QUERY,
        {
            variables: { projectId: sime.project_id }
        }
    );

    const { data: positions, error: errorPositions, loading: loadingPositions } = useQuery(
        FETCH_POSITIONS_QUERY
    );

    const [errors, setErrors] = useState({
        staff_error: '',
        position_error: '',
        division_error: ''
    });

    const [values, setValues] = useState({
        committeeId: '',
        staffId: '',
        positionId: '',
        divisionId: ''
    });

    const [positionsValue, setPositionValue] = useState([]);

    const onChange = (key, val, err) => {
        setValues({ ...values, [key]: val });
        setErrors({ ...errors, [err]: '' })
    };

    const onChangeDivision = (key, val, err, index) => {
        setValues({ ...values, [key]: val, positionId: '' });
        setErrors({ ...errors, [err]: '' })
        if (index === 0) {
            const pos = positions.getPositions.filter((e) => e.core === true);
            setPositionValue(pos)
        } else {
            const pos = positions.getPositions.filter((e) => e.core === false);
            setPositionValue(pos)
        }
    };


    useEffect(() => {
        if (props.committee) {
            setValues({
                committeeId: props.committee.id,
                staffId: props.committee.staff_id,
                positionId: props.committee.position_id,
                divisionId: props.committee.division_id
            })
            const div = divisions.getDivisions.find((d) => d.name === "Core Committee");
            if (div.id === props.committee.division_id) {
                const pos = positions.getPositions.filter((p) => p.core === true);
                setPositionValue(pos)
            } else {
                const pos = positions.getPositions.filter((p) => p.core === false);
                setPositionValue(pos)
            }
            
        }
    }, [props.committee])

    const [updateCommittee, { loading }] = useMutation(UPDATE_COMMITTEE_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_COMMITTEES_IN_DIVISION_QUERY,
                variables: { divisionId: values.divisionId }
            });
            proxy.writeQuery({ query: FETCH_COMMITTEES_IN_DIVISION_QUERY, data, variables: { divisionId: values.divisionId } });
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
        updateCommittee();
    };

    if (errorStaffs) {
        console.error(errorStaffs);
        return <Text>errorStaffs</Text>;
    }

    if (errorDivisions) {
        console.error(errorDivisions);
        return <Text>errorDivisions</Text>;
    }

    if (errorPositions) {
        console.error(errorPositions);
        return <Text>errorPositions</Text>;
    }

    if (errorCommittees) {
        console.error(errorCommittees);
        return <Text>errorCommittees</Text>;
    }

    if (loadingStaffs) {
        return <CenterSpinner />;
    }

    if (loadingDivisions) {
        return <CenterSpinner />;
    }

    if (loadingPositions) {
        return <CenterSpinner />;
    }

    if (loadingCommittees) {
        return <CenterSpinner />;
    }

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
                                        data={staffs.getStaffs}
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
                                        data={divisions.getDivisions}
                                        valueExtractor={({ id }) => id}
                                        labelExtractor={({ name }) => name}
                                        onChangeText={(val, index) => onChangeDivision('divisionId', val, 'division_error', index)}
                                    />
                                </View>
                                <View>
                                    <Dropdown
                                        useNativeDriver={true}
                                        label='Position'
                                        value={values.positionId}
                                        data={positionsValue}
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