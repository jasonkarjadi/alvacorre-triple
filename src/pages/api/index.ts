import { NextApiRequest, NextApiResponse } from "next";
import { locales } from "../../data";

const handler = (_: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(locales);
};

export default handler;
