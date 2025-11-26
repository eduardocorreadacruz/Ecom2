const Produto = require('../models/Produto')
const Estoque = require('../models/Estoque')

async function criarProduto(dados){const{nome,descricao,modelo,categoria,marca,especificacoes,preco,imagem_url,ativo}=dados;if(!nome||!modelo||!preco||!categoria||!marca){throw new Error('Nome, modelo, preço, categoria e marca são obrigatórios')}const novoProduto=await Produto.create({nome,descricao,modelo,categoria,marca,especificacoes,preco,imagem_url,ativo});try{await Estoque.create({idProduto:novoProduto.codProduto,quantidade_atual:0,quantidade_minima:0})}catch(estoqueError){console.error('Erro ao criar estoque para o produto:',estoqueError)}return novoProduto}

async function listarProdutos() {
    const produtos = await Produto.findAll({
        where: { ativo: true }
    })
    return produtos
}

async function buscarProdutoPorNome(nome) {
    const { Op } = require('sequelize')

    // Check if input is numeric (product ID) or text (product name)
    const isNumeric = /^\d+$/.test(nome.trim())

    let whereCondition
    if (isNumeric) {
        // Search by product ID
        whereCondition = { codProduto: parseInt(nome) }
    } else {
        // Search by product name (partial match)
        whereCondition = {
            nome: {
                [Op.like]: `%${nome}%`
            }
        }
    }

    const produto = await Produto.findOne({
        where: whereCondition
    })

    if (!produto) {
        throw new Error('Produto não encontrado')
    }

    return produto
}

async function atualizarProduto(id, dados) {

    const produto = await Produto.findByPk(id)

    if (!produto) {
        throw new Error('Produto não encontrado')
    }

    await produto.update(dados)

    return produto

}

async function atualizarProdutoCompleto(id, dados) {

    const produto = await Produto.findByPk(id)

    if (!produto) {
        throw new Error('Produto não encontrado')
    }

    const { nome, descricao, modelo, categoria, marca, especificacoes, preco, imagem_url, ativo } = dados

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

    await produto.update({ ativo: false })

    return true
}


module.exports = { criarProduto, listarProdutos, buscarProdutoPorNome,
    atualizarProduto, atualizarProdutoCompleto, apagarProduto }
