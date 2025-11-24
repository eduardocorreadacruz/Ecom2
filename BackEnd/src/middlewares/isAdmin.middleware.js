function isAdminMiddleware(req, res, next) {


// console.log('[ADMIN MIDDLEWARE] - Checando se usuário é admin...')
// console.log('[ADMIN MIDDLEWARE] - req.user recebido:')
// console.log(req.user)

if (!req.user) {
    console.log('[ADMIN MIDDLEWARE] - Usuário não autenticado!')
    return res.status(401).json({ erro: 'Usuário não autenticado' })
}

if (!req.user.tipo_usuario || req.user.tipo_usuario.toUpperCase() !== 'ADMIN') {
    console.log('[ADMIN MIDDLEWARE] - Usuário não é administrador!')
    return res.status(403).json({ erro: 'Acesso permitido somente para administradores' })
}

console.log('[ADMIN MIDDLEWARE] - Acesso autorizado!')
return next()


}

module.exports = isAdminMiddleware
