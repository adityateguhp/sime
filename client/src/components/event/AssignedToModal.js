import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, TouchableOpacity, TouchableNativeFeedback, Platform, ScrollView } from 'react-native';
import { Paragraph, Portal, Title, Appbar, Caption, Chip, Divider, Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal";
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useMutation } from '@apollo/react-hooks';
import DateTimePicker from 'react-native-modal-datetime-picker';

import TextInput from '../common/TextInput';
import { taskNameValidator } from '../../util/validator';
import { FETCH_TASKS_QUERY, UPDATE_TASK_MUTATION } from '../../util/graphql';
import { theme } from '../../constants/Theme';
import Colors from '../../constants/Colors';
import CommitteeChipContainer from './CommitteeChipContainer'
import { SimeContext } from '../../context/SimePovider';
import AssignedToSeparator from './AssignedToSeparator';

const AssignedToModal = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    return (
        <Portal>
            <Modal
                useNativeDriver={true}
                isVisible={props.visible}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                style={styles.modalStyle}
                statusBarTranslucent
            >
                <View>
                    <View style={styles.modalView}>
                        <Appbar style={{
                            ...styles.appbar, ...{
                                backgroundColor:
                                    props.priority === "high" ? "#ff4943" :
                                        props.priority === "medium" ? "#a3cd3b" :
                                            props.priority === "low" ? "#ffc916" : "#e2e2e2",
                            }
                        }}>
                            <Appbar.Action icon="window-close" onPress={props.closeButton} />
                            <Appbar.Content title="Committee" subtitle={sime.project_name} />
                            <Appbar.Action icon="check" onPress={props.closeButton} />
                        </Appbar>

                        <ScrollView>
                            <View style={styles.formViewStyle}>
                            {
                                            props.divisions.length === 0 ? null :
                                                props.divisions.map((division) => (
                                                    <View style={styles.chip}>
                                                        <AssignedToSeparator
                                                            name={division.name}
                                                            divisionId={division.id}
                                                            committees={props.committees}
                                                        />
                                                    </View>
                                                ))
                                        }
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </Portal>
    )
}

const modalWidth = wp(100);
const modalHeight = hp(100);

const styles = StyleSheet.create({
    appbar: {

    },
    modalView: {
        backgroundColor: 'white',
        height: modalHeight,
        width: modalWidth,
        alignSelf: 'center',
        justifyContent: 'flex-start'
    },
    modalStyle: {
        justifyContent: 'flex-end',
        margin: 0
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    subtitle: {
        fontSize: 10
    },
    input: {
        backgroundColor: 'white'
    },
    formViewStyle: {
        flex: 1,
        marginHorizontal: 10,
        marginBottom: 5,
        justifyContent: 'flex-start',
    },
    createdByView: {
        flexDirection: 'row',
        marginBottom: 20,
        flexWrap: 'wrap'
    },
    descriptionView: {
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    edit: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    containerText: {
        marginRight: 25
    },
    label: {
        flexDirection: "row",
        alignItems: "center"
    },
    dateInputContainer: {
        flexDirection: "column",
        marginTop: 35
    },
    button: {
        flex: 1,
        marginRight: 3
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        marginTop: 10
    },
    text: {
        fontSize: 16,
        marginLeft: 5,
        opacity: 0.6
    },
    inputContainer: {
        flexDirection: "column",
        marginTop: 20
    },
    assignedInputContainer: {
        flexDirection: "row",
        flexWrap: 'wrap',
        marginTop: 10,
        marginRight: 3
    },
    assignedLabel: {
        marginTop: 20
    },
    chip: {
        marginBottom: 10,
        marginRight: 10,
    }
});


export default AssignedToModal;