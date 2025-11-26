const { enviarRelatorioContato } = require('../services/contato.service')

async function enviarRelatorio(req, res) {
    try {
        const dados = req.body

        // Validar dados obrigatórios
        if (!dados.assunto || !dados.titulo || !dados.descricao) {
            return res.status(400).json({ erro: 'Assunto, título e descrição são obrigatórios' })
        }

        // Adicionar informações do usuário autenticado
        dados.usuario = {
            id: req.user.id,
            nome: req.user.nome || 'Usuário',
            email: req.user.email,
            tipo: req.user.tipo_usuario
        }

        const resultado = await enviarRelatorioContato(dados)

        return res.status(200).json({
            mensagem: 'Relatório enviado com sucesso! Nossa equipe entrará em contato em breve.',
            messageId: resultado.messageId
        })

    } catch (err) {
        console.error('Erro no controller de contato:', err)
        return res.status(500).json({ erro: 'Erro interno do servidor ao enviar relatório' })
    }
}

module.exports = { enviarRelatorio }