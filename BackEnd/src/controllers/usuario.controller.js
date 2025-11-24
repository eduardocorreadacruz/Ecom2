const usuarioService = require('../services/usuario.service')

async function cadastrar(req, res) {
    try {
        const dados = req.body

        const resultado = await usuarioService.cadastrar(dados)

        return res.status(201).json({
            mensage: 'Usuário cadastrado com sucesso'})

    } catch (err) {
        console.error('Erro no controller de cadastro:', err)

        return res.status(500).json({mensage: 'Erro ao cadastrar usuário', err})
    }
}

module.exports = { cadastrar }
