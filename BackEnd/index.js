require('dotenv').config()
const app = require('./src/server/app')
const conn = require('./src/db/conn')

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'

const isProduction = process.env.NODE_ENV === 'production'

async function startServer() {
  try {
    if (!isProduction) {
      await conn.sync({ alter: true })
      console.log('Banco sincronizado (dev) com { alter: true }');
    } else {
      // Em produção, primeiro tenta autenticar
      await conn.authenticate()
      console.log('Banco autenticado (produção)')
      
      // Depois verifica se as tabelas existem, se não, cria elas
      try {
        const [results] = await conn.query('SHOW TABLES')
        if (results.length === 0) {
          console.log('Nenhuma tabela encontrada. Criando tabelas...')
          await conn.sync({ alter: true })
          console.log('Tabelas criadas automaticamente!')
        }
      } catch (checkError) {
        console.log('Verificando tabelas...', checkError.message)
      }
    }

    app.listen(PORT, HOST, () => {
      console.log(`Servidor rodando em http://${HOST}:${PORT}`)
    })
  } catch (err) {
    console.error('Erro ao conectar ao banco ou iniciar o servidor:', err)
    process.exit(1)
  }
}

startServer()
