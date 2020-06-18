import React, { useState, useContext } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';

import { SimeContext } from '../../provider/SimePovider';
import ExternalCard from '../../components/event/ExternalCard';
import { EXTERNALTYPES } from '../../data/dummy-data';

const ExternalScreen = props => {

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
      TouchableCmp = TouchableNativeFeedback;
  }

  const sime = useContext(SimeContext);

  const selectItemHandler = (_id, external_name) => {
    props.navigation.navigate('External List');
    sime.setExternal_type(_id);
    sime.setExternal_type_name(external_name);
  };

  return (
      <View style={styles.screen}>
        <FlatList
          style={styles.screen}
          data={EXTERNALTYPES}
          keyExtractor={item => item._id}
          renderItem={itemData => (
            <ExternalCard
              name={itemData.item.external_name}
              onSelect={() => { selectItemHandler(itemData.item._id, itemData.item.external_name) }}            >
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