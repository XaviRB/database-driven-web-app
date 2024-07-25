import { Pool } from 'pg';

// Create a new pool instance to manage PostgreSQL connections
const pool = new Pool({
    user: process.env.DATABASE_USER,        
    host: process.env.DATABASE_HOST,         
    database: process.env.DATABASE_NAME,     
    password: process.env.DATABASE_PASSWORD, 
    port: process.env.DATABASE_PORT || 5432, // Database port (default to 5432)
});

// Middleware for handling exceptions in async routes
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.error("API Error:", error);
      res.status(500).json({ error: 'Internal server error' });
    });

// Main handler function for the API
export default asyncHandler(async (req, res) => {
    const { id } = req.query; // Assuming 'id' is passed as a query parameter

    // Determine the request method and handle accordingly
    switch (req.method) {
        case 'GET':
            // Handle GET request: Fetch all tasks
            const { rows } = await pool.query('SELECT * FROM tasks');
            res.status(200).json(rows);
            break;
        case 'POST': {
            // Handle POST request: Add a new task
            const { description, due_date } = req.body;
            if (!description || !due_date) {
                res.status(400).json({ error: "Missing description or due date" });
                return;
            }
            const result = await pool.query(
                'INSERT INTO tasks (description, due_date) VALUES ($1, $2) RETURNING *',
                [description, due_date]
            );
            res.status(201).json(result.rows[0]);
            break;
        }
        case 'DELETE': {
            // Handle DELETE request: Delete a task by ID
            if (!id) {
                res.status(400).json({ error: "Missing task ID for deletion" });
                return;
            }
            await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
            res.status(204).end(); // No content to send back
            break;
        }
        case 'PUT': {
            // Handle PUT request: Update a task by ID
            const { description, due_date, is_complete } = req.body; // Capture due_date and is_complete
            if ((!description && !due_date && is_complete === undefined) || !id) {
                res.status(400).json({ error: "Missing description, due date, completion status, or ID" });
                return;
            }
            // Construct the SQL query dynamically based on provided fields
            let query = 'UPDATE tasks SET';
            const fields = [];
            if (description) {
                fields.push(`description = '${description}'`);
            }
            if (due_date) {
                fields.push(`due_date = '${due_date}'`);
            }
            if (is_complete !== undefined) {
                fields.push(`is_complete = ${is_complete}`);
            }
            query += ` ${fields.join(', ')} WHERE id = ${id}`;
            await pool.query(query);
            res.status(200).json({ id, description, due_date, is_complete });
            break;
        }
        default:
            // Handle unsupported request methods
            res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
});
