// $2b$10$4ezOBRQhpSC2RDy4zYLSbeLwZ8YdZ4m7V0Qp862QTf3fc4iIWK9iy

const bcrypt = require("bcrypt");

const password = "1234"; // The plaintext password you created
const storedHash = "$2b$10$ouWi1v/eHaDH0XXVXADqbOiji1O.GGrW0IWEHVPpvxoX5Wvhg3jQq"; // Hash from the database

const runTest = async () => {
    try {
        // Hash the password
        const hash = await bcrypt.hash(password, 10);
        console.log("Generated Hash:", hash);

        // Compare the input password with the database hash
        const isMatch = await bcrypt.compare(password, storedHash);
        console.log("Password Match:", isMatch);
    } catch (error) {
        console.error("Error:", error);
    }
};

runTest();
