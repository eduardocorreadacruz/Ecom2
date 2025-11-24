let resUsuario = document.getElementById('resUsuario')
let cadUsuario = document.getElementById('cadUsuario')

cadUsuario.addEventListener('click',(e)=>{
    e.preventDefault()

    let nome = document.getElementById('nome').value
    let email = document.getElementById('email').value
    let senha = document.getElementById('senha').value

    const valores = {
        nome: nome,
        email: email, 
        senha: senha
    }

    fetch(`http://localhost:3000/usuario`,{
        method: 'POST',
        headers: { 'Content-Type':'application/json'},
        body: JSON.stringify(valores)
    })
    .then(resp => resp.json())
    .then(dados => {
        console.log(dados)
        resUsuario.innerHTML = ''
        resUsuario.innerHTML += `Nome: ${dados.nome} email:${dados.email}<br>`
    })
    .catch((err)=>{
        console.error('Erro ao cadastrar o usuáiro',err)
    })
})