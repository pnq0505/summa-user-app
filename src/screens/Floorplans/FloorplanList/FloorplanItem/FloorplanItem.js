import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import room from '../../../../assets/icons/test-room.jpg';
import SummaText from '../../../../components/SummaText';
import { FLOORPLAN_QUANTITY_STATUS_COLOR } from '../../../../constants';
import { SHADOWS } from '../../../../theme';

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(225,225,225,0.2)',
  },
  imageContainer: {},
  image: {
    height: 72,
    width: 72,
  },
  contentContainer: {
    justifyContent: 'center',
    paddingLeft: 10,
    flex: 1,
  },
  itemStatus: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    ...SHADOWS.light,
    height: 10,
    width: 10,
    borderRadius: 50,
  },
  itemStatusContain: {
    flexDirection: 'row',
  },
  toBeConfigured: {
    borderColor: FLOORPLAN_QUANTITY_STATUS_COLOR.toBeConfigured,
    backgroundColor: FLOORPLAN_QUANTITY_STATUS_COLOR.toBeConfigured,
  },
  inReview: {
    borderColor: FLOORPLAN_QUANTITY_STATUS_COLOR.inReview,
    backgroundColor: FLOORPLAN_QUANTITY_STATUS_COLOR.inReview,
  },
  approved: {
    borderColor: FLOORPLAN_QUANTITY_STATUS_COLOR.approved,
    backgroundColor: FLOORPLAN_QUANTITY_STATUS_COLOR.approved,
  },
  toBeReScanned: {
    borderColor: FLOORPLAN_QUANTITY_STATUS_COLOR.toBeReScanned,
    backgroundColor: FLOORPLAN_QUANTITY_STATUS_COLOR.toBeReScanned,
  },
});

const FloorplanItem = ({ item, navigation, setSelectedFlooplanId, fixturesStatusQuantity }) => {
  return (
    <TouchableOpacity
      accessibilityLabel={`floorplan-${item.id}`}
      onPress={() => {
        setSelectedFlooplanId(item.id);
        navigation.navigate('FloorplanDetail', { floorplan: item });
      }}>
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={item.image ? item.image : room}
            style={styles.image}
            borderRadius={6}
            blurRadius={1}
          />
        </View>
        <View style={styles.contentContainer}>
          <SummaText mediumBold color={'#CBDBEC'} textAlign={'left'}>
            {item.name}
          </SummaText>
          <View style={styles.itemStatusContain}>
            <View style={styles.itemStatus}>
              <View style={[styles.statusDot, styles.toBeConfigured]} />
              <SummaText
                normalBold
                color={'#A0B2CA'}
                customText={{ marginLeft: 5 }}>{`Un Scanned: ${
                fixturesStatusQuantity[item.id]?.toBeConfigured || 0
              }`}</SummaText>
            </View>
            <View style={styles.itemStatus}>
              <View style={[styles.statusDot, styles.inReview]} />
              <SummaText normalBold color={'#A0B2CA'} customText={{ marginLeft: 5 }}>{`In Review: ${
                fixturesStatusQuantity[item.id].inReview
              }`}</SummaText>
            </View>
          </View>
          <View style={styles.itemStatusContain}>
            <View style={styles.itemStatus}>
              <View style={[styles.statusDot, styles.approved]} />
              <SummaText normalBold color={'#A0B2CA'} customText={{ marginLeft: 5 }}>{`Approved: ${
                fixturesStatusQuantity[item.id].approved
              }`}</SummaText>
            </View>
            <View style={styles.itemStatus}>
              <View style={[styles.statusDot, styles.toBeReScanned]} />
              <SummaText normalBold color={'#A0B2CA'} customText={{ marginLeft: 5 }}>{`Rejected: ${
                fixturesStatusQuantity[item.id].toBeReScanned
              }`}</SummaText>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FloorplanItem;
