const { criarPedido, listarPedidosUsuario, buscarPedidoPorId,
    atualizarStatusPedido, listarTodosPedidos } = require('../services/pedido.service')

async function criar(req, res) {
    try {
        const idUsuario = req.user.id // From auth middleware
        const dados = { ...req.body, idUsuario }
        const pedido = await criarPedido(dados)
        return res.status(201).json({
            mensagem: 'Pedido criado com sucesso',
            pedido
        })
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function listarMeus(req, res) {
    try {
        const idUsuario = req.user.id // From auth middleware
        const pedidos = await listarPedidosUsuario(idUsuario)
        return res.status(200).json(pedidos)
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function buscarPorId(req, res) {
    try {
        const { id } = req.params
        const idUsuario = req.user.id
        const pedido = await buscarPedidoPorId(id, idUsuario)
        return res.status(200).json(pedido)
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function atualizarStatus(req, res) {
    try {
        const { id } = req.params
        const { status } = req.body
        const pedido = await atualizarStatusPedido(id, status)
        return res.status(200).json({
            mensagem: 'Status do pedido atualizado',
            pedido
        })
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function listarTodos(req, res) {
    try {
        const pedidos = await listarTodosPedidos()
        return res.status(200).json(pedidos)
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

module.exports = { criar, listarMeus, buscarPorId, atualizarStatus, listarTodos }