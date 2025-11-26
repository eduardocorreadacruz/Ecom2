const Estoque = require('../models/Estoque')
const Produto = require('../models/Produto')

async function criarEstoque(dados) {
    const { idProduto, quantidade_atual, quantidade_minima } = dados

    // Verificar se o produto existe
    const produto = await Produto.findByPk(idProduto)
    if (!produto) {
        throw new Error('Produto não encontrado')
    }

    // Verificar se já existe estoque para este produto
    const estoqueExistente = await Estoque.findOne({ where: { idProduto } })
    if (estoqueExistente) {
        throw new Error('Já existe um estoque cadastrado para este produto')
    }

    const novoEstoque = await Estoque.create({
        idProduto,
        quantidade_atual: quantidade_atual || 0,
        quantidade_minima: quantidade_minima || 0
    })

    return novoEstoque
}

async function listarEstoques() {
    const estoques = await Estoque.findAll()
    return estoques
}

async function buscarEstoquePorProduto(idProduto) {
    const estoque = await Estoque.findOne({
        where: { idProduto }
    })

    if (!estoque) {
        throw new Error('Estoque não encontrado para este produto')
    }

    return estoque
}

async function atualizarEstoque(idProduto, dados) {
    const estoque = await Estoque.findOne({ where: { idProduto } })

    if (!estoque) {
        throw new Error('Estoque não encontrado')
    }

    await estoque.update(dados)

    return estoque
}

async function adicionarQuantidade(idProduto, quantidade) {
    const estoque = await Estoque.findOne({ where: { idProduto } })

    if (!estoque) {
        throw new Error('Estoque não encontrado')
    }

    const novaQuantidade = estoque.quantidade_atual + quantidade

    await estoque.update({ quantidade_atual: novaQuantidade })

    return estoque
}

async function removerQuantidade(idProduto, quantidade) {
    const estoque = await Estoque.findOne({ where: { idProduto } })

    if (!estoque) {
        throw new Error('Estoque não encontrado')
    }

    const novaQuantidade = estoque.quantidade_atual - quantidade

    if (novaQuantidade < 0) {
        throw new Error('Quantidade insuficiente em estoque')
    }

    await estoque.update({ quantidade_atual: novaQuantidade })

    return estoque
}

async function deletarEstoque(idProduto) {
    const estoque = await Estoque.findOne({ where: { idProduto } })

    if (!estoque) {
        throw new Error('Estoque não encontrado')
    }

    await estoque.destroy()

    return true
}

module.exports = {
    criarEstoque,
    listarEstoques,
    buscarEstoquePorProduto,
    atualizarEstoque,
    adicionarQuantidade,
    removerQuantidade,
    deletarEstoque
}
