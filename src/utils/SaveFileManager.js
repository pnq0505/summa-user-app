var RNFS = require('react-native-fs');
import { root } from './SummaFloorplanDownloadManager';

// The save file has the unsaved data and project information.
class SaveFileManager {
  constructor(autoload = false) {
    this.fixtures = {};
    this.project = {};
    this.filePath = '';
    this.autoload = autoload;
    this.onLoaded = null;
  }

  set projectKey(value) {
    this.filePath = `${root}/${value}.txt`;

    if (this.autoload) {
      this.loadFromDisk();
    }
  }

  loadFromJson(jsonData) {
    const data = JSON.parse(jsonData);
    this.fixtures = data?.fixtures || {};
    this.project = data?.project || {};
  }

  async loadFromDisk() {
    if (!this.filePath) {
      return false;
    }

    const saveFileLocation = `file://${this.filePath}`;

    const readFile = async (saveLocation) => {
      if (await RNFS.exists(saveLocation)) {
        await RNFS.readFile(saveLocation, 'utf8')
          .then((content) => {
            this.loadFromJson(content);
            console.log('READ FILE SUCCESS');
            if (this.onLoaded) {
              this.onLoaded(Object.values(this.fixtures), this.project);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.loadFromJson('{}');
        if (this.onLoaded) {
          this.onLoaded(Object.values(this.fixtures), this.project);
        }
      }
    };
    await readFile(saveFileLocation);
  }

  addFixtures(fixtures, autosave = true) {
    fixtures.forEach((fixture) => {
      const { id, devices = null, location = null } = fixture;
      const sFixture = this.fixtures[id] || {};
      this.fixtures[id] = { ...sFixture, id, devices, location };
    });

    if (autosave) {
      this.saveToDisk();
    }
  }

  saveFixtures(fixtures, autosave = true) {
    this.fixtures = {};
    fixtures.forEach((fixture) => {
      const { id, devices = null, location = null } = fixture;
      const sFixture = this.fixtures[id] || {};
      const temp = { id, devices, location };
      Object.keys(temp).forEach((k) => temp[k] == null && delete temp[k]);
      this.fixtures[id] = { ...sFixture, ...temp };
    });

    if (autosave) {
      this.saveToDisk();
    }
  }

  clearFixtures(autosave = true) {
    this.fixtures = {};

    if (autosave) {
      this.saveToDisk();
    }
  }

  exportToJson() {
    return JSON.stringify({
      fixtures: this.fixtures,
      project: this.project,
    });
  }

  saveToDisk() {
    if (!this.filePath) {
      return false;
    }

    const jsonData = this.exportToJson();

    const writeJSONFile = async (filePath, data) => {
      await RNFS.writeFile(filePath, data, 'utf8')
        .then(async () => {
          console.log('Done json configure unsave data');
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    writeJSONFile(this.filePath, jsonData);
  }

  addProject(project, autosave = true) {
    this.project = { ...this.project, ...project };

    if (autosave) {
      this.saveToDisk();
    }
  }

  removeProject(project, autosave = true) {
    if (!project) return;
    this.project = {};

    if (autosave) {
      this.saveToDisk();
    }
  }
}
const saveFileManager = new SaveFileManager(true);

export default saveFileManager;

const savedFile = {
  fixtures: {
    id1: {
      id: 'id1',
      pos: {
        x: 0,
        y: 0,
      },
      deviceKeys: ['k1', 'k2'],
      updatedAt: '',
    },
    id2: {
      id: 'id2',
      pos: {
        x: 0,
        y: 0,
      },
      deviceKeys: ['k3', 'k4'],
      updatedAt: '',
    },
  },
  project: {
    apiKey: 'apiKey',
    id: 'projectId',
    key: 'projectKey',
    name: 'projectName',
    settings: {
      hasLocal: true,
      wifiPassword: 'password',
      wifiSsid: 'ssid',
    },
    timezone: 'timezone',
    gatewayKey: 'gatewayKey',
  },
};
