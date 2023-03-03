import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import FloorplanItem from './FloorplanItem/FloorplanItem';

const styles = StyleSheet.create({});

const FloorplanList = ({
  navigation,
  floorplanList,
  setSelectedFlooplanId,
  fixturesStatusQuantity,
}) => {
  const itemSeparator = () => {
    return <View style={styles.separator} />;
  };

  const renderItem = useCallback(
    (data) => {
      const { item } = data;
      return (
        <FloorplanItem
          item={item}
          navigation={navigation}
          setSelectedFlooplanId={setSelectedFlooplanId}
          fixturesStatusQuantity={fixturesStatusQuantity}
        />
      );
    },
    [setSelectedFlooplanId, fixturesStatusQuantity, navigation],
  );

  return (
    <View>
      <FlatList
        data={floorplanList.length > 0 ? floorplanList : []}
        renderItem={renderItem}
        ItemSeparatorComponent={itemSeparator}
      />
    </View>
  );
};

export default FloorplanList;
