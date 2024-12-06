const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

console.log('Arquivo iniciado...');

mongoose.connect('mongodb+srv://eduardobodas1:Malino*2006@cluster0.agpyq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Conectado ao MongoDB!');
}).catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
});


const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const Admin = mongoose.model('Admin', AdminSchema);


console.log('Iniciando a criação do administrador...');
async function createAdmin() {
    const password = '531938566'; 
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
        username: '24.00454-5@maua.br',
        password: hashedPassword,
    });

    try {
        await admin.save();
        console.log('Administrador criado com sucesso!');
    } catch (error) {
        console.error('Erro ao criar administrador:', error.message);
    } finally {
        mongoose.connection.close();
    }
}

createAdmin();