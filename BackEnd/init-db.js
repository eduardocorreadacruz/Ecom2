/**
 * Script para inicializar o banco de dados no Railway
 * Execute este arquivo uma única vez para criar todas as tabelas
 */

require('dotenv').config()
const conn = require('./src/db/conn') 

const { 
    Usuario, 
    Pedido, 
    Produto, 
    ItemPedido, 
    Entrega, 
    Estoque 
} = require('./src/models/rel') 

async function initializeDataBase(){
    try{
        console.log('🚀 Iniciando criação das tabelas...')
        
        // Cria todas as tabelas (apaga e recria - USE COM CUIDADO EM PRODUÇÃO)
        await conn.sync({ force: false }) 
        
        console.log('✅----------------------------')
        console.log('✅ Banco de Dados inicializado com sucesso!')
        console.log('✅----------------------------')
        
        // Opcional: Criar usuário admin padrão
        const adminExists = await Usuario.findOne({ where: { email: 'admin@techparts.com' } })
        if (!adminExists) {
            await Usuario.create({
                nome: 'Administrador',
                email: 'admin@techparts.com',
                telefone: '(48) 99999-9999',
                cpf: '123.456.789-00',
                identidade: '1234567',
                senha: '$2b$10$example_hash', // Senha padrão: admin123
                tipo_usuario: 'ADMIN'
            })
            console.log('👤 Usuário admin criado: admin@techparts.com / admin123')
        }
        
    }catch(err){
        console.error('❌ ERRO: Não foi possível inicializar o banco de dados!', err)
        console.error('🔍 Detalhes do erro:', err.message)
        process.exit(1)
    } finally {
        await conn.close()
        console.log('🔒 Conexão com o banco de dados fechada.')
    }
}

// Verifica se está sendo executado diretamente
if (require.main === module) {
    initializeDataBase()
}

module.exports = initializeDataBase