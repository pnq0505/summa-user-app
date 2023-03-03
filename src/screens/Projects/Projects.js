import { Buildings, QrCode } from 'phosphor-react-native';
import React, { useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import SummaHeader from '../../components/SummaHeader';
import SummaScreen from '../../components/SummaScreen';
import SummaText from '../../components/SummaText';

const styles = StyleSheet.create({
  Row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  Center: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const ProjectList = ({ projects, handleClickProject }) => {
  return projects.map((project) => (
    <TouchableOpacity
      key={project.id}
      style={styles.Row}
      accessibilityLabel={`project-${project.id}`}
      onPress={() => handleClickProject(project)}>
      <View style={{ paddingRight: 10 }}>
        <Buildings size={70} color={'#fff'} />
      </View>
      <View>
        <SummaText textAlign={'left'} large={true}>
          {project.name}
        </SummaText>
        <SummaText normal={true} textAlign={'left'}>
          {project.gatewayKey}
        </SummaText>
        <SummaText normal={true} textAlign={'left'}>
          {project.timezone}
        </SummaText>
      </View>
    </TouchableOpacity>
  ));
};

const Projects = ({
  navigation,
  projects,
  setApiKey,
  setProjectKey,
  setSelectedProject,
  setEnvironment,
  fetchFloorplans,
  fetchProject,
}) => {
  useEffect(() => {
    if (!projects.length) {
      navigation.navigate('ProjectScanner');
    }
  }, [projects, navigation]);

  const handleScanQrcode = useCallback(() => {
    navigation.navigate('ProjectScanner');
  }, [navigation]);

  const handleClickProject = useCallback(
    async (project) => {
      await setApiKey(project.installerApiKey);
      await setEnvironment(project.environment);
      await setProjectKey(project.key);
      setSelectedProject(project);
      fetchProject(project.key);
      fetchFloorplans(project.key);
      navigation.navigate('BottomTab');
    },
    [navigation, setApiKey, setProjectKey, fetchFloorplans, fetchProject],
  );

  return (
    <SummaScreen>
      <SummaHeader
        headerLabel={'Projects'}
        iconRightButton={<QrCode size={30} color={'#fff'} />}
        handleRightButton={handleScanQrcode}
      />
      {projects.length ? (
        <ScrollView>
          <ProjectList projects={projects} handleClickProject={handleClickProject} />
        </ScrollView>
      ) : (
        <TouchableOpacity
          style={styles.Center}
          onPress={handleScanQrcode}
          accessibilityLabel={'scan-project'}>
          <SummaText>No projects have been scanned yet.</SummaText>
          <QrCode size={200} color={'#fff'} />
        </TouchableOpacity>
      )}
    </SummaScreen>
  );
};

export default Projects;
