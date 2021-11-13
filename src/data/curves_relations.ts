import { Rels } from "../types";

const relations: Rels = [
  {
    A: "Netherlands",
    B: "Indonesia",
    FROM: "A",
  },
  {
    A: "Japan",
    B: "Indonesia",
    FROM: "A",
  },
  {
    A: "China",
    B: "Indonesia",
    FROM: "A",
  },
  {
    A: "China",
    B: "Japan",
    FROM: "AB",
  },
  {
    A: "Japan",
    B: "South Korea",
    FROM: "A",
  },
  {
    A: "India",
    B: "Indonesia",
    FROM: "A",
  },
  {
    A: "Saudi Arabia",
    B: "Indonesia",
    FROM: "A",
  },
  {
    A: "Portugal",
    B: "Indonesia",
    FROM: "A",
  },
  {
    A: "Netherlands",
    B: "Japan",
    FROM: "A",
  },
  {
    A: "Portugal",
    B: "Japan",
    FROM: "A",
  },
  {
    A: "United Kingdom",
    B: "Japan",
    FROM: "A",
  },
  {
    A: "United States of America",
    B: "Japan",
    FROM: "AB",
  },
  {
    A: "Germany",
    B: "Japan",
    FROM: "A",
  },
  {
    A: "France",
    B: "Japan",
    FROM: "A",
  },
];

export default relations;

// const contents = [
//   {
//     iso: "en",
//     imports: ["la", "fr", "el", "nl", "es", "it", "hi", "de", "ar"],
//     family: "ine",
//     form: "anal",
//     wordOrder: "SVO",
//   },
//   {
//     iso: "id",
//     imports: ["nl", "ar", "sa", "pt", "en", "zh"],
//     family: "map",
//     form: "synt",
//     wordOrder: "SVO",
//   },
//   {
//     iso: "jp",
//     imports: ["zh", "en", "pt", "nl", "de", "fr"],
//     family: "jpx",
//     form: "synt",
//     wordOrder: "SOV",
//   },
// ];
