const bcrypt = require("bcrypt");

async function run() {
    console.log("Password123 =>", await bcrypt.hash("Password123", 10));
    console.log("Admin123 =>", await bcrypt.hash("Admin123", 10));
    console.log("Welcome123 =>", await bcrypt.hash("Welcome123", 10));
}

run();