const bcrypt = require('bcrypt')
require('dotenv').config()  // carregar as variáveis de ambiente
const SALTOS = Number(process.env.BCRYPT_SALT_ROUNDS)

async function hashSenha(senha) {
    return await bcrypt.hash(senha, SALTOS)
}

async function compareSenha(senha,hash) {
    return  await bcrypt.compare(senha,hash)
}

module.exports = { hashSenha, compareSenha }