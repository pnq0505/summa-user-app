import { debounce } from 'lodash';
import { CaretLeft } from 'phosphor-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import LoadingProgress from '../../components/LoadingProgress';
import SummaHeader from '../../components/SummaHeader';
import SummaScreen from '../../components/SummaScreen';
import SummaText from '../../components/SummaText';
import { COLORS } from '../../theme';

import { fetchFixturesForPloorlan as fetchFixturesForPloorlanAction } from '../../store/features/fixture/action';

// TEST DOWNLOAD MULTIPLE FILE
import FloorplanList from './FloorplanList';

import offlineDataManager from '../../utils/OfflineDataManager';
import saveFileManager from '../../utils/SaveFileManager';
import { SummaFloorplanDownloadManager } from '../../utils/SummaFloorplanDownloadManager';

const downloadManager = new SummaFloorplanDownloadManager();

const styles = StyleSheet.create({
  Center: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Floorplans = ({
  navigation,
  floorplanList,
  logoutAction,
  unsavedFixtures,
  hasInternet,
  fetchFixturesForPloorlan,
}) => {
  const [progress, setProgress] = useState(1);
  const [fileCountProcess, setFileCountProcess] = useState(0);
  const [progressOutput, setProgressOutput] = useState('');
  const [currentFileDownload, setCurrentFileDownload] = useState(0);
  const [allDownload, setAllDownload] = useState(false);

  const downloadStart = useCallback(
    ({ manager, floorplan }) => {
      setFileCountProcess(fileCountProcess + 1);
      setAllDownload(false);
    },
    [fileCountProcess],
  );

  const downloadComplete = useCallback(({ manager, floorplan, message, statusCode, location }) => {
    if (manager.queue.length == 0) {
      setProgressOutput('All done, loading floorplan...');
      setAllDownload(true);
    }
  }, []);

  const downloading = useCallback(
    ({ manager, floorplan, percentage, contentLength, bytesWritten }) => {
      setProgress(percentage);
      setProgressOutput(`${bytesWritten} MB/ ${contentLength} MB`);
    },
    [],
  );

  useEffect(() => {
    downloadManager.options = {
      onStart: downloadStart,
      onProgress: downloading,
      onComplete: downloadComplete,
    };
  }, [downloadStart, downloadComplete, downloading]);

  const debounceFetchFloorplanData = useCallback(
    debounce(() => {
      if (!floorplanList.length) {
        setAllDownload(true);
        return;
      }
      floorplanList.forEach(async (floorlan) => {
        const results = await fetchFixturesForPloorlan({ floorplanKey: floorlan.id });
        if (results.type == fetchFixturesForPloorlanAction.fulfilled.toString()) {
          const fixtures = results?.payload?.entities?.fixtures || {};
          offlineDataManager.storeFixturesForPloorplan(floorlan.id, Object.values(fixtures));
        }
      });

      downloadManager.floorplans = floorplanList;
      downloadManager.startDownload();
    }, 500),
    [floorplanList, fetchFixturesForPloorlan],
  );

  useEffect(() => {
    if (hasInternet) {
      debounceFetchFloorplanData();
    } else {
      setAllDownload(true);
    }
  }, [hasInternet, debounceFetchFloorplanData]);

  const renderDownload = useMemo(
    () =>
      allDownload ? (
        <FloorplanList navigation={navigation} floorplanList={floorplanList} />
      ) : (
        <View>
          <SummaText large customText={{ marginVertical: '5%' }}>
            {fileCountProcess}/{floorplanList.length}
          </SummaText>
          {progress ? (
            <LoadingProgress progress={progress} isFloat={false} marginBottom={10} />
          ) : null}
          <SummaText large>{progressOutput}</SummaText>
        </View>
      ),
    [floorplanList, currentFileDownload, progress, progressOutput, fileCountProcess, allDownload],
  );

  const handleLogOut = useCallback(() => {
    // Store unsaved fixtures to file before we logout and cleanup
    saveFileManager.saveFixtures(unsavedFixtures);
    logoutAction();
  }, [logoutAction, unsavedFixtures]);

  return (
    <>
      <SummaScreen>
        <SummaHeader
          iconLeftButton={
            <>
              <CaretLeft size={30} color={COLORS.primary} />
              <SummaText medium={true} color={COLORS.primary}>
                Projects
              </SummaText>
            </>
          }
          headerLabel={'Floorplans'}
          handleLeftButton={handleLogOut}
        />
        {renderDownload}
        {!allDownload && (
          <View style={styles.Center}>
            <ActivityIndicator size="large" color="#fff" animating={!allDownload} />
          </View>
        )}
      </SummaScreen>
    </>
  );
};

export default Floorplans;
