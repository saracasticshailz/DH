import { PaletteOptions, SimplePaletteColorOptions } from '@mui/material';

export const COLORS = {
  RED_PRIMARY: '#EC0100',
  WHITE_SECONDARY: '#ffffff',
  GRAY_BORDER: '#BEC1C4',
  GREEN_SUCCESS: '#438A3B',
  LIGHT_GREEN_SUCCESS: '#E7F6E5',
  BROWN_PROGRESS: '#AD5812',
  LIGHT_BROWN_PROGRESS: '#FEECDD',
  ERROR: '#EC0100',
  BLACK: '#000000',
  TEXT_COLOR: '#5D656B',
  OFF_WHITE_BG: '#F5F5F5',
  NOTICE_RED: '#FFF7F0',
};

const COLOR_PRIMARY: SimplePaletteColorOptions = {
  main: '#EC0100',
  contrastText: COLORS.TEXT_COLOR,
};

const COLOR_SECONDARY: SimplePaletteColorOptions = {
  main: '#ffffff',
  contrastText: COLORS.TEXT_COLOR,
};

const COLOR_SUCCESS: SimplePaletteColorOptions = {
  main: COLORS.GREEN_SUCCESS,
};

const COLOR_ERROR: SimplePaletteColorOptions = {
  main: COLORS.ERROR,
};

/**
 * MUI colors set to use in theme.palette
 */
export const PALETTE_COLORS: Partial<PaletteOptions> = {
  primary: COLOR_PRIMARY,
  // secondary: COLOR_SECONDARY,
  borderGray: '#BEC1C4',
  error: COLOR_ERROR,
  // warning: COLOR_WARNING;
  // info: COLOR_INFO;
  success: COLOR_SUCCESS,
};
