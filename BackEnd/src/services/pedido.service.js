const { Pedido, ItemPedido, Produto, Estoque, Usuario, Entrega } = require('../models/rel')
const { Op } = require('sequelize')

async function criarPedido(dados) {
    const { idUsuario, itens, enderecoEntrega } = dados

    // Verificar se usuário existe
    const usuario = await Usuario.findByPk(idUsuario)
    if (!usuario) {
        throw new Error('Usuário não encontrado')
    }

    // Calcular totais
    let valorSubtotal = 0
    let valorFrete = 10.00 // Frete fixo para exemplo, pode ser calculado

    for (const item of itens) {
        const produto = await Produto.findByPk(item.idProduto)
        if (!produto) {
            throw new Error(`Produto ${item.idProduto} não encontrado`)
        }
        if (!produto.ativo) {
            throw new Error(`Produto ${produto.nome} não está disponível`)
        }
        // Verificar estoque
        const estoque = await Estoque.findOne({ where: { idProduto: item.idProduto } })
        if (!estoque || estoque.quantidade_atual < item.quantidade) {
            throw new Error(`Estoque insuficiente para ${produto.nome}`)
        }
        valorSubtotal += produto.preco * item.quantidade
    }

    const valorTotal = valorSubtotal + valorFrete

    // Criar pedido
    const novoPedido = await Pedido.create({
        idUsuario,
        valorSubtotal,
        valorFrete,
        valorTotal
    })

    // Criar itens do pedido e atualizar estoque
    for (const item of itens) {
        const produto = await Produto.findByPk(item.idProduto)
        await ItemPedido.create({
            idPedido: novoPedido.codPedido,
            idProduto: item.idProduto,
            quantidade: item.quantidade,
            precoUnitario: produto.preco,
            valorTotalItem: produto.preco * item.quantidade
        })
        // Decrementar estoque
        await Estoque.decrement('quantidade_atual', {
            by: item.quantidade,
            where: { idProduto: item.idProduto }
        })
    }

    // Criar entrega
    await Entrega.create({
        idPedido: novoPedido.codPedido,
        ...enderecoEntrega
    })

    return novoPedido
}

async function listarPedidosUsuario(idUsuario) {
    const pedidos = await Pedido.findAll({
        where: { idUsuario },
        include: [
            {
                model: ItemPedido,
                as: 'itensPedido',
                include: [{
                    model: Produto,
                    as: 'produtoItem',
                    attributes: ['nome', 'modelo', 'categoria', 'marca']
                }]
            },
            {
                model: Entrega,
                as: 'entregaPedido'
            }
        ],
        order: [['dataPedido', 'DESC']]
    })
    return pedidos
}

async function buscarPedidoPorId(idPedido, idUsuario) {
    const pedido = await Pedido.findOne({
        where: { codPedido: idPedido, idUsuario },
        include: [
            {
                model: ItemPedido,
                as: 'itensPedido',
                include: [{
                    model: Produto,
                    as: 'produtoItem'
                }]
            },
            {
                model: Entrega,
                as: 'entregaPedido'
            }
        ]
    })

    if (!pedido) {
        throw new Error('Pedido não encontrado')
    }

    return pedido
}

async function atualizarStatusPedido(idPedido, status) {
    const pedido = await Pedido.findByPk(idPedido)
    if (!pedido) {
        throw new Error('Pedido não encontrado')
    }

    await pedido.update({ status })
    return pedido
}

async function listarTodosPedidos() {
    const pedidos = await Pedido.findAll({
        include: [
            {
                model: Usuario,
                as: 'usuarioPedido',
                attributes: ['nome', 'email']
            },
            {
                model: ItemPedido,
                as: 'itensPedido',
                include: [{
                    model: Produto,
                    as: 'produtoItem',
                    attributes: ['nome', 'modelo']
                }]
            }
        ],
        order: [['dataPedido', 'DESC']]
    })
    return pedidos
}

module.exports = {
    criarPedido,
    listarPedidosUsuario,
    buscarPedidoPorId,
    atualizarStatusPedido,
    listarTodosPedidos
}