const Usuario = require('../models/Usuario')
const { validaEmail, validaTelefone, validaCPF } = require('../utils/validacao')
const { hashSenha } = require('../utils/criptografia')

async function cadastrar(dados) {
    const { nome, email, telefone, cpf, identidade, senha, tipo_usuario  } = dados

    // -------- validações --------
    if (!nome || !email || !telefone || !cpf || !senha) {
        throw new Error('Campos obrigatórios não informados')
    }

    if (!validaEmail(email)) {
        throw new Error('Email inválido')
    }

    if (!validaTelefone(telefone)) {
        throw new Error('Telefone inválido')
    }

    if (!validaCPF(cpf)) {
        throw new Error('CPF inválido')
    }
    

    // -------- verificar duplicidade --------
    const usuarioEmail = await Usuario.findOne({ where: { email } })
    if (usuarioEmail) {
        throw new Error('Email já está cadastrado')
    }

    const usuarioCPF = await Usuario.findOne({ where: { cpf } })
    if (usuarioCPF) {
        throw new Error('CPF já está cadastrado')
    }

    // -------- criptografar senha --------
    const senhaBcrypt = await hashSenha(senha)

    // -------- criar no banco --------
    const dataToCreate = {
        nome,
        email,
        telefone,
        cpf,
        senha: senhaBcrypt
    };

    if (identidade) dataToCreate.identidade = identidade;
    if (tipo_usuario) dataToCreate.tipo_usuario = tipo_usuario;

    await Usuario.create(dataToCreate)

    return { ok: true }
}

module.exports = { cadastrar }
