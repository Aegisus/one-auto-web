// pages/api/comport.ts

import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    if (req.url === "/comport") {
      try {
        const response = await axios.get("http://localhost:5000/comport");
        const data = response.data;

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).send(data);
      } catch (error) {
        res.status(500).send("Error fetching data");
      }
    } else {
      res.status(404).send("Not Found");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
