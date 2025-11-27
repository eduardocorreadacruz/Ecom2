document.addEventListener('DOMContentLoaded', () => {
    let resProd = document.getElementById('resProd')
    let consProd = document.getElementById('consProd')
    let adminUserName = document.getElementById('adminUserName')

    let statusLog = localStorage.getItem('statusLog')
    let token = localStorage.getItem('token')
    let user = localStorage.getItem('user')
    let currentUser = user ? JSON.parse(user) : null
    let nomeUser = currentUser ? currentUser.nome : ''
    console.log('nome: ', nomeUser)
    console.log('statusLog', statusLog)

    if (adminUserName && nomeUser) {
        adminUserName.textContent = `Olá, ${nomeUser} (${currentUser.tipo_usuario})`
    }

    if (token && currentUser && currentUser.tipo_usuario === 'ADMIN') {

        consProd.addEventListener('click', (e) => {
            e.preventDefault()

            let nome = document.getElementById('nome').value.trim()

            if (!nome) {
                resProd.innerHTML = 'Digite o nome do produto para buscar.'
                resProd.className = 'admin-message error'
                return
            }

            const valores = {
                nome: nome
            }

            console.log('Buscando produto:', valores)

            fetch(`http://localhost:3000/produto/buscar`,{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(valores)
            })
            .then(resp => {
                console.log('Response status:', resp.status)
                return resp.json()
            })
            .then(dados => {
                console.log('Response data:', dados)
                if(dados.erro) {
                    resProd.innerHTML = dados.erro
                    resProd.className = 'admin-message error'
                } else {
                    resProd.innerHTML = `
                        <div style="text-align: left; line-height: 1.6;">
                            <h3 style="margin-bottom: 15px; color: #28a745;">Produto Encontrado</h3>
                            <p><strong>Código:</strong> ${dados.codProduto}</p>
                            <p><strong>Nome:</strong> ${dados.nome}</p>
                            <p><strong>Modelo:</strong> ${dados.modelo}</p>
                            <p><strong>Categoria:</strong> ${dados.categoria}</p>
                            <p><strong>Marca:</strong> ${dados.marca}</p>
                            <p><strong>Descrição:</strong> ${dados.descricao || 'N/A'}</p>
                            <p><strong>Preço:</strong> R$ ${parseFloat(dados.preco).toFixed(2)}</p>
                            <p><strong>Status:</strong> <span class="${dados.ativo ? 'admin-status active' : 'admin-status inactive'}">${dados.ativo ? 'Ativo' : 'Inativo'}</span></p>
                        </div>
                    `
                    resProd.className = 'admin-message success'
                }
            })
            .catch((err) => {
                console.error('Erro ao consultar o produto', err)
                resProd.innerHTML = 'Erro ao consultar produto: ' + err.message
                resProd.className = 'admin-message error'
            })
        })
    } else {
        location.href = '../index.html'
    }
})

