import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';
import { projectSchema } from '../../normalizr/schema';
import { getProjectEntities } from '../entity/selector';

const getProject = (state) => state.project || {};
export const getSelectedProjectId = (state) => getProject(state).selectedProjectId;
export const getSelectedProjectKey = (state) => getProject(state).selectedProjectKey;
export const getProjectIds = (state) => getProject(state).projectIds;
export const getProjectKey = (state) => getProject(state).editingProjectData.key;
export const getEditingProjectData = (state) => getProject(state).editingProjectData;
export const getUnSaveProjectInfo = (state) => getProject(state).unsaveProjectInfo;

export const getCurrentProject = createSelector(
  [getProjectEntities, getSelectedProjectId],
  (projects, projectId) => {
    return denormalize(projectId, projectSchema, {
      projects,
    });
  },
);

export const getProjects = createSelector(
  [getProjectEntities, getProjectIds],
  (projects, projectIds) => {
    return denormalize(projectIds, [projectSchema], {
      projects,
    });
  },
);

export const getProjectInformation = createSelector(
  [getCurrentProject, getUnSaveProjectInfo],
  (project, unsafeInfo) => {
    const newProject = { ...project, ...unsafeInfo };
    const result = [
      {
        title: 'Generals',
        data: [
          {
            title: 'Name',
            key: 'name',
            value: newProject.name,
            options: { editable: false },
          },
          { title: 'Key', key: 'key', value: newProject.key, options: { editable: false } },
          {
            title: 'Api key',
            key: 'apiKey',
            value: newProject.apiKey,
            options: { editable: false },
          },
        ],
      },
      {
        title: 'Settings',
        data: [
          {
            title: 'SSID',
            key: 'settings.wifiSsid',
            value: newProject.settings.wifiSsid,
            options: { editable: false },
          },
          {
            title: 'Time zone',
            key: 'timezone',
            value: newProject.timezone,
            options: { dropdown: true, editable: false },
          },
          {
            title: 'Gateway',
            key: 'gatewayKey',
            value: newProject.gatewayKey,
            options: { editable: true, scan: true },
          },
        ],
      },
    ];
    return result;
  },
);
