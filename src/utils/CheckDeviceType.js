export const checkDeviceType = (serial) => {
  if (typeof serial === 'string') {
    const fullType = serial.split(':')[1] || false;
    if (fullType) {
      const type = fullType.slice(0, 2);
      switch (type.toLowerCase()) {
        case 'fc':
          return 'Fusion';
        case 'ch':
          const channelNumber = fullType.slice(2, 4);
          return 'CH' + channelNumber;
        default:
          return 'N/A';
      }
    } else return 'N/A';
  } else {
    console.log('Error occur when check type');
  }
};
