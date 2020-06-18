import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Title, Paragraph, Avatar, Headline, Divider } from 'react-native-paper';

import { EXTERNALS } from '../../data/dummy-data';

const ExternalProfileScreen = ({route}) => {
    const exId = route.params?.externalId;

    const selectedExternal = EXTERNALS.find(external => external._id.indexOf(exId) >= 0)

    return (
        <ScrollView style={styles.screen}>
            <View style={styles.profilePicture}>
                <Avatar.Image style={{ marginBottom: 10 }} size={150} source={{ uri: selectedExternal.picture }} />
                <Headline>{selectedExternal.name}</Headline>
            </View>
            <Divider/>
            <View style={styles.profileDetails}>
                <Title style={styles.titleInfo}>
                    E-mail Address
                </Title>
                <Paragraph>
                    {selectedExternal.email}
                </Paragraph>
                <Divider/>
                <Title style={styles.titleInfo}>
                    Phone Number
                </Title>
                <Paragraph>
                    {selectedExternal.phone_number}
                </Paragraph>
                <Divider/>
                <Title style={styles.titleInfo}>
                    Details
                </Title>
                <Paragraph>
                    {selectedExternal.details}
                </Paragraph>
            </View>
            <Divider style={{marginBottom: 20}}/>
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
    profileDetails:{
        marginHorizontal: 20,
        marginBottom: 20
    },
    titleInfo:{
        fontSize: 16,
        marginTop: 20
    }
});

export default ExternalProfileScreen;