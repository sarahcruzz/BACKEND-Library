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
    const { username, password} = req.body

    try{
        const user = await User.findOne({ username })
        if (!user) return res.status(400).json({ error: 'Usuário não encontrado'})
        
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ error: 'Senha incorreta'})

            const token = jwt.sign({ id: user._id}, process.env, JWT_SECRET,  {expiresIn: '1h'})
            res.json({ token })
    } catch (error){
        return res.status(500).json({ error: 'Erro ao fazer login'})        
    }
}

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
