const { criarEstoque, listarEstoques, buscarEstoquePorProduto,
    atualizarEstoque, adicionarQuantidade, removerQuantidade,
    deletarEstoque } = require('../services/estoque.service')

async function criar(req, res) {
    try {
        const estoque = await criarEstoque(req.body)
        return res.status(201).json({
            mensagem: 'Estoque criado com sucesso',
            estoque
        })
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function listar(req, res) {
    try {
        const estoques = await listarEstoques()
        return res.status(200).json(estoques)
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function buscarPorProduto(req, res) {
    try {
        const { idProduto } = req.params
        const estoque = await buscarEstoquePorProduto(idProduto)
        return res.status(200).json(estoque)
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function atualizar(req, res) {
    try {
        const { idProduto } = req.params
        const dados = req.body
        const estoqueAtualizado = await atualizarEstoque(idProduto, dados)
        return res.status(200).json({
            mensagem: 'Estoque atualizado com sucesso',
            estoque: estoqueAtualizado
        })
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function adicionar(req, res) {
    try {
        const { idProduto } = req.params
        const { quantidade } = req.body
        if (!quantidade || quantidade <= 0) {
            return res.status(400).json({ erro: 'Quantidade deve ser um número positivo' })
        }
        const estoque = await adicionarQuantidade(idProduto, quantidade)
        return res.status(200).json({
            mensagem: 'Quantidade adicionada com sucesso',
            estoque
        })
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function remover(req, res) {
    try {
        const { idProduto } = req.params
        const { quantidade } = req.body
        if (!quantidade || quantidade <= 0) {
            return res.status(400).json({ erro: 'Quantidade deve ser um número positivo' })
        }
        const estoque = await removerQuantidade(idProduto, quantidade)
        return res.status(200).json({
            mensagem: 'Quantidade removida com sucesso',
            estoque
        })
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function deletar(req, res) {
    try {
        const { idProduto } = req.params
        await deletarEstoque(idProduto)
        return res.status(200).json({ mensagem: 'Estoque deletado com sucesso' })
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

module.exports = { criar, listar, buscarPorProduto, atualizar, adicionar, remover, deletar }