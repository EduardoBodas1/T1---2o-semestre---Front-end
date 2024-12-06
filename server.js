const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://eduardobodas1:531938566@cluster0.agpyq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});



const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const Admin = mongoose.model('Admin', AdminSchema);


const PageContentSchema = new mongoose.Schema({
    page: { type: String, required: true, unique: true },
    content: { type: Object, required: true },
});
const PageContent = mongoose.model('PageContent', PageContentSchema);


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(401).send({ message: 'Usuário não encontrado' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).send({ message: 'Senha inválida' });

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});



const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).send({ message: 'Token não fornecido' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.adminId = decoded.id;
        next();
    } catch (error) {
        res.status(401).send({ message: 'Token inválido' });
    }
};


app.get('/content/:page', authenticate, async (req, res) => {
    const { page } = req.params;
    console.log(`Requisição recebida para a página: ${page}`);
    try {
        const content = await PageContent.findOne({ page });
        if (!content) {
            console.log(`Página ${page} não encontrada.`);
            return res.status(404).send({ message: 'Página não encontrada' });
        }
        console.log(`Conteúdo encontrado para a página ${page}:`, content);
        res.send(content);
    } catch (error) {
        console.error(`Erro ao buscar conteúdo da página ${page}:`, error.message);
        res.status(500).send({ error: error.message });
    }
});



app.put('/content/:page', authenticate, async (req, res) => {
    const { page } = req.params;
    const { content } = req.body;
    try {
        const updated = await PageContent.findOneAndUpdate(
            { page },
            { content },
            { new: true, upsert: true } 
        );
        res.send(updated); 
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));