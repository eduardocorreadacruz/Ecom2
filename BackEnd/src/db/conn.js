const { Sequelize } = require('sequelize')
require('dotenv').config()

// lógica: se existir uma DATABASE_URL (mysql://user:pass@host:port/dbname) usa ela.
// Senão tenta variáveis separadas (DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT).
// Também aceita nomes típicos do Railway pode expor como:
// MYSQLHOST / MYSQLUSER / MYSQLPASSWORD / MYSQLDATABASE / MYSQLPORT

function getConnectionConfig() {
  // 1) if DATABASE_URL provedor
  if (process.env.DATABASE_URL) {
    // Sequelize aceita connection URI diretamente
    return { uri: process.env.DATABASE_URL, options: { dialect: 'mysql', dialectOptions: {} } }
  }

  // 2) try Railway-like MYSQL_* env vars
  if (process.env.MYSQLDATABASE && process.env.MYSQLUSER && process.env.MYSQLPASSWORD) {
    const db = process.env.MYSQLDATABASE
    const user = process.env.MYSQLUSER
    const pass = process.env.MYSQLPASSWORD
    const host = process.env.MYSQLHOST || process.env.MYSQL_HOST || process.env.DB_HOST
    const port = process.env.MYSQLPORT || process.env.MYSQL_PORT || process.env.DB_PORT
    const uri = `mysql://${user}:${encodeURIComponent(pass)}@${host}:${port}/${db}`
    return { uri, options: { dialect: 'mysql', dialectOptions: {} } }
  }

  // 3) fallback to legacy DB_* vars (your .env)
  if (process.env.DB_NAME && process.env.DB_USER) {
    const db = process.env.DB_NAME
    const user = process.env.DB_USER
    const pass = process.env.DB_PASS || ''
    const host = process.env.DB_HOST || 'localhost'
    const port = process.env.DB_PORT || 3306
    const uri = `mysql://${user}:${encodeURIComponent(pass)}@${host}:${port}/${db}`
    return { uri, options: { dialect: 'mysql', dialectOptions: {} } }
  }

  // 4) não encontrado -> lança erro - precisa do debug
  throw new Error('Nenhuma configuração de DB encontrada nas variáveis de ambiente.')
  
  // Defina DATABASE_URL OU MYSQLDATABASE/MYSQLUSER/MYSQLPASSWORD OU DB_NAME/DB_USER/DB_PASS
  
}

const { uri, options } = getConnectionConfig()

const sequelize = new Sequelize(uri, options)

// Exemplo de teste de conexão — logs claros
async function testConnection() {
  try {
    await sequelize.authenticate()
    console.log('Conexão com o banco realizada com sucesso!')
  } catch (err) {
    console.error('Erro ao conectar com banco de dados!', err)
  }
}
testConnection()

module.exports = sequelize
