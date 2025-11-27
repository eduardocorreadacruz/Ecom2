document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault()
    
    let resProd = document.getElementById('resProd')
    let resTabela = document.getElementById('resTabela')
    let resTabelaInativos = document.getElementById('resTabelaInativos')
    let resEstoque = document.getElementById('resEstoque')
    let resReativar = document.getElementById('resReativar')
    let cadProd = document.getElementById('cadProd')
    let adminUserName = document.getElementById('adminUserName')
    let estoqueForm = document.getElementById('estoqueForm')
    let reativarForm = document.getElementById('reativarForm')

    let statusLog = localStorage.getItem('statusLog')
    let token = localStorage.getItem('token')
    let user = localStorage.getItem('user')
    let currentUser = user ? JSON.parse(user) : null
    let nomeUser = currentUser ? currentUser.nome : ''
    console.log('nome: ', nomeUser)
    console.log('statusLog', statusLog)

    // Functions to load products
    function loadProdutosAtivos() {
        fetch(`http://localhost:3000/produto`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(resp => resp.json())
        .then(produtos => {
            console.log('Produtos ativos:', produtos)
            resTabela.innerHTML = ''
            if (produtos.length === 0) {
                resTabela.innerHTML = '<p class="no-products">Nenhum produto ativo encontrado.</p>'
                return
            }
            resTabela.innerHTML += `<table class="admin-table">${gerarTabela(produtos)}</table>`
        })
        .catch((err) => {
            console.error('Erro ao listar produtos ativos', err)
            resTabela.innerHTML = '<p class="error">Erro ao carregar produtos ativos.</p>'
        })
    }

    function loadProdutosInativos() {
        fetch(`http://localhost:3000/produto?status=inativos`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(resp => resp.json())
        .then(produtos => {
            console.log('Produtos inativos:', produtos)
            resTabelaInativos.innerHTML = ''
            if (produtos.length === 0) {
                resTabelaInativos.innerHTML = '<p class="no-products">Nenhum produto inativo encontrado.</p>'
                return
            }
            resTabelaInativos.innerHTML += `<table class="admin-table">${gerarTabelaInativos(produtos)}</table>`
        })
        .catch((err) => {
            console.error('Erro ao listar produtos inativos', err)
            resTabelaInativos.innerHTML = '<p class="error">Erro ao carregar produtos inativos.</p>'
        })
    }

    if (adminUserName && nomeUser) {
        adminUserName.textContent = `Olá, ${nomeUser} (${currentUser.tipo_usuario})`
    }

    if (token && currentUser && currentUser.tipo_usuario === 'ADMIN') {
        // Load active and inactive products
        loadProdutosAtivos()
        loadProdutosInativos()

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
            console.log('Form submitted')

            let produtoId = document.getElementById('estoqueProdutoId').value
            let acao = document.getElementById('estoqueAcao').value
            let quantidade = document.getElementById('estoqueQuantidade').value

            console.log('Values:', { produtoId, acao, quantidade })

            if (!produtoId || !quantidade || quantidade < 1) {
                resEstoque.innerHTML = 'Preencha todos os campos corretamente.'
                resEstoque.className = 'admin-message error'
                return
            }

            const endpoint = acao === 'adicionar' ? 'adicionar' : 'remover'
            const url = `http://localhost:3000/estoque/${produtoId}/${endpoint}`
            console.log('URL:', url)

            fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantidade: parseInt(quantidade) })
            })
            .then(resp => {
                console.log('Response status:', resp.status)
                return resp.json()
            })
            .then(dados => {
                console.log('Response data:', dados)
                if (dados.erro) {
                    resEstoque.innerHTML = dados.erro
                    resEstoque.className = 'admin-message error'
                } else {
                    resEstoque.innerHTML = dados.mensagem || `Estoque ${acao === 'adicionar' ? 'adicionado' : 'removido'} com sucesso!`
                    resEstoque.className = 'admin-message success'
                    estoqueForm.reset()
                    setTimeout(() => {
                        resEstoque.innerHTML = ''
                        resEstoque.className = ''
                    }, 3000)
                }
            })
            .catch((err) => {
                console.error('Erro ao atualizar estoque', err)
                resEstoque.innerHTML = 'Erro ao atualizar estoque: ' + err.message
                resEstoque.className = 'admin-message error'
            })
        })

        // Reactivate product event
        reativarForm.addEventListener('submit', (e) => {
            e.preventDefault()

            let produtoId = document.getElementById('reativarProdutoId').value

            if (!produtoId) {
                resReativar.innerHTML = 'Digite o código do produto.'
                resReativar.className = 'admin-message error'
                return
            }

            fetch(`http://localhost:3000/produto/${produtoId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ativo: true })
            })
            .then(resp => resp.json())
            .then(dados => {
                console.log('Reativação:', dados)
                if (dados.erro) {
                    resReativar.innerHTML = dados.erro
                    resReativar.className = 'admin-message error'
                } else {
                    resReativar.innerHTML = dados.mensagem || 'Produto reativado com sucesso!'
                    resReativar.className = 'admin-message success'
                    reativarForm.reset()
                    // Reload both lists
                    loadProdutosAtivos()
                    loadProdutosInativos()
                    setTimeout(() => {
                        resReativar.innerHTML = ''
                        resReativar.className = ''
                    }, 3000)
                }
            })
            .catch((err) => {
                console.error('Erro ao reativar produto', err)
                resReativar.innerHTML = 'Erro ao reativar produto'
                resReativar.className = 'admin-message error'
            })
        })
    } else {
        location.href = '../index.html'
    }
})

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
            <th>Ativo</th>
        </tr>
    </thead>
    `
    let tbody = `<tbody>`

    produtos.forEach(produto => {
        const statusClass = produto.ativo ? 'admin-status active' : 'admin-status inactive';
        const statusText = produto.ativo ? 'Ativo' : 'Inativo';

        tbody += `
        <tr>
            <td>${produto.codProduto}</td>
            <td>${produto.nome}</td>
            <td>${produto.modelo}</td>
            <td>${produto.categoria}</td>
            <td>${produto.marca}</td>
            <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
        </tr>
        `
    })

    tbody += `</tbody>`

    return thead + tbody

}

function gerarTabelaInativos(produtos) {
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
                <button class="select-btn" onclick="selecionarProdutoInativo(${produto.codProduto})">
                    <i class="fas fa-undo"></i> Reativar
                </button>
            </td>
        </tr>
        `
    })

    tbody += `</tbody>`

    return thead + tbody

}

// Global function for inactive product selection
function selecionarProdutoInativo(codProduto) {
    document.getElementById('reativarProdutoId').value = codProduto
    // Scroll to reactivation form
    document.querySelector('#reativarForm').scrollIntoView({ behavior: 'smooth' })
}
