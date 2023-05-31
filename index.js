import express from "express";
import mysql from 'mysql';

const app = express();

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const connection = mysql.createConnection({
  host     : '34.67.252.119',
  user     : 'root',
  password : 'passwordfarmacia1',
  database : 'farmacia'
});
 
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

export default app;
