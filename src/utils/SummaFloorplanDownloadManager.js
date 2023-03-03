import { Platform } from 'react-native';
import { convertByteToMb } from './ConvertHelper';
var RNFS = require('react-native-fs');

export const root = `${RNFS.DocumentDirectoryPath}`;

const needDownloadFloorplan = async (floorplan) => {
  const dxfFile = `file://${root}/${floorplan.id}.json`;
  const dxfExisted = await checkFileExist(dxfFile);
  return !dxfExisted;
};

export const fixtureFilePath = (floorplan) => {
  return `${root}/${floorplan.id}.txt`;
};

export const dxfFilePath = (floorplan) => {
  return `${root}/${floorplan.id}.json`;
};

export const fixtureFileLocation = (floorplan) => {
  return `file://${root}/${floorplan.id}.txt`;
};

export const dxfFileLocation = (floorplan) => {
  return `file://${root}/${floorplan.id}.json`;
};
export class SummaFloorplanDownloadManager {
  constructor(floorplans = [], options = {}) {
    this.queue = [...floorplans];
    this.floorplans = floorplans;
    this.jobId = -1;
    this.currentDownloadFloorplan = null;
    this.options = options;
    this.enableDownload = true;
    this.totalFiles = floorplans.length;
  }

  set floorplans(floorplans) {
    this.queue = [...this.queue, ...floorplans];
    this.totalFiles += floorplans.length;
  }

  startDownload(force = false) {
    if (this.jobId != -1) {
      return;
    }
    console.log(this.jobId);
    this.next();
  }

  next() {
    const floorplan = this.queue.shift();
    if (floorplan) {
      this.downloadFloorplan(floorplan);
    }
  }

  async downloadFloorplan(floorplan, force = false) {
    const needDownload = await needDownloadFloorplan(floorplan);
    const dxfDownloadDes = `${root}/${floorplan.id}.json`;
    this.currentDownloadFloorplan = floorplan;
    if (needDownload || force) {
      await downloadFile(
        false,
        floorplan.fileLocation,
        dxfDownloadDes,
        this.onStart,
        this.onProgress,
        this.onError,
        this.onComplete,
      );
    } else {
      this.onComplete({
        message: 'Downloaded',
        statusCode: 200,
        jobId: null,
        location: dxfDownloadDes,
      }),
        this.next();
    }
  }

  onStart = (data) => {
    this.jobId = data.jobId;
    console.log('onStart');
    if (this.options.onStart) {
      this.options.onStart({ manager: this, floorplan: this.currentDownloadFloorplan });
    }
  };

  onProgress = (percentage, contentLength, bytesWritten) => {
    if (this.options.onProgress) {
      this.options.onProgress({
        manager: this,
        floorplan: this.currentDownloadFloorplan,
        percentage,
        contentLength,
        bytesWritten,
      });
    }
  };

  onError = ({ message, statusCode, jobId }) => {
    console.log('onError');
    if (this.options.onError) {
      this.options.onError({
        manager: this,
        floorplan: this.currentDownloadFloorplan,
        message,
        statusCode,
      });
    }
    if (this.jobId == jobId) {
      this.jobId = -1;
    } else {
      // Huh?? Something went wrong
    }

    this.next();
  };

  onComplete = ({ message, statusCode, jobId, location }) => {
    if (this.options.onComplete) {
      this.options.onComplete({
        manager: this,
        floorplan: this.currentDownloadFloorplan,
        message,
        statusCode,
        location,
      });
    }

    if (this.jobId == jobId) {
      this.jobId = -1;
    } else {
      // Huh?? Something went wrong
    }

    this.next();
  };
}

// background : Continue the download in the background after the app terminates (iOS only)
const downloadFile = async (
  background = false,
  url,
  dxfDownloadDes,
  onStart,
  onProgress,
  onError,
  onComplete,
) => {
  const progress = (data) => {
    const { contentLength, bytesWritten } = data;
    const percentage = ((100 * bytesWritten) / contentLength) | 0;
    onProgress(percentage, convertByteToMb(contentLength), convertByteToMb(bytesWritten));
  };

  const progressDivider = 1;

  // HANDLE DOWNLOAD FILE
  const ret = RNFS.downloadFile({
    fromUrl: Platform.OS === 'ios' ? encodeURI(url) : url, // IOS issue,
    toFile: dxfDownloadDes,
    begin: onStart,
    progress,
    background,
    progressDivider,
  });

  ret.promise
    .then(async (res) => {
      if (res.statusCode === 404) {
        if (onError) {
          onError({
            message: '404 file not found',
            statusCode: res.statusCode,
            jobId: res.jobId,
          });
        }
      } else {
        onComplete({
          message: 'Success',
          statusCode: res.statusCode,
          jobId: res.jobId,
          location: dxfDownloadDes,
        });
      }
    })
    .catch((err) => {
      onError({
        message: err.message,
        statusCode: res.statusCode,
        jobId: res.jobId,
      });
    });
};

export const checkFileExist = async (filepath) => {
  return await RNFS.exists(filepath);
};

// WRITE CONFIGURE FILE
export const writeJSONFile = async (filePath, data) => {
  return await RNFS.writeFile(filePath, JSON.stringify(data), 'utf8')
    .then(async () => {})
    .catch((err) => {
      console.log(err.message);
    });
};

// READ FILE
export const readConfigureFile = async (filePath, setData) => {
  if (await checkFileExist(filePath)) {
    RNFS.readFile(filePath, 'utf8')
      .then((content) => {
        setData(JSON.parse(content));
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

// READ FILE
export const readConfigureFileRedux = async (filePath) => {
  if (await checkFileExist(filePath)) {
    return RNFS.readFile(filePath, 'utf8')
      .then((content) => {
        return JSON.parse(content);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return;
};
