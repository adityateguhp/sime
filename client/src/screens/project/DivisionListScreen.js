import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { FlatList, Alert, StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Provider, Portal, Title, Text } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import FABbutton from '../../components/common/FABbutton';
import CenterSpinner from '../../components/common/CenterSpinner';
import FormDivision from '../../components/project/FormDivision';
import FormEditDivision from '../../components/project/FormEditDivision';
import DivisionCard from '../../components/project/DivisionCard';
import { SimeContext } from '../../context/SimePovider';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';
import { FETCH_DIVISIONS_QUERY, DELETE_DIVISION, FETCH_DIVISION_QUERY } from '../../util/graphql';

const DivisionListScreen = ({ navigation }) => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const { data: divisions, error: error1, loading: loading1 } = useQuery(
        FETCH_DIVISIONS_QUERY
    );

    const [loadExistData, { called, data: division, error: error2, loading: loading2 }] = useLazyQuery(
        FETCH_DIVISION_QUERY,
        {
            variables: { divisionId: sime.division_id },
        });

    const [divisionVal, setDivisionVal] = useState(null);

    const selectItemHandler = (name, id) => {
        navigation.navigate('Committee List', {
            divisionName: name,
            divisionId: id
        });
        sime.setDepartment_id(id);
        sime.setDivision_name(division_name);
    };

    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);

    const closeModal = () => {
        setVisible(false);
    }

    const closeModalForm = () => {
        setVisibleForm(false);
    }

    const closeModalFormEdit = () => {
        setVisibleFormEdit(false);
    }

    const longPressHandler = (name, id) => {
        setVisible(true);
        sime.setDivision_name(name)
        sime.setDivision_id(id)
        loadExistData();
    }

    const openForm = () => {
        setVisibleForm(true);
    }

    const openFormEdit = () => {
        closeModal();
        setVisibleFormEdit(true);
        setDivisionVal(division.getDivision);
    }

    const divisionId = sime.division_id;

    const [deleteDivision] = useMutation(DELETE_DIVISION, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_DIVISIONS_QUERY,
            });
            divisions.getDivisions = divisions.getDivisions.filter((d) => d.id !== divisionId);
            proxy.writeQuery({ query: FETCH_DIVISIONS_QUERY, data});
        },
        variables: {
            divisionId
        }
    });


    const deleteHandler = () => {
        closeModal();
        closeModalFormEdit();
        Alert.alert('Are you sure?', 'Do you really want to delete this client?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: deleteDivision
            }
        ]);
    };

    if (error1) {
        console.error(error1);
        return <Text>Error</Text>;
    }

    if (loading1) {
        return <CenterSpinner />;
    }

    if (called & error2) {
        console.error(error2);
        return <Text>Error</Text>;
    }

    if (loading2) {
       
    }

    if (divisions.getDivisions.length === 0) {
        return (
            <View style={styles.content}>
                <Text>No divisions found, let's add divisions!</Text>
            </View>
        );
    }

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                data={divisions.getDivisions}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <DivisionCard
                        name={itemData.item.name}
                    >
                    </DivisionCard>
                )}
            />
            <Portal>
                <Modal
                    useNativeDriver={true}
                    isVisible={visible}
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                    onBackButtonPress={closeModal}
                    onBackdropPress={closeModal}
                    statusBarTranslucent>
                    <View style={styles.modalView}>
                        <Title style={{ marginTop: wp(4), marginHorizontal: wp(5), marginBottom: 5, fontSize: wp(4.86) }}>{sime.division_name}</Title>
                        <TouchableCmp onPress={openFormEdit}>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Edit</Text>
                            </View>
                        </TouchableCmp>
                        <TouchableCmp onPress={deleteHandler}>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Delete division</Text>
                            </View>
                        </TouchableCmp>
                    </View>
                </Modal>
            </Portal>
            <FABbutton Icon="plus" label="DIVISION" onPress={openForm} />
            <FormDivision
                closeModalForm={closeModalForm}
                visibleForm={visibleForm}
                deleteButton={deleteHandler}
                closeButton={closeModalForm}
            />
            <FormEditDivision
                closeModalForm={closeModalFormEdit}
                visibleForm={visibleFormEdit}
                division={divisionVal}
                deleteButton={deleteHandler}
                closeButton={closeModalFormEdit}
            />
        </Provider>
    );
}

const modalMenuWidth = wp(77);
const modalMenuHeight = wp(35);

const styles = StyleSheet.create({
    screen: {
        marginTop: 5
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalView: {
        backgroundColor: 'white',
        height: modalMenuHeight,
        width: modalMenuWidth,
        alignSelf: 'center',
        justifyContent: 'flex-start'
    },
    textView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        marginBottom: 5
    },
    text: {
        marginLeft: wp(5.6),
        fontSize: wp(3.65)
    }
});



export default DivisionListScreen;