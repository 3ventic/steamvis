import * as sapper from "@sapper/server";
import { json } from "body-parser";
import compression from "compression";
import express from "express";
import sirv from "sirv";

const { PORT, NODE_ENV, BASE_PATH } = process.env;
const dev = NODE_ENV === "development";

express()
  .use(json())
  .use(
    BASE_PATH || "",
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  )
  .listen(PORT);
