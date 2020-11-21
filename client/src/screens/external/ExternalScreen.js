import React, { useState, useContext } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';

import { SimeContext } from '../../context/SimePovider';
import ExternalCard from '../../components/external/ExternalCard';
import CenterSpinner from '../../components/common/CenterSpinner';
import { FETCH_EXTERNALTYPES_QUERY} from '../../util/graphql';

const ExternalScreen = props => {

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
      TouchableCmp = TouchableNativeFeedback;
  }

  const sime = useContext(SimeContext);

  const { data: externalTypes, error: errorExternalTypes, loading: loadingExternalTypes } = useQuery(
    FETCH_EXTERNALTYPES_QUERY
);

  const selectItemHandler = (id, name) => {
    props.navigation.navigate('External List');
    sime.setExternal_type(id);
    sime.setExternal_type_name(name);
  };

  if (errorExternalTypes) {
    console.error(errorExternalTypes);
    return <Text>errorExternalTypes</Text>;
  }

  if (loadingExternalTypes) {
    return <CenterSpinner />;
  }

  return (
      <View style={styles.screen}>
        <FlatList
          style={styles.screen}
          data={externalTypes.getExternalTypes}
          keyExtractor={item => item.id}
          renderItem={itemData => (
            <ExternalCard
              name={itemData.item.name}
              onSelect={() => { selectItemHandler(itemData.item.id, itemData.item.name) }}            >
            </ExternalCard>
          )}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: 5
  }
});

export default ExternalScreen;