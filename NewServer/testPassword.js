const bcrypt = require("bcrypt");

const inputPassword = "1234"; // Replace with your input password
const storedHashedPassword = "$2b$10$ub5CyVzKFERlZNKifL3bOeZezQS5IiQiolqftOqfwkYhDeOA0cXI2";

const isMatch = bcrypt.compareSync(inputPassword, storedHashedPassword);
console.log("Password Match:", isMatch);
