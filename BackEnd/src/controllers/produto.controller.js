const { criarProduto, listarProdutos, buscarProdutoPorNome,
    atualizarProduto, atualizarProdutoCompleto,
    apagarProduto } = require('../services/produto.service')

async function criar(req, res) {

    try {

        const produto = await criarProduto(req.body)

        return res.status(201).json({
            mensagem: 'Produto criado com sucesso',
            produto
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function listar(req, res) {
    try {
        const { status } = req.query
        let produtos

        if (status === 'inativos') {
            // Get inactive products
            const Produto = require('../models/Produto')
            produtos = await Produto.findAll({
                where: { ativo: false }
            })
        } else {
            // Get active products (default)
            produtos = await listarProdutos()
        }

        return res.status(200).json(produtos)

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function buscarPorNome(req, res) {
    try {
        const { nome } = req.body

        if (!nome) {
            return res.status(400).json({ erro: 'Nome é obrigatório' })
        }

        const produto = await buscarProdutoPorNome(nome)

        return res.status(200).json(produto)

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// Atualizar parcialmente produto (PATCH /produto/)
async function atualizar(req, res) {
    try {
        const { id } = req.params
        const dados = req.body

        const produtoAtualizado = await atualizarProduto(id, dados)

        return res.status(200).json({
            mensagem: 'Produto atualizado com sucesso',
            produto: produtoAtualizado
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }

}

// PUT - Atualização total
async function atualizarCompleto(req, res) {
    try {
        const { id } = req.params
        const dados = req.body

        const produtoAtualizado = await atualizarProdutoCompleto(id, dados)

        return res.status(200).json({
            mensagem: 'Produto atualizado completamente com sucesso',
            produto: produtoAtualizado
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// DELETE - apagar
async function deletar(req, res) {
    try {
        const { id } = req.params

        await apagarProduto(id)

        return res.status(200).json({ mensagem: 'Produto apagado com sucesso' })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}


module.exports = { criar, listar, buscarPorNome, atualizar, 
    atualizarCompleto, deletar }
