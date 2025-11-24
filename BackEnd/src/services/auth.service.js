const Usuario = require('../models/Usuario')
const { compareSenha } = require('../utils/criptografia')
const { gerarToken } = require('../utils/tokenJWT')

async function login({ email, senha }) {

// -------- validação básica --------
if (!email || !senha) {
    throw new Error('E-mail e senha são obrigatórios')
}

// -------- buscar usuário no banco --------
const usuario = await Usuario.findOne({ where: { email } })
if (!usuario) {
    throw new Error('Usuário não encontrado')
}

// -------- comparar senha --------
const senhaValida = await compareSenha(senha, usuario.senha)

if (!senhaValida) {
    throw new Error('Senha inválida')
}

// -------- gerar token JWT --------
const token = gerarToken({
    id: usuario.codUsuario,
    email: usuario.email,
    tipo_usuario: usuario.tipo_usuario
})

// -------- retorno ao controller --------
return {
    token,
    usuario: {
        id: usuario.codUsuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario
    }
}

}

module.exports = { login }