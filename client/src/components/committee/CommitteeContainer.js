import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Subheading, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useQuery } from '@apollo/react-hooks';
import SkeletonContent from "react-native-skeleton-content-nonexpo";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { FETCH_COMMITTEE_QUERY } from '../../util/graphql';
import Colors from '../../constants/Colors';
import CenterSpinnerSmall from '../common/CenterSpinnerSmall';

const CommitteeContainer = props => {

    const [committeeName, setCommitteeName] = useState('');

    const { data: committee, error: errorCommittee, loading: loadingCommittee, refetch: refetchCommittee } = useQuery(
        FETCH_COMMITTEE_QUERY,
        {
            variables: { committeeId: props.committee_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                if (committee.getCommittee) {
                    setCommitteeName(committee.getCommittee.name)
                } else {
                    setCommitteeName('[committee not found]')
                }
            }
        }
    );

    useEffect(() => {
        refetchCommittee();
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.onRefresh]);


    return (
        <View style={styles.container}>
            <View style={styles.date}>
                <Subheading style={{ fontWeight: 'bold', color: Colors.primaryColor, marginRight: 20 }} numberOfLines={1} ellipsizeMode='tail'>{committeeName}</Subheading>
            </View>
            <Divider />
        </View>

    );
};

const nameText = [
    {
        width: wp(40),
        height: wp(5),
    }
];

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
    SkletonContainer: {
        width: '100%',
    },

});


export default CommitteeContainer;