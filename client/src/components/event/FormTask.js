import React, { useState } from 'react';
import { View, StyleSheet, Keyboard, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Button, Appbar, Portal, TextInput, Text } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../../constants/Colors';

const FormTask = props => {

    const [keyboardSpace, setKeyboarSpace] = useState(0);

    const [taskName, setTaskName] = useState('');

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
                            <Appbar.Content title="New Agenda" />
                            <Appbar.Action icon="delete" onPress={props.deleteButton} />
                            <Appbar.Action icon="check" onPress={() => console.log('Pressed mail')} />
                        </Appbar>
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior="padding"
                            keyboardVerticalOffset={hp(19)}
                        >
                            <ScrollView>
                                <View style={styles.formViewStyle}>
                                    <View style={styles.dateInputContainer}>
                                        <View style={styles.dateLabel}>
                                            <Icon name="calendar" size={25} color={Colors.primaryColor} />
                                            <Text style={styles.textDate}>
                                                Date :
                                </Text>
                                        </View>
                                        <View style={styles.dateButtonContainer}>
                                            <Button
                                                style={styles.dateButton}
                                                labelStyle={{ color: Colors.primaryColor }}
                                                onPress={() => console.log('Pressed')}
                                                mode="outlined"
                                            >
                                                select date
                                    </Button>
                                        </View>
                                    </View>

                                    <View style={styles.dateInputContainer}>
                                        <View style={styles.dateLabel}>
                                            <Icon name="clock" size={25} color={Colors.primaryColor} />
                                            <Text style={styles.textDate}>
                                                time :
                                </Text>
                                        </View>
                                        <View style={styles.dateButtonContainer}>
                                            <Button
                                                style={styles.dateButton}
                                                labelStyle={{ color: Colors.primaryColor }}
                                                onPress={() => console.log('Pressed')}
                                                mode="outlined"
                                            >
                                                FROM
                                    </Button>
                                            <Button
                                                style={styles.dateButton}
                                                labelStyle={{ color: Colors.primaryColor }}
                                                onPress={() => console.log('Pressed')}
                                                mode="outlined"
                                            >
                                                TO
                                    </Button>
                                        </View>
                                    </View>

                                    <View style={styles.inputStyle}>
                                        <TextInput
                                            style={styles.input}
                                            label='Agenda Name'
                                            value={taskName}
                                            onChangeText={taskName => setTaskName(taskName)}
                                        />
                                    </View>
                                    <View style={styles.inputStyle}>
                                        <TextInput
                                            style={styles.input}
                                            label='Details'
                                            value={agendaDetails}
                                            onChangeText={agendaDetails => setAgendaDetails(agendaDetails)}
                                            multiline={true}
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </View>
            </Modal>
        </Portal >
    );
};

const modalFormWidth = wp(100);
const modalFormHeight = hp(45);

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
    dateLabel: {
        flexDirection: "row",
        alignItems: "center"
    },
    dateInputContainer: {
        flexDirection: "row",
        marginBottom: 15
    },
    dateButton: {
        flex: 1,
        marginLeft: 10,
    },
    dateButtonContainer: {
        flex: 1,
        flexDirection: "row",
    },
    textDate: {
        fontSize: 16,
        marginLeft: 5,
        opacity: 0.6
    },
});


export default FormTask;