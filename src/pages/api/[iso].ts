import { NextApiRequest, NextApiResponse } from "next";
import { locales } from "../../data";

const handler = ({ query: { iso } }: NextApiRequest, res: NextApiResponse) => {
  const filtered = locales.filter((locale) => {
    locale.iso === iso;
  });

  if (filtered.length > 0) {
    res.status(200).json(filtered[0]);
  } else {
    res.status(400).json({ message: `locale ${iso} not found` });
  }
};

export default handler;
