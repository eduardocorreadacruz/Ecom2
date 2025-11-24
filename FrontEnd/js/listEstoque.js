let resEst = document.getElementById('resEst')
let resTabela = document.getElementById('resTabela')
let listEstoq = document.getElementById('listEstoq')

let statusLog = localStorage.getItem('statusLog')
let nomeUser = localStorage.getItem('nome')
console.log('nome: ',nomeUser)
console.log('statusLog',statusLog)

if (statusLog === 'true') {

    listEstoq.addEventListener('click', (e) => {
        e.preventDefault()

        fetch(`http://localhost:3000/estoque?statusLog=${statusLog}`)
        .then(resp => resp.json())
        .then(dados => {
            console.log(dados)
            resTabela.innerHTML = ''
            resTabela.innerHTML += `<table>${gerarTabela(dados)}</table>`
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
            <th>Data</th>
            <th>quantidade</th>
            <th>Tipo</th>
        </tr>
    </thead>
    `
    let tbody = `<tbody>`

    dados.forEach(dad => {
        tbody += `
        <tr>
            <td>${dad.idProduto}</td>
            <td>${dad.data}</td>
            <td>${dad.qtdeMov}</td>
            <td>${dad.tipo}</td>
        </tr>        
        `
    })

    tbody += `</tbody>`

    return thead + tbody

}
