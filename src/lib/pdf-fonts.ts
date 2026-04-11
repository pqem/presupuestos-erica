import { Font } from "@react-pdf/renderer";

// Montserrat Bold for titles only (weight 700).
// Montserrat Black (900) was removed because its complex kerning tables
// caused overlapping glyphs in @react-pdf/renderer.
Font.register({
  family: "Montserrat",
  fonts: [
    { src: "/fonts/Montserrat-Bold.ttf", fontWeight: 700 },
  ],
});

// Open Sans for body text (replaced PT Sans because its GSUB ligature
// tables "fi"/"fl"/"ffi" caused @react-pdf/renderer to drop the "i"
// in words like "definitivo", "superficies", "finalizar").
// See: diegomura/react-pdf#1649, #2112.
Font.register({
  family: "OpenSans",
  fonts: [
    { src: "/fonts/OpenSans-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/OpenSans-Bold.ttf", fontWeight: 700 },
  ],
});
