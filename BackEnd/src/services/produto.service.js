const Produto = require('../models/Produto')

async function criarProduto(dados) {

    const { nome, descricao, modelo, categoria, marca, especificacoes, preco, imagem_url, ativo } = dados

    // Validações simples antes de salvar
    if (!nome || !modelo || !preco || !categoria || !marca) {
        throw new Error('Nome, modelo, preço, categoria e marca são obrigatórios')
    }

    const novoProduto = await Produto.create({
        nome,
        descricao,
        modelo,
        categoria,
        marca,
        especificacoes,
        preco,
        imagem_url,
        ativo
    })

    return novoProduto
}

async function listarProdutos() {
    const produtos = await Produto.findAll()
    return produtos
}

async function buscarProdutoPorNome(nome) {
    const produto = await Produto.findOne({
        where: {
            nome: nome
        }
    })

    if (!produto) {
        throw new Error('Produto não encontrado')
    }

    return produto
}

async function atualizarProduto(id, dados) {

    // Buscar o produto no banco
    const produto = await Produto.findByPk(id)

    if (!produto) {
        throw new Error('Produto não encontrado')
    }

    // Atualizar apenas os campos enviados
    await produto.update(dados)

    return produto

}

async function atualizarProdutoCompleto(id, dados) {

    const produto = await Produto.findByPk(id)

    if (!produto) {
        throw new Error('Produto não encontrado')
    }

    const { nome, descricao, modelo, categoria, marca, especificacoes, preco, imagem_url, ativo } = dados

    // Validações básicas
    if (!nome || !modelo || !preco || !categoria || !marca) {
        throw new Error('Nome, modelo, preço, categoria e marca são obrigatórios')
    }

    await produto.update({
        nome,
        descricao,
        modelo,
        categoria,
        marca,
        especificacoes,
        preco,
        imagem_url,
        ativo
    })

    return produto
}

async function apagarProduto(id) {

    const produto = await Produto.findByPk(id)

    if (!produto) {
        throw new Error('Produto não encontrado')
    }

    await produto.destroy()

    return true
}


module.exports = { criarProduto, listarProdutos, buscarProdutoPorNome,
    atualizarProduto, atualizarProdutoCompleto, apagarProduto }
