document.addEventListener('DOMContentLoaded', () => {
    let resContato = document.getElementById('resContato')
    let contatoForm = document.getElementById('contatoForm')
    let userName = document.getElementById('userName')

    let statusLog = localStorage.getItem('statusLog')
    let token = localStorage.getItem('token')
    let user = localStorage.getItem('user')
    let currentUser = user ? JSON.parse(user) : null
    let nomeUser = currentUser ? currentUser.nome : ''
    console.log('nome: ', nomeUser)
    console.log('statusLog', statusLog)

    if (userName && nomeUser) {
        userName.textContent = `Olá, ${nomeUser} (${currentUser.tipo_usuario})`
    }

    if (token && currentUser && (currentUser.tipo_usuario === 'ADMIN' || currentUser.tipo_usuario === 'CLIENTE')) {
        contatoForm.addEventListener('submit', (e) => {
            e.preventDefault()

            let assunto = document.getElementById('assunto').value
            let titulo = document.getElementById('titulo').value.trim()
            let descricao = document.getElementById('descricao').value.trim()
            let urgencia = document.getElementById('urgencia').value

            if (!assunto || !titulo || !descricao) {
                resContato.innerHTML = 'Preencha todos os campos obrigatórios.'
                resContato.className = 'admin-message error'
                return
            }

            const dadosContato = {
                assunto,
                titulo,
                descricao,
                urgencia,
                usuario: {
                    id: currentUser.id,
                    nome: currentUser.nome,
                    email: currentUser.email,
                    tipo: currentUser.tipo_usuario
                }
            }

            console.log('Enviando relatório:', dadosContato)

            fetch(`http://localhost:3000/contato`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosContato)
            })
            .then(resp => {
                console.log('Response status:', resp.status)
                return resp.json()
            })
            .then(dados => {
                console.log('Response data:', dados)
                if (dados.erro) {
                    resContato.innerHTML = dados.erro
                    resContato.className = 'admin-message error'
                } else {
                    resContato.innerHTML = dados.mensagem || 'Relatório enviado com sucesso! Entraremos em contato em breve.'
                    resContato.className = 'admin-message success'
                    contatoForm.reset()
                    setTimeout(() => {
                        resContato.innerHTML = ''
                        resContato.className = ''
                    }, 5000)
                }
            })
            .catch((err) => {
                console.error('Erro ao enviar relatório', err)
                resContato.innerHTML = 'Erro ao enviar relatório: ' + err.message
                resContato.className = 'admin-message error'
            })
        })
    } else {
        // Redirect to login if not authenticated
        location.href = './login.html'
    }
})