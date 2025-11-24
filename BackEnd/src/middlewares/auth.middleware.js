const { verificarToken } = require('../utils/tokenJWT')

function authMiddleware(req, res, next) {

// console.log('[AUTH MIDDLEWARE] - Iniciando verificação de token...')

const authHeader = req.headers['authorization']

if (!authHeader) {
    console.log('[AUTH MIDDLEWARE] - Nenhum header Authorization encontrado!')
    return res.status(401).json({ erro: 'Token não informado' })
}

const token = authHeader.split(' ')[1]

if (!token) {
    console.log('[AUTH MIDDLEWARE] - Token mal formatado!')
    return res.status(401).json({ erro: 'Token inválido ou mal formatado' })
}

try {
    const payload = verificarToken(token)

    req.user = payload  

    console.log('[AUTH MIDDLEWARE] - Token válido. Payload:')
    console.log(req.user)

    return next()

} catch (err) {
    console.log('[AUTH MIDDLEWARE] - Erro ao verificar token:', err.message)
    return res.status(401).json({ erro: 'Token inválido ou expirado' })
}

}

module.exports = authMiddleware