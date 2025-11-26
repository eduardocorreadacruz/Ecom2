const conn = require('./src/db/conn') 

const { 
    Usuario, 
    Pedido, 
    Produto, 
    ItemPedido, 
    Entrega, 
    Estoque 
} = require('./src/models/rel') 

async function syncDataBase(){
    try{
        await conn.sync({ force: true }) 
        
        console.log('----------------------------')
        console.log('Banco de Dados sincronizado!')
        console.log('----------------------------')

    }catch(err){
        console.error('ERRO: Não foi possível sincronizar o banco de dados!', err)
    } finally {
        await conn.close()
        console.log('Conexão com o banco de dados fechada.')
    }
}

syncDataBase()