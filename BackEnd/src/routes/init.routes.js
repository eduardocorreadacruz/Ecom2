/**
 * 🚨 ATENÇÃO: Esta rota é APENAS para setup inicial
 * Remova ou comente esta rota após usar para segurança
 */

const express = require('express')
const router = express.Router()

// Importa o script de inicialização
const { initializeDataBase } = require('../../init-db')

// Rota temporária para inicializar banco
router.post('/init-database', async (req, res) => {
    try {
        console.log('🔄 Iniciando inicialização do banco via rota...')
        
        // Executa a inicialização
        await initializeDataBase()
        
        res.json({ 
            success: true, 
            message: 'Banco de dados inicializado com sucesso!',
            timestamp: new Date().toISOString()
        })
        
    } catch (error) {
        console.error('❌ Erro na inicialização:', error)
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao inicializar banco',
            error: error.message 
        })
    }
})

// Rota para verificar status do banco
router.get('/db-status', async (req, res) => {
    try {
        const conn = require('../db/conn')
        await conn.authenticate()
        
        // Verifica quantas tabelas existem
        const [results] = await conn.query('SHOW TABLES')
        
        res.json({
            success: true,
            connected: true,
            tables: results.length,
            tableNames: results.map(table => Object.values(table)[0])
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            connected: false,
            error: error.message
        })
    }
})

module.exports = router