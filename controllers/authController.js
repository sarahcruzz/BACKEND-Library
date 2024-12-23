const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    const { username, password} = req.body

    try{
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const newUser = new User({ username, password: hashedPassword})
        await newUser.save()

        res.status(201).json({ message: 'Usuário registrado com sucesso'})
    }catch (error){
        res.status(500).json({ error: 'Erro ao registrar usuário'})
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Busca o usuário pelo nome
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Usuário não encontrado' });
        }

        // Verifica se a senha está correta
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Senha incorreta' });
        }

        // Gera o token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Retorna o token
        res.json({ token });
    } catch (error) {
        console.error('Erro no login:', error); // Log detalhado para depuração
        return res.status(500).json({ error: 'Erro ao fazer login' });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclui o campo `password` por segurança
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o usuário' });
    }
};

exports.activateUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndUpdate(id, { active: true }, { new: true });
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

        res.json({ message: 'Usuário ativado com sucesso', user });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao ativar usuário' });
    }
};

exports.deactivateUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndUpdate(id, { active: false }, { new: true });
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

        res.json({ message: 'Usuário desativado com sucesso', user });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao desativar usuário' });
    }
};
