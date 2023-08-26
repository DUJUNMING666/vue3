// db/sql.js
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1234',
    max:100,
    port: 5432,
});

const connect = async () => {
    try {
        await pool.connect();
        console.log('Connected to PostgreSQL pool');
    } catch (error) {
        console.error('Error connecting to pool:', error);
    }
};

const query = async (text, params) => {
    try {
        return await pool.query(text, params);
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};

const end = async () => {
    try {
        await pool.end();
        console.log('Disconnected from PostgreSQL pool');
    } catch (error) {
        console.error('Error closing pool:', error);
    }
};

export { connect, query, end };