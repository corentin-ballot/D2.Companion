import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
        h1: {
          marginBottom: 24
        },
        h2: {
          marginBottom: 20
        },
        h3: {
          marginBottom: 16
        },
        h4: {
          marginBottom: 14
        },
        h5: {
          marginBottom: 12
        },
        h6: {
          marginBottom: 10
        },
      },
    }
  },
  breakpoints: {
    keys: [
      "xs",
      "sm",
      "md",
      "lg",
      "xl"
    ],
    values: {
      "xs": 0,
      "sm": 600,
      "md": 900,
      "lg": 1200,
      "xl": 1536
    },
    unit: "px"
  },
  direction: "ltr",
  palette: {
    mode: "light",
    primary: {
      50: "#F0F7FF",
      100: "#C2E0FF",
      200: "#99CCF3",
      300: "#66B2FF",
      400: "#3399FF",
      500: "#007FFF",
      600: "#0072E5",
      700: "#0059B2",
      800: "#004C99",
      900: "#003A75",
      main: "#007FFF",
      light: "#66B2FF",
      dark: "#0059B2",
      contrastText: "#fff"
    },
    divider: "#E7EBF0",
    common: {
      black: "#1D1D1D",
      white: "#fff"
    },
    text: {
      primary: "#1A2027",
      secondary: "#3E5060",
      disabled: "rgba(0, 0, 0, 0.38)"
    },
    grey: {
      50: "#F3F6F9",
      100: "#E7EBF0",
      200: "#E0E3E7",
      300: "#CDD2D7",
      400: "#B2BAC2",
      500: "#A0AAB4",
      600: "#6F7E8C",
      700: "#3E5060",
      800: "#2D3843",
      900: "#1A2027",
      A100: "#f5f5f5",
      A200: "#eeeeee",
      A400: "#bdbdbd",
      A700: "#616161"
    },
    error: {
      50: "#FFF0F1",
      100: "#FFDBDE",
      200: "#FFBDC2",
      300: "#FF99A2",
      400: "#FF7A86",
      500: "#FF505F",
      600: "#EB0014",
      700: "#C70011",
      800: "#94000D",
      900: "#570007",
      main: "#EB0014",
      light: "#FF99A2",
      dark: "#C70011",
      contrastText: "#fff"
    },
    success: {
      50: "#E9FBF0",
      100: "#C6F6D9",
      200: "#9AEFBC",
      300: "#6AE79C",
      400: "#3EE07F",
      500: "#21CC66",
      600: "#1DB45A",
      700: "#1AA251",
      800: "#178D46",
      900: "#0F5C2E",
      main: "#1AA251",
      light: "#6AE79C",
      dark: "#1AA251",
      contrastText: "#fff"
    },
    warning: {
      50: "#FFF9EB",
      100: "#FFF3C1",
      200: "#FFECA1",
      300: "#FFDC48",
      400: "#F4C000",
      500: "#DEA500",
      600: "#D18E00",
      700: "#AB6800",
      800: "#8C5800",
      900: "#5A3600",
      main: "#DEA500",
      light: "#FFDC48",
      dark: "#AB6800",
      contrastText: "rgba(0, 0, 0, 0.87)"
    },
    secondary: {
      main: "#9c27b0",
      light: "#ba68c8",
      dark: "#7b1fa2",
      contrastText: "#fff"
    },
    info: {
      main: "#0288d1",
      light: "#03a9f4",
      dark: "#01579b",
      contrastText: "#fff"
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
    background: {
      paper: "#fff",
      default: "#fff"
    },
    action: {
      active: "rgba(0, 0, 0, 0.54)",
      hover: "rgba(0, 0, 0, 0.04)",
      hoverOpacity: 0.04,
      selected: "rgba(0, 0, 0, 0.08)",
      selectedOpacity: 0.08,
      disabled: "rgba(0, 0, 0, 0.26)",
      disabledBackground: "rgba(0, 0, 0, 0.12)",
      disabledOpacity: 0.38,
      focus: "rgba(0, 0, 0, 0.12)",
      focusOpacity: 0.12,
      activatedOpacity: 0.12
    }
  },
  typography: {
    fontFamily: "Work Sans,sans-serif",
    h1: {
      fontFamily: "Montserrat,Arial,Verdana,Lucida Grande,sans-serif",
      fontSize: "2.5rem",
      fontWeight: 900,
      lineHeight: 1.1142857142857143,
      color: "#0A1929",
    },
    h2: {
      fontFamily: "Montserrat,Arial,Verdana,Lucida Grande,sans-serif",
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.2222222222222223,
      color: "#132F4C",
    },
    h3: {
      fontFamily: "Montserrat,Arial,Verdana,Lucida Grande,sans-serif",
      fontSize: "1.75rem",
      lineHeight: 1.2222222222222223,
      letterSpacing: 0.2,
      fontWeight: 400,
    },
    h4: {
      fontFamily: "Montserrat,Arial,Verdana,Lucida Grande,sans-serif",
      fontSize: "1.5rem",
      lineHeight: 1.5,
      letterSpacing: 0.2,
      fontWeight: 400,
    },
    h5: {
      fontFamily: "Montserrat,Arial,Verdana,Lucida Grande,sans-serif",
      fontSize: "1.3rem",
      lineHeight: 1.5,
      letterSpacing: 0.1,
      color: "#007FFF",
      fontWeight: 400,
    },
    h6: {
      fontSize: "1.1rem",
      lineHeight: 1.5,
      fontFamily: "Montserrat,Arial,Verdana,Lucida Grande,sans-serif",
      fontWeight: 500,
    },
    button: {
      textTransform: "initial",
      fontWeight: 700,
      fontFamily: "Work Sans,sans-serif",
      fontSize: "0.875rem",
      lineHeight: 1.75,
    },
    subtitle1: {
      fontSize: "1.125rem",
      lineHeight: 1.3333333333333333,
      fontWeight: 500,
      fontFamily: "Work Sans,sans-serif",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
      fontFamily: "Work Sans,sans-serif",
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      fontFamily: "Work Sans,sans-serif",
      fontWeight: 400,
    },
    caption: {
      display: "inline-block",
      fontSize: "0.75rem",
      lineHeight: 1.5,
      fontWeight: 700,
      fontFamily: "Work Sans,sans-serif",
    },
    allVariants: {
    },
    htmlFontSize: 16,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    subtitle2: {
      fontFamily: "Work Sans,sans-serif",
      fontWeight: 500,
      fontSize: "0.875rem",
      lineHeight: 1.57,
    },
    overline: {
      fontFamily: "Work Sans,sans-serif",
      fontWeight: 400,
      fontSize: "0.75rem",
      lineHeight: 2.66,
      textTransform: "uppercase",
    },
  },
});

export default theme;