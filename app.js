import "dotenv/config";
import express from "express";
import cors from "cors";
import indexRoutes from "./routes/index.js";
import productsRoutes from "./routes/products.js";
import kitsRoutes from "./routes/kits.js";
import teamsRoutes from "./routes/teams.js";
import categoriesRoutes from "./routes/categories.js";
import ordersRoutes from "./routes/orders.js";
import commentsRoutes from "./routes/comments.js";
import { connectDb } from "./db.js";

console.log("\x1Bc");

const app = express();

connectDb();

app.set("port", process.env.PORT || 4000);

app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "local"
        ? [`http://${process.env.FRONT_URL}`]
        : [
            `https://${process.env.FRONT_URL}`,
            `https://www.${process.env.FRONT_URL}`,
          ],
    credentials: true,
    exposedHeaders: "Authorization",
  })
);

app.use("/", indexRoutes);
app.use("/products", productsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/orders", ordersRoutes);
app.use("/kits", kitsRoutes);
app.use("/teams", teamsRoutes);
app.use("/comments", commentsRoutes);

app.use(function (req, res, next) {
  res.status(404).send({ message: "Not Found" });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send({ message: err.message || "error" });
});

app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});