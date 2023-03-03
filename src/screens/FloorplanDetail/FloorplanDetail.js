import { CaretLeft, Faders } from 'phosphor-react-native';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SummaHeader from '../../components/SummaHeader';
import SummaScreen from '../../components/SummaScreen';
import SummaText from '../../components/SummaText';
import { MODAL_IDS } from '../../constants';
import { COLORS, FONTS, SIZES } from '../../theme';
import { dxfFileLocation } from '../../utils/SummaFloorplanDownloadManager';
import FloorplanViewer from './FloorplanViewer';

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    marginBottom: 90,
    fontSize: SIZES.large,
    color: '#fff',
    fontWeight: FONTS.extraBold,
  },
});

const FloorplanDetail = ({ route, navigation, showModal }) => {
  const [openFloorplanViewer, setOpenFloorplanViewer] = useState(true);

  const floorplan = useMemo(() => {
    return route?.params?.floorplan || null;
  }, [route]);

  const filePath = useMemo(() => {
    return { url: dxfFileLocation(floorplan) };
  }, [floorplan]);

  return (
    <SummaScreen isPadding={false}>
      <View style={{ padding: 10 }}>
        <SummaHeader
          headerLabel={floorplan.name}
          iconLeftButton={
            <>
              <CaretLeft size={30} color={COLORS.primary} />
              <SummaText medium={true} color={COLORS.primary}>
                Floorplans
              </SummaText>
            </>
          }
          handleLeftButton={() => navigation.goBack()}
          iconRightButton={<Faders size={30} color="#fff" />}
          handleRightButton={() => showModal({ modalId: MODAL_IDS.FILTER_FIXTURE })}
        />
      </View>

      {filePath && filePath.url ? (
        <FloorplanViewer
          loadingDxf={openFloorplanViewer}
          setLoadingDxf={setOpenFloorplanViewer}
          filePath={filePath}
        />
      ) : (
        <View style={{ paddingBottom: 50 }}>
          <Text style={styles.text}>Error, please try again</Text>
        </View>
      )}
    </SummaScreen>
  );
};

export default FloorplanDetail;
