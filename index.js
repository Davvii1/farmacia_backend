import express from "express";
import mysql from "mysql";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
const PORT = 4000;
app.use(express.json({ limit: "50mb" }));
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const connection = mysql.createConnection({
  host: "34.67.252.119",
  user: "root",
  password: "passwordfarmacia1",
  database: "farmacia",
});

connection.connect();

app.get("/appointments", (req, res) => {
  const query =
    "SELECT DATE_FORMAT(citas.datetime, '%Y-%m-%d %H:%i:%s') as datetime, usuarios.name, usuarios.email, usuarios.phone FROM citas INNER JOIN usuarios ON citas.patient_id = usuarios.id";
  connection.query(query, function (error, results) {
    if (error) throw error;
    res.json({ appointments: results });
  });
});

app.post("/login", (req, res) => {
  const query = `SELECT * FROM usuarios WHERE email="${req.body.email}" LIMIT 1`;
  connection.query(query, async function (error, results) {
    if (error) throw error;
    const validPassword = await bcrypt.compare(
      req.body.password,
      results[0].password
    );
    if (validPassword) {
      res.json({
        usuario: {
          name: results[0].name,
          email: results[0].email,
          phone: results[0].phone,
          user_type: results[0].user_type,
        },
      });
    } else {
      res.json({ msg: "Contaseña incorrecta" });
    }
  });
});

app.post("/register", async (req, res) => {
  const hashPassword = await bcrypt.hash(req.body.password, 10);
  const query = `INSERT INTO usuarios (name, email, password, user_type, phone) VALUES ("${req.body.name}", "${req.body.email}", "${hashPassword}", 0, "${req.body.phone}")`;
  connection.query(query, function (error, results) {
    if (error) throw error;
    res.json({ mgs: "Usuario creado exitosamente" });
  });
});

app.post("/newAppointment", async (req, res) => {
  const queryUser = `SELECT * FROM usuarios WHERE email="${req.body.email}" LIMIT 1`;
  connection.query(queryUser, function (error, results) {
    if (error) throw error;
    const query = `INSERT INTO citas (datetime, patient_id) VALUES ("${req.body.datetime}", ${results[0].id})`;
    connection.query(query, function (error, results) {
      if (error) throw error;
      res.json({ mgs: "Cita creada exitosamente" });
    });
  });
});

export default app;
