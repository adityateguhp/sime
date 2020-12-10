import React, { useEffect, useContext } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl } from 'react-native';
import { Text, Title, Paragraph, Avatar, Headline, Divider, Provider } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { FETCH_ORGANIZATION_QUERY } from '../../util/graphql';
import { theme } from '../../constants/Theme';
import CenterSpinner from '../../components/common/CenterSpinner';
import { SimeContext } from '../../context/SimePovider';

const StaffOrganizationProfileScreen = ({ route, navigation }) => {
    
    const sime = useContext(SimeContext);
    
    const { data: organization, error: error1, loading: loading1, refetch: refetchOrganization } = useQuery(
        FETCH_ORGANIZATION_QUERY, {
        variables: {
            organizationId: route.params?.organizationId ? route.params?.organizationId : sime.user.organization_id
        },
        notifyOnNetworkStatusChange: true
    });

    const onRefresh = () => {
        refetchOrganization();
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    if (error1) {
        console.error(error1);
        return <Text>Error 1</Text>;
    }

    if (loading1) {
        return <CenterSpinner />;
    }

    return (
        <Provider theme={theme}>
            <ScrollView
                style={styles.screen}
                refreshControl={
                    <RefreshControl
                        refreshing={loading1}
                        onRefresh={onRefresh} />
                }
            >
                <View style={styles.profilePicture}>
                    <Avatar.Image style={{ marginBottom: 10 }} size={wp(36.5)} source={organization.getOrganization.picture ? { uri: organization.getOrganization.picture } : require('../../assets/avatar.png')} />
                    <Headline style={{marginHorizontal: 15}} numberOfLines={1} ellipsizeMode='tail'>{organization.getOrganization.name}</Headline>
                </View>
                <Divider />
                <View style={styles.profileDetails}>
                    <Title style={styles.titleInfo}>
                        Email Address
                </Title>
                    <Paragraph>
                        {organization.getOrganization.email}
                    </Paragraph>
                    <Divider />
                    <Title style={styles.titleInfo}>
                        Phone Number
                </Title>
                    <Paragraph>
                        {organization.getOrganization.phone_number}
                    </Paragraph>
                    <Divider />
                    <Title style={styles.titleInfo}>
                        Address
                </Title>
                    <Paragraph>
                        {organization.getOrganization.address}
                    </Paragraph>
                    <Divider />
                    <Title style={styles.titleInfo}>
                        Description
                </Title>
                    <Paragraph>
                        {organization.getOrganization.description}
                    </Paragraph>
                </View>
                <Divider style={{ marginBottom: 20 }} />
            </ScrollView>
        </Provider>
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

export default StaffOrganizationProfileScreen;