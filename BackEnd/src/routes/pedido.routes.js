const express = require('express')
const router = express.Router()

const { criar, listarMeus, buscarPorId, atualizarStatus, listarTodos } = require('../controllers/pedido.controller')

// Middlewares
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

// POST /pedido - Criar pedido (usuário logado)
router.post(
    '/',
    authMiddleware,
    criar
)

// GET /pedido - Listar meus pedidos (usuário logado)
router.get(
    '/',
    authMiddleware,
    listarMeus
)

// GET /pedido/:id - Buscar pedido por ID (usuário logado, só os próprios)
router.get(
    '/:id',
    authMiddleware,
    buscarPorId
)

// PATCH /pedido/:id/status - Atualizar status (ADMIN)
router.patch(
    '/:id/status',
    authMiddleware,
    isAdminMiddleware,
    atualizarStatus
)

// GET /pedido/admin/todos - Listar todos os pedidos (ADMIN)
router.get(
    '/admin/todos',
    authMiddleware,
    isAdminMiddleware,
    listarTodos
)

module.exports = router