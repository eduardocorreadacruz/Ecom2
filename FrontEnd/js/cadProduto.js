document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault()
    
    let resProd = document.getElementById('resProd')
    let resTabela = document.getElementById('resTabela')
    let resEstoque = document.getElementById('resEstoque')
    let cadProd = document.getElementById('cadProd')
    let adminUserName = document.getElementById('adminUserName')
    let estoqueForm = document.getElementById('estoqueForm')

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
        // Load products with stock info
        Promise.all([
            fetch(`http://localhost:3000/produto`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then(resp => resp.json()),
            fetch(`http://localhost:3000/estoque`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then(resp => resp.json())
        ])
        .then(([produtos, estoques]) => {
            console.log('Produtos:', produtos)
            console.log('Estoques:', estoques)
            resTabela.innerHTML = ''
            resTabela.innerHTML += `<table class="admin-table">${gerarTabela(produtos, estoques)}</table>`
        })
        .catch((err) => {
            console.error('Erro ao listar os produtos', err)
        })

        // Add product event
        cadProd.addEventListener('click', (e) => {
            e.preventDefault()

            let nome = document.getElementById('nome').value
            let descricao = document.getElementById('descricao')?.value || ''
            let modelo = document.getElementById('modelo').value
            let categoria = document.getElementById('categoria').value
            let marca = document.getElementById('marca').value
            let preco = Number(document.getElementById('preco').value)
            let imagem_url = document.getElementById('imagem_url')?.value || ''

            // Validation
            if (!nome || !modelo || !categoria || !marca || !preco) {
                resProd.innerHTML = 'Todos os campos obrigatórios devem ser preenchidos.'
                resProd.className = 'admin-message error'
                return
            }

            const valores = {
                nome: nome,
                descricao: descricao,
                modelo: modelo,
                categoria: categoria,
                marca: marca,
                preco: preco,
                imagem_url: imagem_url,
                ativo: true
            }

            fetch(`http://localhost:3000/produto`,{
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
                resProd.innerHTML = ''
                resProd.innerHTML += dados.mensagem || 'Produto cadastrado com sucesso!'
                resProd.className = 'admin-message success'
                setTimeout(()=> location.reload(), 2000)
            })
            .catch((err) => {
                console.error('Erro ao cadastrar o produto', err)
                resProd.innerHTML = 'Erro ao cadastrar produto'
                resProd.className = 'admin-message error'
            })
        })

        // Stock management event
        estoqueForm.addEventListener('submit', (e) => {
            e.preventDefault()

            let produtoId = document.getElementById('estoqueProdutoId').value
            let acao = document.getElementById('estoqueAcao').value
            let quantidade = document.getElementById('estoqueQuantidade').value

            if (!produtoId || !quantidade || quantidade < 1) {
                resEstoque.innerHTML = 'Preencha todos os campos corretamente.'
                resEstoque.className = 'admin-message error'
                return
            }

            const endpoint = acao === 'adicionar' ? 'adicionar' : 'remover'
            const url = `http://localhost:3000/estoque/${produtoId}/${endpoint}`

            fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantidade: parseInt(quantidade) })
            })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)
                resEstoque.innerHTML = dados.mensagem || `Estoque ${acao === 'adicionar' ? 'adicionado' : 'removido'} com sucesso!`
                resEstoque.className = 'admin-message success'
                estoqueForm.reset()
                setTimeout(() => {
                    resEstoque.innerHTML = ''
                    resEstoque.className = ''
                }, 3000)
            })
            .catch((err) => {
                console.error('Erro ao atualizar estoque', err)
                resEstoque.innerHTML = 'Erro ao atualizar estoque'
                resEstoque.className = 'admin-message error'
            })
        })
    } else {
        location.href = '../index.html'
    }
})

function gerarTabela(produtos, estoques) {
    let thead = `
    <thead>
        <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Modelo</th>
            <th>Categoria</th>
            <th>Marca</th>
            <th>Estoque</th>
            <th>Preço</th>
            <th>Ativo</th>
        </tr>
    </thead>
    `
    let tbody = `<tbody>`

    produtos.forEach(produto => {
        const estoque = estoques.find(e => e.idProduto === produto.codProduto)
        const quantidadeEstoque = estoque ? estoque.quantidade_atual : 0
        const statusClass = produto.ativo ? 'admin-status active' : 'admin-status inactive';
        const statusText = produto.ativo ? 'Ativo' : 'Inativo';

        tbody += `
        <tr>
            <td>${produto.codProduto}</td>
            <td>${produto.nome}</td>
            <td>${produto.modelo}</td>
            <td>${produto.categoria}</td>
            <td>${produto.marca}</td>
            <td>${quantidadeEstoque}</td>
            <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
        </tr>
        `
    })

    tbody += `</tbody>`

    return thead + tbody

}
