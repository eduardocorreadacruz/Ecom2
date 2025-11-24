const Usuario = require('./Usuario')
const Pedido = require('./Pedido')
const Produto = require('./Produto')
const ItemPedido = require('./ItemPedido')
const Entrega = require('./Entrega')
const Estoque = require('./Estoque')


// -------------------------------------------------------------------------
// 1. RELACIONAMENTOS USUÁRIO
// -------------------------------------------------------------------------

// USUÁRIO <-> PEDIDO (1:N)
Usuario.hasMany(Pedido, { 
    foreignKey: 'idUsuario', 
    as: 'pedidosUsuario', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
})

Pedido.belongsTo(Usuario, { 
    foreignKey: 'idUsuario', 
    as: 'usuarioPedido' 
})


// -------------------------------------------------------------------------
// 2. RELACIONAMENTOS PEDIDO
// -------------------------------------------------------------------------

// PEDIDO <-> ITEM_PEDIDO (1:N)
Pedido.hasMany(ItemPedido, { 
    foreignKey: 'idPedido', 
    as: 'itensPedido', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
})

ItemPedido.belongsTo(Pedido, { 
    foreignKey: 'idPedido', 
    as: 'pedidoItem' 
})

// PEDIDO <-> ENTREGA (1:1)
Pedido.hasOne(Entrega, { 
    foreignKey: 'idPedido', 
    as: 'entregaPedido', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
})

Entrega.belongsTo(Pedido, { 
    foreignKey: 'idPedido', 
    as: 'pedidoEntrega' 
})


// -------------------------------------------------------------------------
// 3. RELACIONAMENTOS PRODUTO
// -------------------------------------------------------------------------

// PRODUTO <-> ITEM_PEDIDO (1:N - Vendas)
Produto.hasMany(ItemPedido, { 
    foreignKey: 'idProduto', 
    as: 'itensProduto', 
    onDelete: 'RESTRICT', // Protege o histórico de vendas
    onUpdate: 'CASCADE' 
})

ItemPedido.belongsTo(Produto, { 
    foreignKey: 'idProduto', 
    as: 'produtoItem' 
})

// PRODUTO <-> ESTOQUE (1:1)
Produto.hasOne(Estoque, { 
    foreignKey: 'idProduto', 
    as: 'estoqueProduto', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
})

Estoque.belongsTo(Produto, { 
    foreignKey: 'idProduto', 
    as: 'produtoEstoque' 
})


module.exports = { 
    Usuario, 
    Pedido, 
    Produto, 
    ItemPedido, 
    Entrega, 
    Estoque 
}