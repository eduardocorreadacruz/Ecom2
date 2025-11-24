const authService = require('../services/auth.service')

async function login(req, res) {
    try {
        const { email, senha } = req.body

        // chama o service
        const resultado = await authService.login({ email, senha })

        return res.status(200).json({
            mensagem: 'Login realizado com sucesso',
            ...resultado
        })

    } catch (err) {
        console.error('Erro no controller de login:', err.message)

        return res.status(500).json({
            mensagem: err.message || 'Erro ao realizar login'
        })
    }

}

module.exports = { login }
