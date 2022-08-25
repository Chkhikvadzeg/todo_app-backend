import pg from 'pg';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'todo',
    password: '1234',
    port: 5432
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/", async (req, res) => {
    const todo = req.body;

    const client = await pool.connect();
    const result = await client.query({
        text: `INSERT INTO todo_app 
        (name, status) 
        VALUES($1, $2);`,
        values: [
            todo.name,
            todo.status
        ]
    });

    const select = await client.query({
        text: 'SELECT * FROM todo_app ORDER BY id DESC;',
    });

    res.json(select.rows);
});

app.get("/", async (req, res, next) => {
    const client = await pool.connect();
    const result = await client.query({
        text: 'SELECT * FROM todo_app ORDER BY id DESC;',
    });

    res.json(result.rows);
});

app.put("/:id", async (req, res, next) => {
    const id = req.params.id;
    const todo = req.body;
    const client = await pool.connect();
    const result = await client.query({
        text: `UPDATE todo_app
        SET name = $1, status = $2
        WHERE id = $3;`,
        values: [
            todo.name,
            todo.status,
            id
        ]
    });

    res.send(`Todo with title: ${todo.name} updated in the database.`)
});

app.delete("/:id", async (req, res, next) => {
    const id = req.params.id;
    const client = await pool.connect();
    const result = await client.query({
        text: `DELETE FROM todo_app WHERE id = $1;`,
        values: [id]
    });

    res.send(`Todo with id: ${id} deleted from the database.`)
})


app.listen(8000, () => {
    console.log('Server started on port 8000');
})

