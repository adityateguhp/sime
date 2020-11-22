import React, {useEffect, useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { Subheading, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useQuery } from '@apollo/react-hooks';

import { FETCH_COMMITTEE_QUERY } from '../../util/graphql';
import Colors from '../../constants/Colors';

const CommitteeContainer = props => {

    const [committeeName, setCommitteeName] = useState(null);

    const { data: committee, error: errorCommittee, loading: loadingCommittee, refetch: refetchCommittee } = useQuery(
        FETCH_COMMITTEE_QUERY,
        {
            variables: { committeeId: props.committee_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setCommitteeName(committee.getCommittee.name) }
        }
    );


    return (
        <View style={styles.container}>
            <View style={styles.date}>
                <Subheading style={{ fontWeight: 'bold', color: Colors.primaryColor }}>{committeeName}</Subheading>
            </View>
            <Divider />
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        marginTop: 10,
        elevation: 3,
        backgroundColor: 'white',
        
    },
    date: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },

});


export default CommitteeContainer;