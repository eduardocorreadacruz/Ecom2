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

            let nome = document.getElementById('nome').value

            const valores = {
                nome: nome
            }

            fetch(`http://localhost:3000/produto/buscar`,{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(valores)
            })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)
                if(dados.erro) {
                    resProd.innerHTML = dados.erro
                    resProd.className = 'admin-message error'
                } else {
                    resProd.innerHTML = `
                        <strong>Código:</strong> ${dados.codProduto}<br>
                        <strong>Nome:</strong> ${dados.nome}<br>
                        <strong>Modelo:</strong> ${dados.modelo}<br>
                        <strong>Categoria:</strong> ${dados.categoria}<br>
                        <strong>Marca:</strong> ${dados.marca}<br>
                        <strong>Descrição:</strong> ${dados.descricao || 'N/A'}<br>
                        <strong>Preço:</strong> R$ ${parseFloat(dados.preco).toFixed(2)}<br>
                        <strong>Ativo:</strong> ${dados.ativo ? 'Sim' : 'Não'}<br>
                    `
                    resProd.className = 'admin-message success'
                }
            })
            .catch((err) => {
                console.error('Erro ao consultar o produto', err)
                resProd.innerHTML = 'Erro ao consultar produto'
                resProd.className = 'admin-message error'
            })
        })
    } else {
        location.href = '../index.html'
    }
})

