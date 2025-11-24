const { validaCPF } = require('./validaCPF')

function validaEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
}

function validaTelefone(telefone) {
    // Aceita (11)9XXXX-XXXX ou 119XXXXYYYY
    const regex = /^\(?\d{2}\)?\s?\d{5}-?\d{4}$/
    return regex.test(telefone)
}

module.exports = {
    validaEmail,
    validaTelefone,
    validaCPF
}
