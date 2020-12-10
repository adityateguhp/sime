import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Title, Paragraph, Avatar, Headline, Divider, Provider, Portal } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { FETCH_EXTERNAL_QUERY } from '../../util/graphql';
import CenterSpinner from '../../components/common/CenterSpinner';

const ExternalProfileScreen = ({ route }) => {
    const exId = route.params?.externalId;

    const { data: external, error: errorExternal, loading: loadingExternal } = useQuery(
        FETCH_EXTERNAL_QUERY,
        {
            variables: { externalId: exId },
        });


    if (errorExternal) {
        console.error(errorExternal);
        return <Text>errorExternal</Text>;
    }

    if (loadingExternal) {
        return <CenterSpinner />;
    }


    return (
        <ScrollView style={styles.screen}>
            <View style={styles.profilePicture}>
                <Avatar.Image style={{ marginBottom: 10 }} size={wp(36.5)} source={external.getExternal.picture ? { uri: external.getExternal.picture } : require('../../assets/avatar.png')} />
                <Headline style={{marginHorizontal: 15}} numberOfLines={1} ellipsizeMode='tail'>{external.getExternal.name}</Headline>
            </View>
            <Divider />
            <View style={styles.profileDetails}>
                <Title style={styles.titleInfo}>
                    Email Address
                </Title>
                <Paragraph>
                    {external.getExternal.email}
                </Paragraph>
                <Divider />
                <Title style={styles.titleInfo}>
                    Phone Number
                </Title>
                <Paragraph>
                    {external.getExternal.phone_number}
                </Paragraph>
                <Divider />
                <Title style={styles.titleInfo}>
                    Details
                </Title>
                <Paragraph>
                    {external.getExternal.details}
                </Paragraph>
            </View>
            <Divider style={{ marginBottom: 20 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: 'white',
    },
    profilePicture: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20
    },
    profileDetails: {
        marginHorizontal: 20,
        marginBottom: 20
    },
    titleInfo: {
        fontSize: wp(3.89),
        marginTop: 20
    }
});

export default ExternalProfileScreen;