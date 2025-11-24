document.addEventListener('DOMContentLoaded', () => {
    let resProd = document.getElementById('resProd')
    let atualProd = document.getElementById('atualProd')
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

        atualProd.addEventListener('click', (e) => {
            e.preventDefault()

            let codProduto = Number(document.getElementById('codProduto').value)
            let nome = document.getElementById('nome').value
            let descricao = document.getElementById('descricao')?.value || ''
            let modelo = document.getElementById('modelo').value
            let categoria = document.getElementById('categoria').value
            let marca = document.getElementById('marca').value
            let preco = Number(document.getElementById('preco').value)
            let imagem_url = document.getElementById('imagem_url')?.value || ''
            let ativo = document.getElementById('ativo')?.checked !== false

            const valores = {
                nome: nome,
                descricao: descricao,
                modelo: modelo,
                categoria: categoria,
                marca: marca,
                preco: preco,
                imagem_url: imagem_url,
                ativo: ativo
            }

            fetch(`http://localhost:3000/produto/${codProduto}`,{
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(valores)
            })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)
                resProd.innerHTML = dados.mensagem || 'Produto atualizado com sucesso!'
                resProd.className = 'admin-message success'
            })
            .catch((err) => {
                console.error('Erro ao atualizar o produto', err)
                resProd.innerHTML = 'Erro ao atualizar produto'
                resProd.className = 'admin-message error'
            })
        })
    } else {
        location.href = '../index.html'
    }
})


