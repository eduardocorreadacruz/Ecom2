let resEst = document.getElementById('resEst')
let resTabela = document.getElementById('resTabela')
let cadEstoq = document.getElementById('cadEstoq')

let statusLog = localStorage.getItem('statusLog')
let nomeUser = localStorage.getItem('nome')
console.log('nome: ',nomeUser)
console.log('statusLog',statusLog)

if (statusLog === 'true') {
    onload = () => {
        fetch(`http://localhost:3000/produto?statusLog=${statusLog}`)
        .then(resp => resp.json())
        .then(dados => {
            console.log(dados)
            dados.sort((a,b)=> a.nome.localeCompare(b.nome))
            resTabela.innerHTML = ''
            resTabela.innerHTML += `<table>${gerarTabela(dados)}</table>`
        })
        .catch((err) => {
            console.error('Erro ao listar os produtos', err)
        })
    }

    cadEstoq.addEventListener('click', (e) => {
        e.preventDefault()

        let idUsuario = Number(document.getElementById('idUsuario').value)
        let idProduto = Number(document.getElementById('idProduto').value)
        let data = document.getElementById('data').value
        let tipo = document.getElementById('tipo').value
        let qtdeMov = Number(document.getElementById('qtdeMov').value)

        const valores = {
            idUsuario: idUsuario,
            idProduto: idProduto,
            data: data,
            tipo: tipo,
            qtdeMov: qtdeMov
        }

        fetch(`http://localhost:3000/estoque?statusLog=${statusLog}`,{
            method: 'POST',
            headers: { 'Content-Type':'application/json'},
            body: JSON.stringify(valores)
        })
        .then(resp => resp.json())
        .then(dados => {
            console.log(dados)
            resEst.innerHTML = ''
            resEst.innerHTML += dados.message + '   Nova quantidade: ' + dados.novaQtde
            if(dados.novaQtde === 0){
                alert('alcançado o estoque mínimo')
            }
            setTimeout(()=> location.reload(), 2000)
        })
        .catch((err) => {
            console.error('Erro ao cadastrar o estoque', err)
        })       
    })
} else {
    location.href = '../index.html'
}

function gerarTabela(dados) {
    let thead = `
    <thead>
        <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Marca</th>
            <th>quantidade</th>
            <th>Preço</th>
        </tr>
    </thead>
    `
    let tbody = `<tbody>`

    dados.forEach(dad => {
        tbody += `
        <tr>
            <td>${dad.codProduto}</td>
            <td>${dad.nome}</td>
            <td>${dad.marca}</td>
            <td>${dad.quantidade}</td>
            <td>${dad.preco}</td>
        </tr>        
        `
    })

    tbody += `</tbody>`

    return thead + tbody

}
