const express = require('express')
const router = express.Router()

const { criar, listar, buscarPorProduto, atualizar,
    adicionar, remover, deletar } = require('../controllers/estoque.controller')

// Middlewares
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

// POST /estoque - Criar estoque para produto (ADMIN)
router.post(
    '/',
    authMiddleware,
    isAdminMiddleware,
    criar
)

// GET /estoque - Listar estoques (ADMIN)
router.get(
    '/',
    authMiddleware,
    isAdminMiddleware,
    listar
)

// GET /estoque/:idProduto - Buscar estoque por produto (ADMIN)
router.get(
    '/:idProduto',
    authMiddleware,
    isAdminMiddleware,
    buscarPorProduto
)

// PATCH /estoque/:idProduto - Atualizar estoque (ADMIN)
router.patch(
    '/:idProduto',
    authMiddleware,
    isAdminMiddleware,
    atualizar
)

// POST /estoque/:idProduto/adicionar - Adicionar quantidade (ADMIN)
router.post(
    '/:idProduto/adicionar',
    authMiddleware,
    isAdminMiddleware,
    adicionar
)

// POST /estoque/:idProduto/remover - Remover quantidade (ADMIN)
router.post(
    '/:idProduto/remover',
    authMiddleware,
    isAdminMiddleware,
    remover
)

// DELETE /estoque/:idProduto - Deletar estoque (ADMIN)
router.delete(
    '/:idProduto',
    authMiddleware,
    isAdminMiddleware,
    deletar
)

module.exports = router