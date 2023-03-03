var RNFS = require('react-native-fs');
import { root } from './SummaFloorplanDownloadManager';

// The save file has the unsaved data and project information.
class OfflineDataManager {
  constructor(autoload = false) {
    this.fixtures = {};
    this.floorplanIds = new Set();
    this.indexPath = `${root}/index.txt`;
    this.autoload = autoload;
    this.onLoaded = null;
    this.onLoadedFixturesForFloorplan = null;
  }

  storeFixturesForPloorplan(floorplanId, fixtures, autosave = true) {
    this.floorplanIds.add(floorplanId);
    this.fixtures[floorplanId] = [...fixtures];

    if (autosave) {
      this.saveFloorplanIndexToDisk();
      this.saveFixturesOfFloorplanToDisk(floorplanId);
    }
  }

  saveFloorplanIndexToDisk() {
    const writeJSONFile = async (filePath, data) => {
      await RNFS.writeFile(filePath, data, 'utf8')
        .then(async () => {})
        .catch((err) => {
          console.log(err.message);
        });
    };
    writeJSONFile(this.indexPath, JSON.stringify([...this.floorplanIds]));
  }

  saveFixturesOfFloorplanToDisk(floorplanId) {
    const filePath = `${root}/${floorplanId}.txt`;
    const data = this.fixtures[floorplanId] || {};

    const writeJSONFile = async (filePath, data) => {
      await RNFS.writeFile(filePath, data, 'utf8')
        .then(async () => {})
        .catch((err) => {
          console.log(err.message);
        });
    };

    writeJSONFile(filePath, JSON.stringify(data));
  }

  saveToDisk() {
    this.saveFloorplanIndexToDisk();
    this.floorplanIds.forEach((fid) => {
      this.saveFixturesOfFloorplanToDisk(fid);
    });
  }

  loadFixtureForPloorplanFromJson(floorplanId, jsonData) {
    const data = JSON.parse(jsonData);
    this.fixtures[floorplanId] = data;
  }

  loadFixtureForPloorplanFromDisk(floorplanId) {
    const fileLocation = `file://${root}/${floorplanId}.txt`;

    const readFile = async (fileLoc, floorplanId) => {
      if (await RNFS.exists(fileLoc)) {
        RNFS.readFile(fileLoc, 'utf8')
          .then((content) => {
            this.loadFixtureForPloorplanFromJson(floorplanId, content);
            if (this.onLoadedFixturesForFloorplan) {
              this.onLoadedFixturesForFloorplan(floorplanId, this.fixtures[floorplanId]);
            }
          })
          .catch((err) => {
            console.log(floorplanId, err);
          });
      } else {
        this.loadFixtureForPloorplanFromJson(floorplanId, '[]');
        if (this.onLoadedFixturesForFloorplan) {
          this.onLoadedFixturesForFloorplan(floorplanId, []);
        }
      }
    };

    readFile(fileLocation, floorplanId);
  }

  loadFromDisk() {
    const saveFileLocation = `file://${this.indexPath}`;

    const readFile = async (saveLocation) => {
      if (await RNFS.exists(saveLocation)) {
        RNFS.readFile(saveLocation, 'utf8')
          .then((content) => {
            this.floorplanIds = new Set(JSON.parse(content || '[]'));

            this.floorplanIds.forEach((id) => {
              this.loadFixtureForPloorplanFromDisk(id);
            });
            if (this.onLoaded) {
              this.onLoaded(this.fixtures, this.floorplanIds);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        if (this.onLoaded) {
          this.onLoaded(this.fixtures, this.floorplanIds);
        }
      }
    };

    readFile(saveFileLocation);
  }
}

const offlineDataManager = new OfflineDataManager(true);

export default offlineDataManager;

const offlineData = {
  fixtures: {
    floorplanId: [
      {
        id: 'id1',
        pos: {
          x: 0,
          y: 0,
        },
        deviceKeys: ['k1', 'k2'],
        updatedAt: '',
      },
      {
        id: 'id2',
        pos: {
          x: 0,
          y: 0,
        },
        deviceKeys: ['k3', 'k4'],
        updatedAt: '',
      },
    ],
  },
  floorplanIds: new Set(),
};
