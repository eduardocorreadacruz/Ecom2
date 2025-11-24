function validaCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '')

    // Verifica se o CPF tem 11 dígitos ou é uma sequência de números repetidos
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false
    }

    // Cálculo do primeiro dígito verificador
    let soma = 0
    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i)
    }
    let resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) {
        resto = 0
    }
    if (resto !== Number(cpf[9])) {
        return false
    }

    // Cálculo do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i)
    }
    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) {
        resto = 0
    }
    if (resto !== Number(cpf[10])) {
        return false
    }

    return true
}

module.exports = { validaCPF }

// Exemplo de uso
// const cpf = '123.456.789-09'
// const cpf2 = '123.456.789-10'
// console.log(validaCPF(cpf) ? 'CPF válido' : 'CPF inválido')
// console.log(validaCPF(cpf2) ? 'CPF válido' : 'CPF inválido')
