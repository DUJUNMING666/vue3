// api/api.js
import express from 'express';
import * as db from '../db/sql.js';
import cors from 'cors';
import {ca} from "vuetify/locale";

const app = express();
const AllowOrigins =['http://localhost:5173','http://192.168.0.110:5173']

const CorsOptions = {
    origin: AllowOrigins,
    methods: 'GET,POST',
    credentials: true,
};

app.use(cors(CorsOptions));
app.use(express.json());

app.get('/api/data', async (req, res) => {
    const id = req.query.id; // 从请求参数中获取 id
    try {
        const result = await db.query('SELECT "Id", "Password", "Name", "Email" FROM public."Users" WHERE "Id" = $1',[id]);
        const user = result.rows[0]
        res.setHeader('Cache-Control', 'no-cache');
        res.json(user);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
});
app.post('/api/login', async (req, res) => {
    const { id, password } = req.body;
    try {
        const result = await db.query('SELECT COUNT(*) AS count FROM public."Users" WHERE "Id" = $1 AND "Password" = $2',[id,password]);
        if (result.rows[0].count > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
});
app.post('/api/create', async (req, res) => {
    const {  contents, subtime, authorid, articlename, authorname } = req.body;
    try {
        const result = await db.query('INSERT INTO public."Articles"("Content", "SubTime", "AuthorId", "ArticleName", "AuthorName") VALUES ($1, $2, $3, $4, $5)', [ contents, subtime, authorid, articlename, authorname]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
});
app.get('/api/article', async (req, res) => {
    try {
        const result = await db.query('SELECT "ArticleId", "Content", "SubTime", "AuthorId", "ArticleName", "AuthorName" FROM public."Articles"');
        const article = result.rows;
        res.setHeader('Cache-Control', 'no-cache');
        res.json(article);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
});
app.get('/api/getComment', async (req, res) => {
    try {
        const  articleId = req.query.articleId;
        const  result  = await db.query('select * from public."Comment" where "ArticleId" = $1',[articleId]);
        const comment = result.rows;
        res.setHeader('Cache-Control', 'no-cache');
        res.json(comment);
    }
    catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
});
app.post('/api/createComment', async (req, res) => {
    const { articleid,id,fatherid,comment,time,name}=req.body;
    try {
    const result = await db.query('INSERT INTO public."Comment"("ArticleId", "Id", "FatherId", "Comment", "Time", "Name") VALUES ($1, $2, $3, $4, $5, $6)', [articleid,id,fatherid,comment,time,name]);
    res.json({ success: true });
    }
    catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
});
const startServer = (port) => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

export { app, startServer };