export const COLORS = {
  primary: '#5048e5',
  secondary: '#0f172a',
  tertiary: '#ffffff',
  success: '#2dd36f',
  warning: '#ffc409',
  danger: '#eb445a',
  dark: '#222428',
  medium: '#92949c',
  light: '#f4f5f8',
  lavender: '#c8d3fe',
  darkBlue: '#7978B5',
  secondaryTint: '#0B1126',
  fontBackground: '#334155',
  btnDisabled: '#5048E580',
  fontDisaled: '#6F7E97',
  summaOrange: '#f0ad4e',
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
  doubleExtra: 32,
};

export const FONTS = {
  extraBold: '700',
  bold: '600',
  semiBold: '500',
  medium: '400',
  regular: '300',
  light: 'InterLight',
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.gray,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  medium: {
    shadowColor: COLORS.gray,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  dark: {
    shadowColor: COLORS.gray,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,

    elevation: 14,
  },
};
