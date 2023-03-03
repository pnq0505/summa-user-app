// DRIVER TYPE VALIDATE
export const DRIVER_TYPE_REGEX = new RegExp(/^[PTCDSRptcdsr]{1}[0-9]{4}S[a-zA-Z0-9]{6,24}$/);

export const SECRET_KEY = 'sDFS^a4vojNW4w5XN4j!ck!h$GP6Tgj$'; // secret key to decrypt the QR code

export const DEVICE_TYPE = [
  { label: 'Fusion', value: 'FC01' },
  { label: 'Channel 1', value: 'ch1' },
  { label: 'Channel 2', value: 'ch2' },
  { label: 'Channel 3', value: 'ch3' },
];

export const CHANNEL_LIST = [
  { label: 'Channel 1', value: '1' },
  { label: 'Channel 2', value: '2' },
  { label: 'Channel 3', value: '3' },
];

export const toBeConfigured = 'to-be-configured';
export const inReview = 'in-review';
export const approved = 'approved';
export const toBeReScanned = 'to-be-rescanned';

export const FLOORPLAN_QUANTITY_STATUS = {
  'to-be-configured': 'Un Scanned',
  'in-review': 'In Review',
  approved: 'Approved',
  'to-be-rescanned': 'Rejected',
};

export const FLOORPLAN_QUANTITY_STATUS_COLOR = {
  toBeConfigured: '#808080',
  inReview: '#f1c40f',
  approved: '#2ecc71',
  toBeReScanned: '#e74c3c',
};

export const FIXTURE_STATUS_LIST = [
  { label: FLOORPLAN_QUANTITY_STATUS[toBeConfigured], value: toBeConfigured },
  { label: FLOORPLAN_QUANTITY_STATUS[inReview], value: inReview },
  { label: FLOORPLAN_QUANTITY_STATUS[approved], value: approved },
  { label: FLOORPLAN_QUANTITY_STATUS[toBeReScanned], value: toBeReScanned },
];

export const FIXTURE_STATUS_LIST_INIT = [toBeConfigured, inReview, approved, toBeReScanned];

export const MODAL_IDS = {
  UNKNOWN: 0,
  FIXTURE_INFO: 1,
  SCAN_DEVICE: 2,
  DELETE_DEVICE: 3,
  DEVICE_TYPE: 4,
  FILTER_FIXTURE: 10,
};
