require('dotenv').config()
const app = require('./src/server/app')
const conn = require('./src/db/conn')

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'

// Sincroniza banco e sobe servidor
conn.sync()
.then(() => {
    app.listen(PORT, HOST, () => {
        console.log(`Servidor rodando em http://${HOST}:${PORT}`)
    })
})
.catch((err) => {
    console.error('Erro ao conectar ao banco:', err)
})
