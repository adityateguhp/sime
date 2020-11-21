import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { List } from 'react-native-paper';

import PicListContainer from './PicListContainer';
import { SimeContext } from '../../context/SimePovider';

const CommitteeCard = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    return (
        <TouchableCmp onLongPress={ props.name === "Core Committee"? null : sime.order === '1' || sime.order ==='2' || sime.order ==='3' || sime.user_type === "Organization"? props.onLongPress : null}>
            <View style={styles.container}>
                <List.Section
                    style={styles.accordion}
                    titleStyle={{ color:'black', fontSize: 16 }}
                    title={props.name}
                >
                    <PicListContainer
                        committee_id={props.committee_id}
                        staffs={props.staffs}
                        committees={props.committees}
                        positions={props.positions}
                        personInCharges={props.personInCharges}
                        onSelect={props.onSelect}
                        deletePersonInChargesStateUpdate={props.deletePersonInChargesStateUpdate}
                        updatePersonInChargesStateUpdate={props.updatePersonInChargesStateUpdate}
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


export default CommitteeCard;