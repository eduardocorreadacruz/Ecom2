document.addEventListener('DOMContentLoaded', () => {
    let resProd = document.getElementById('resProd')
    let resTabela = document.getElementById('resTabela')
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
        // Load products
        loadProdutos()

        delProd.addEventListener('click', (e) => {
            e.preventDefault()

            let codProduto = Number(document.getElementById('codProduto').value)

            if(!codProduto) {
                resProd.innerHTML = 'Selecione um produto da lista ou digite o código.'
                resProd.className = 'admin-message error'
                return
            }

            if(!confirm('Tem certeza que deseja desativar este produto? Ele será ocultado da loja mas permanecerá no histórico de pedidos.')) {
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
                resProd.innerHTML = dados.mensagem || 'Produto desativado com sucesso!'
                resProd.className = 'admin-message success'
                loadProdutos() // Reload the list
                document.getElementById('codProduto').value = '' // Clear the form
            })
            .catch((err) => {
                console.error('Erro ao desativar o produto', err)
                resProd.innerHTML = 'Erro ao desativar produto'
                resProd.className = 'admin-message error'
            })
        })
    } else {
        location.href = '../index.html'
    }

    function loadProdutos() {
        fetch(`http://localhost:3000/produto`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(resp => resp.json())
        .then(produtos => {
            console.log('Produtos carregados:', produtos)
            resTabela.innerHTML = ''
            if (produtos.length === 0) {
                resTabela.innerHTML = '<p class="no-products">Nenhum produto ativo encontrado.</p>'
                return
            }
            resTabela.innerHTML += `<table class="admin-table">${gerarTabela(produtos)}</table>`
        })
        .catch((err) => {
            console.error('Erro ao listar os produtos', err)
            resTabela.innerHTML = '<p class="error">Erro ao carregar produtos.</p>'
        })
    }

    function gerarTabela(produtos) {
        let thead = `
        <thead>
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Modelo</th>
                <th>Categoria</th>
                <th>Marca</th>
                <th>Preço</th>
                <th>Ação</th>
            </tr>
        </thead>
        `
        let tbody = `<tbody>`

        produtos.forEach(produto => {
            tbody += `
            <tr>
                <td>${produto.codProduto}</td>
                <td>${produto.nome}</td>
                <td>${produto.modelo}</td>
                <td>${produto.categoria}</td>
                <td>${produto.marca}</td>
                <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
                <td>
                    <button class="select-btn" onclick="selecionarProduto(${produto.codProduto})">
                        <i class="fas fa-mouse-pointer"></i> Selecionar
                    </button>
                </td>
            </tr>
            `
        })

        tbody += `</tbody>`

        return thead + tbody
    }
})

// Global function for onclick
function selecionarProduto(codProduto) {
    document.getElementById('codProduto').value = codProduto
    // Scroll to form
    document.querySelector('.admin-form').scrollIntoView({ behavior: 'smooth' })
}


