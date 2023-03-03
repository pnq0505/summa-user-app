import { debounce } from 'lodash';
import { CaretLeft } from 'phosphor-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import SummaButton from '../../components/SummaButton';
import SummaHeader from '../../components/SummaHeader';
import SummaModalConfirm from '../../components/SummaModalConfirm';
import SummaScreen from '../../components/SummaScreen';
import SummaText from '../../components/SummaText';
import { updateProject as updateProjectAction } from '../../store/features/project/action';
import { COLORS } from '../../theme';
import saveFileManager from '../../utils/SaveFileManager';
import Field from './Field';

const styles = StyleSheet.create({
  Row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: COLORS.medium,
    borderBottomWidth: 0.3,
  },
  sectionSeparator: {
    height: 60,
  },
});

const ProjectInformation = ({
  navigation,
  projectInformation,
  updateProject,
  hasInternet,
  logoutAction,
  removeProject,
  unsaveProject,
  selectedProjectId,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleUpdateProject = useCallback(
    async (project) => {
      const response = await updateProject(project);
      if (response.type === updateProjectAction.fulfilled.toString()) {
        saveFileManager.removeProject(project);
      } else {
        saveFileManager.addProject(project);
      }
    },
    [updateProject],
  );

  const debounceUpdateProject = useCallback(
    debounce((project) => {
      handleUpdateProject(project);
    }, 500),
    [handleUpdateProject],
  );

  useEffect(() => {
    if (Object.keys(unsaveProject).length === 0) {
      return;
    }
    if (hasInternet) {
      debounceUpdateProject(unsaveProject);
    } else {
      saveFileManager.addProject(unsaveProject);
    }
  }, [hasInternet, debounceUpdateProject, unsaveProject]);

  const handleLogOut = useCallback(() => {
    logoutAction();
  }, [logoutAction]);

  const handleRemoveProject = useCallback(() => {
    setModalVisible(false);
    removeProject(selectedProjectId);
    logoutAction();
  }, [logoutAction, removeProject, selectedProjectId]);

  return (
    <SummaScreen>
      <SummaHeader
        headerLabel={'Project'}
        iconLeftButton={
          <>
            <CaretLeft size={30} color={COLORS.primary} />
            <SummaText medium={true} color={COLORS.primary}>
              Projects
            </SummaText>
          </>
        }
        handleLeftButton={handleLogOut}
      />
      <SectionList
        sections={projectInformation}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({ section: { title } }) => (
          <View>
            <SummaText extraLarge={true} textAlign={'left'}>
              {title}
            </SummaText>
          </View>
        )}
        renderItem={({ item }) => <Field field={item} navigation={navigation} />}
        stickySectionHeadersEnabled={true}
        SectionSeparatorComponent={({ leadingItem }) => {
          return leadingItem && <View style={styles.sectionSeparator} />;
        }}
      />
      <SummaButton
        customStyle={{ backgroundColor: COLORS.danger }}
        onPressHanlder={() => setModalVisible(true)}>
        Remove project
      </SummaButton>
      {isModalVisible ? (
        <SummaModalConfirm
          message={'Are you sure you want to remove this project?'}
          isVisible={isModalVisible}
          setVisible={setModalVisible}
          handleCancel={() => setModalVisible(false)}
          handleConfirm={handleRemoveProject}
        />
      ) : null}
    </SummaScreen>
  );
};

export default ProjectInformation;
