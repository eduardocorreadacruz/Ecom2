document.addEventListener('DOMContentLoaded', () => {
    let resProd = document.getElementById('resProd')
    let delProd = document.getElementById('delProd')
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

        delProd.addEventListener('click', (e) => {
            e.preventDefault()

            let codProduto = Number(document.getElementById('codProduto').value)

            if(!confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita!')) {
                return
            }

            fetch(`http://localhost:3000/produto/${codProduto}`,{
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type':'application/json'
                }
            })
            .then(resp => resp.json())
            .then(dados => {
                resProd.innerHTML = dados.mensagem || 'Produto excluído com sucesso!'
                resProd.className = 'admin-message success'
            })
            .catch((err) => {
                console.error('Erro ao apagar o produto', err)
                resProd.innerHTML = 'Erro ao excluir produto'
                resProd.className = 'admin-message error'
            })
        })
    } else {
        location.href = '../index.html'
    }
})


