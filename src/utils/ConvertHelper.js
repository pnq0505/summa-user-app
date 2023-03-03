export const convertByteToMb = (bytes) => {
  return (bytes / 1048576).toFixed(2);
};

export const hexToRgb = (hex) => {
  return hex
    .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1)
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16));
};

export const getFillColor = (color) => {
  let rgbColor = hexToRgb(color);
  let reversed = rgbColor.reverse();
  let hex = 0xff000000 | (reversed[0] << 16) | (reversed[1] << 8) | reversed[2];

  return parseInt(`0x${(hex >>> 0).toString(16)}`);
};
