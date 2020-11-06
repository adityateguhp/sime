import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { List } from 'react-native-paper';

import CommitteeListContainer from '../../components/project/CommitteeListContainer';
import { SimeContext } from '../../context/SimePovider';

const DivisionCard = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    return (
        <TouchableCmp onLongPress={ props.name === "Core Committee"? null : sime.order === '1' || sime.order ==='2' || sime.user_type === "Organization"? props.onLongPress : null}>
            <View style={styles.container}>
                <List.Section
                    style={styles.accordion}
                    titleStyle={{ color:'black', fontSize: 16 }}
                    title={props.name}
                >
                    <CommitteeListContainer
                        division_id={props.division_id}
                        staffs={props.staffs}
                        divisions={props.divisions}
                        positions={props.positions}
                        committees={props.committees}
                        onSelect={props.onSelect}
                        deleteCommitteesStateUpdate={props.deleteCommitteesStateUpdate}
                        updateCommitteesStateUpdate={props.updateCommitteesStateUpdate}
                    />
                </List.Section>
            </View >
        </TouchableCmp>
    );
};

const styles = StyleSheet.create({
    accordion: {

    },
    task: {
        display: "flex"
    },
    status: {
        fontSize: 11
    },
    container: {
        marginVertical: 5,
        marginHorizontal: 10,
        flex: 1,
        backgroundColor: 'white',
        elevation: 3,
        borderRadius: 4

    }
});


export default DivisionCard;