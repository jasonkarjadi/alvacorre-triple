import { Rel } from "../types";

const relations: Rel[] = [
  {
    A: "Netherlands",
    B: "Indonesia",
    FROM: "A",
    LISTABLES: ["IndonesianVocabularyFromDutch"],
  },
  {
    A: "Japan",
    B: "Indonesia",
    FROM: "A",
    LISTABLES: [],
  },
  {
    A: "China",
    B: "Indonesia",
    FROM: "A",
    LISTABLES: ["IndonesianVocabularyFromSouthernChinese"],
  },
  // {
  //   A: "China",
  //   B: "Vietnam",
  //   FROM: "A",
  //   LISTABLES: [],
  // },
  {
    A: "China",
    B: "Japan",
    FROM: "AB",
    LISTABLES: ["HanCharacters"],
  },
  {
    A: "Japan",
    B: "South Korea",
    FROM: "A",
    LISTABLES: [],
  },
  {
    A: "India",
    B: "Indonesia",
    FROM: "A",
    LISTABLES: ["IndonesiaVocabularyFromSanskrit"],
  },
  {
    A: "Saudi Arabia",
    B: "Indonesia",
    FROM: "A",
    LISTABLES: ["IndonesianVocabularyFromArabic"],
  },
  {
    A: "Portugal",
    B: "Indonesia",
    FROM: "A",
    LISTABLES: [],
  },
  {
    A: "Netherlands",
    B: "Japan",
    FROM: "A",
    LISTABLES: [],
  },
  {
    A: "Portugal",
    B: "Japan",
    FROM: "A",
    LISTABLES: [],
  },
  {
    A: "United Kingdom",
    B: "Japan",
    FROM: "A",
    LISTABLES: [],
  },
  {
    A: "United States of America",
    B: "Japan",
    FROM: "AB",
    LISTABLES: [],
  },
  {
    A: "Germany",
    B: "Japan",
    FROM: "A",
    LISTABLES: [],
  },
  {
    A: "France",
    B: "Japan",
    FROM: "A",
    LISTABLES: [],
  },
  {
    A: "United Kingdom",
    B: "Australia",
    FROM: "A",
    LISTABLES: [],
  },
  {
    A: "United Kingdom",
    B: "Malaysia",
    FROM: "A",
    LISTABLES: [],
  },
  // {
  //   A: "United Kingdom",
  //   B: "Hong Kong",
  //   FROM: "A",
  //   LISTABLES: [],
  // },
  {
    A: "United Kingdom",
    B: "United States of America",
    FROM: "A",
    LISTABLES: [],
  },
  {
    A: "United States of America",
    B: "Philippines",
    FROM: "A",
    LISTABLES: [],
  },
  // {
  //   A: "Portugal",
  //   B: "Angola",
  //   FROM: "A",
  //   LISTABLES: [],
  // },
  // {
  //   A: "Spain",
  //   B: "Mexico",
  //   FROM: "A",
  //   LISTABLES: [],
  // },
];

export default relations;
