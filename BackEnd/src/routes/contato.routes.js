const express = require('express')
const router = express.Router()

const { enviarRelatorio } = require('../controllers/contato.controller')

// Middlewares
const authMiddleware = require('../middlewares/auth.middleware')

// POST /contato - Enviar relatório de contato
router.post(
    '/',
    authMiddleware,
    enviarRelatorio
)

module.exports = router