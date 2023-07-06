import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import morgan from "morgan";
require("dotenv").config();
const fs = require('fs');
const path = require('path');

const csrfProtection = csrf({ cookie: true }); // NOSONAR


// crear la aplicación express
const app = express(); // NOSONAR


// base de datos
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("**CONEXIÓN A LA BASE DE DATOS EXITOSA**"))
  .catch((err) => console.log("ERROR EN LA CONEXIÓN A LA BASE DE DATOS => ", err));

// aplicar middlewares
app.use(cors()); // NOSONAR




app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// rutas
fs.readdirSync('./routes').forEach((file) => {
  const routePath = path.join(__dirname, 'routes', file);
  app.use('/api', require(routePath));
});
// csrf
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// puerto
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`El servidor se está ejecutando en el puerto ${port}`));
