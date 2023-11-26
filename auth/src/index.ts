import express from "express";
import { json } from "body-parser";
import { authRouter } from "./routes/auth";

const app = express();
app.use(json());

app.use(authRouter);

app.listen(3000, () => {
  console.log("Listening on port 3000!!!!!!!!");
});
