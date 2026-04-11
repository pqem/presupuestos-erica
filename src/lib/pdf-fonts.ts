import { Font } from "@react-pdf/renderer";

// Register fonts once (TTF format to avoid OpenType ligature issues with WOFF)
Font.register({
  family: "Montserrat",
  fonts: [
    { src: "/fonts/Montserrat-Bold.ttf", fontWeight: 700 },
    { src: "/fonts/Montserrat-Black.ttf", fontWeight: 900 },
  ],
});

Font.register({
  family: "PTSans",
  fonts: [
    { src: "/fonts/PTSans-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/PTSans-Bold.ttf", fontWeight: 700 },
  ],
});

// Disable hyphenation/ligature substitution to fix "fi" ligature bug
// where @react-pdf/renderer drops the "i" in words like "definitivo",
// "superficies", "finalizar". See: diegomura/react-pdf#1649, #2112.
Font.registerHyphenationCallback((word) => [word]);
