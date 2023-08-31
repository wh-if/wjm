import mysql from 'mysql'

export const pool = mysql.createPool({
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'WJM',
});


