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


const TaskDivisionScreen = ({ navigation }) => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const { data: divisions, error: error1, loading: loading1 } = useQuery(
        FETCH_DIVISIONS_QUERY,
        {
            variables: { projectId: sime.project_id },
        }
    );

    const selectItemHandler = (name, id) => {
        navigation.navigate('Task', {
            divisionName: name,
            divisionId: id
        });

        sime.setDivision_name(name);
    };
   
    if (error1) {
        console.error(error1);
        return <Text>Error</Text>;
    }

    if (loading1) {
        return <CenterSpinner />;
    }

    if (divisions.getDivisions.length === 0) {
        return (
            <View style={styles.content}>
                <Text>No divisions found</Text>
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
                        onSelect={() => { selectItemHandler(itemData.itemname, itemData.item.id) }}
                    >
                    </DivisionCard>
                )}
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



export default TaskDivisionScreen;