import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SummaHeader from '../../components/SummaHeader';
import SummaScreen from '../../components/SummaScreen';

const styles = StyleSheet.create({});

const BlankScreen = ({ route, navigation }) => {
  return (
    <SummaScreen isPadding={false}>
      <View style={{ padding: 10 }}>
        <SummaHeader headerLabel={header} />
      </View>
      <Text
        style={{
          color: 'white',
          textAlign: 'center',
          fontWeight: '800',
          fontSize: 18,
        }}>
        Coming Soon!
      </Text>
    </SummaScreen>
  );
};

export default BlankScreen;
