const jwt = require('jsonwebtoken')
require('dotenv').config()  // carregar as variáveis de ambiente
const SEGREDO = process.env.JWT_SECRET

function gerarToken(payload) {
    return jwt.sign(payload, SEGREDO, { expiresIn: '3h' })
}

function verificarToken(token) {
    try {
        return jwt.verify(token, SEGREDO)
    } catch (err) {
        console.error("Erro ao verificar token")
        return null
    }
}

module.exports = { gerarToken, verificarToken }