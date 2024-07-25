// src/pages/api/test-env.js
export default function handler(req, res) {
    const environmentDetails = {
        databaseUser: process.env.DATABASE_USER,
        databaseHost: process.env.DATABASE_HOST,
        databasePort: process.env.DATABASE_PORT,
        databaseName: process.env.DATABASE_NAME
    };

    res.status(200).json(environmentDetails);
}