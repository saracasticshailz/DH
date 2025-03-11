import { ThemeOptions } from '@mui/material';
import { COLORS, PALETTE_COLORS } from './colors';

/**
 * MUI theme options for "Dark Mode"
 */
export const DARK_THEME: ThemeOptions = {
  palette: {
    mode: 'dark',
    ...PALETTE_COLORS,
    background: {
      paper: COLORS.WHITE_SECONDARY, // Gray 800 - Background of "Paper" based component
      default: '#121212',
    },
    text: {
      primary: COLORS.BLACK,
      secondary: COLORS.TEXT_COLOR,
    },
  },
};

export default DARK_THEME;
