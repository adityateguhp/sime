import React, { useContext } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Title, Paragraph, Avatar, Headline, Divider, Provider, Menu, Snackbar } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';

import { FETCH_ORGANIZATION_QUERY } from '../../util/graphql';
import CenterSpinner from '../../components/common/CenterSpinner';
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';

const OrganizationProfileScreen = ({ route, navigation }) => {
    const { data: organization, error: error1, loading: loading1 } = useQuery(
        FETCH_ORGANIZATION_QUERY, {
        variables: {
            organizationId: route.params?.organizationId
        }
    });

    if (error1) {
        console.error(error1);
        return <Text>Error 1</Text>;
    }

    if (loading1) {
        return <CenterSpinner />;
    }

    return (
        <Provider theme={theme}>
            <ScrollView style={styles.screen}>
                <View style={styles.profilePicture}>
                    <Avatar.Image style={{ marginBottom: 10 }} size={150} source={organization.getOrganization.picture === null || organization.getOrganization.picture === '' ? require('../../assets/avatar.png') : { uri: organization.getOrganization.picture }} />
                    <Headline>{organization.getOrganization.name}</Headline>
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
                        description
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
        fontSize: 16,
        marginTop: 20
    }
});

export default OrganizationProfileScreen;