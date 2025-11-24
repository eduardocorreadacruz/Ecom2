require('dotenv').config()
const app = require('./src/server/app')
const conn = require('./src/db/conn')

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0' // 0.0.0.0 é seguro e aceita conexões em PaaS

const isProduction = process.env.NODE_ENV === 'production'

async function startServer() {
  try {
    if (!isProduction) {
      // Em desenvolvimento: sincroniza alterando o esquema para facilitar dev
      await conn.sync({ alter: true })
      console.log('Banco sincronizado (dev) com { alter: true }');
    } else {
      // Em produção: NÃO sincronize automaticamente (evita droppar/alterar sem controle)
      await conn.authenticate()
      console.log('Banco autenticado (produção)')
    }

    app.listen(PORT, HOST, () => {
      console.log(`Servidor rodando em http://${HOST}:${PORT}`)
    });
  } catch (err) {
    console.error('Erro ao conectar ao banco ou iniciar o servidor:', err)
    process.exit(1) // sai com erro para o Railway identificar falha no deploy
  }
}

startServer()
