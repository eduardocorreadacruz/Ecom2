async function enviarRelatorioContato(dados) {
    const { assunto, titulo, descricao, urgencia, usuario } = dados

    // Mapear assuntos para português
    const assuntosMap = {
        'erro_produto': 'Erro com Produto',
        'erro_pedido': 'Erro com Pedido',
        'erro_sistema': 'Erro no Sistema',
        'erro_estoque': 'Erro no Estoque',
        'sugestao': 'Sugestão de Melhoria',
        'outro': 'Outro'
    }

    const urgenciasMap = {
        'baixa': 'Baixa',
        'media': 'Média',
        'alta': 'Alta',
        'critica': 'Crítica'
    }

    // Log do relatório para o console (usuário implementará o envio de email)
    console.log('=== RELATÓRIO DE CONTATO RECEBIDO ===')
    console.log('Data/Hora:', new Date().toLocaleString('pt-BR'))
    console.log('Usuário:', {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
    })
    console.log('Assunto:', assuntosMap[assunto] || assunto)
    console.log('Título:', titulo)
    console.log('Urgência:', urgenciasMap[urgencia] || 'Média')
    console.log('Descrição:')
    console.log(descricao)
    console.log('=====================================')

    // Simular envio bem-sucedido
    return {
        sucesso: true,
        logged: true,
        dados: {
            assunto: assuntosMap[assunto] || assunto,
            titulo,
            urgencia: urgenciasMap[urgencia] || 'Média',
            usuario: usuario.nome,
            timestamp: new Date().toISOString()
        }
    }
}

module.exports = { enviarRelatorioContato }