document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault()
    
    let resProd = document.getElementById('resProd')
    let resTabela = document.getElementById('resTabela')
    let cadProd = document.getElementById('cadProd')
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
        fetch(`http://localhost:3000/produto`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(resp => resp.json())
        .then(dados => {
            console.log(dados)
            resTabela.innerHTML = ''
            resTabela.innerHTML += `<table class="admin-table">${gerarTabela(dados)}</table>`
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
    } else {
        location.href = '../index.html'
    }
})

function gerarTabela(dados) {
    let thead = `
    <thead>
        <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Modelo</th>
            <th>Categoria</th>
            <th>Marca</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Ativo</th>
        </tr>
    </thead>
    `
    let tbody = `<tbody>`

    dados.forEach(dad => {
        const statusClass = dad.ativo ? 'admin-status active' : 'admin-status inactive';
        const statusText = dad.ativo ? 'Ativo' : 'Inativo';
        tbody += `
        <tr>
            <td>${dad.codProduto}</td>
            <td>${dad.nome}</td>
            <td>${dad.modelo}</td>
            <td>${dad.categoria}</td>
            <td>${dad.marca}</td>
            <td>${dad.descricao || '-'}</td>
            <td>R$ ${parseFloat(dad.preco).toFixed(2)}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
        </tr>
        `
    })

    tbody += `</tbody>`

    return thead + tbody

}
