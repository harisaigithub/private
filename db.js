// const sql = require("mssql");

// const config = {

//     user: "sa",

//     password: "yourpassword",

//     server: "localhost",

//     database: "EMS",

//     options: {

//         trustServerCertificate: true,

//         encrypt: false

//     }

// };

// const pool = new sql.ConnectionPool(config);

// const poolConnect = pool.connect();

// module.exports = {

//     sql,

//     pool,

//     poolConnect

// };

const sql = require("mssql/msnodesqlv8");

const config = {
    connectionString:
        "Driver={ODBC Driver 17 for SQL Server};Server=localhost\\MSSQLSERVER02;Database=FileUploadDB;Trusted_Connection=Yes;"
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

module.exports = {
    sql,
    pool,
    poolConnect
};