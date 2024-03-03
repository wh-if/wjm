import mysql from 'mysql'

let databaseName = 'wjm-dev';
if (process.env.NODE_ENV === 'production') {
  databaseName = 'wjm'
}

export const pool = mysql.createPool({
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: databaseName
});


