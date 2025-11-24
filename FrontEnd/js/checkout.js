document.addEventListener('DOMContentLoaded', () => {
    const orderSummary = document.getElementById('orderSummary');
    const checkoutTotal = document.getElementById('checkoutTotal');
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutMessage = document.getElementById('checkoutMessage');
    const cepInput = document.getElementById('cep');

    // Load cart from localStorage (assuming cart is stored)
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (cart.length === 0) {
        orderSummary.innerHTML = '<p>Carrinho vazio</p>';
        checkoutTotal.textContent = '0.00';
        return;
    }

    // Display order summary
    orderSummary.innerHTML = cart.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>${item.nome} (x${item.quantity})</span>
            <span>R$ ${(item.preco * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
    checkoutTotal.textContent = total.toFixed(2);

    // ViaCEP functionality
    cepInput.addEventListener('blur', () => {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        document.getElementById('rua').value = data.logradouro;
                        document.getElementById('bairro').value = data.bairro;
                        document.getElementById('cidade').value = data.localidade;
                        document.getElementById('estado').value = data.uf;
                    } else {
                        alert('CEP não encontrado');
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar CEP:', error);
                    alert('Erro ao buscar CEP');
                });
        }
    });

    // Handle form submission
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const endereco = {
            cep: document.getElementById('cep').value,
            logradouro: document.getElementById('rua').value,
            numero: document.getElementById('numero').value,
            complemento: document.getElementById('complemento').value,
            bairro: document.getElementById('bairro').value,
            localidade: document.getElementById('cidade').value,
            uf: document.getElementById('estado').value
        };

        const pagamento = document.getElementById('pagamento').value;

        // Get token and user
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        if (!token || !user.id) {
            checkoutMessage.innerHTML = 'Erro: Usuário não autenticado';
            checkoutMessage.style.color = 'red';
            return;
        }

        // Prepare order data
        const itens = cart.map(item => ({
            idProduto: item.codProduto,
            quantidade: item.quantity
        }));

        const orderData = {
            itens,
            enderecoEntrega: endereco
        };

        try {
            const response = await fetch('http://localhost:3000/pedido', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (response.ok) {
                checkoutMessage.innerHTML = 'Pedido realizado com sucesso! Você receberá um email de confirmação.';
                checkoutMessage.style.color = 'green';
                checkoutMessage.style.marginTop = '20px';

                // Clear cart
                localStorage.removeItem('cart');

                // Redirect after 3 seconds
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 3000);
            } else {
                checkoutMessage.innerHTML = data.erro || 'Erro ao processar pedido';
                checkoutMessage.style.color = 'red';
            }
        } catch (error) {
            console.error('Erro no checkout:', error);
            checkoutMessage.innerHTML = 'Erro na conexão';
            checkoutMessage.style.color = 'red';
        }
    });
});