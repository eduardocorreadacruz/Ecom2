// API Configuration
const API_BASE = 'http://localhost:3000'; // Adjust if backend port is different

// DOM Elements
const registerForm = document.getElementById('registerForm');
const resRegister = document.getElementById('resRegister');

// API helper function
async function apiRequest(endpoint, options = {}) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || data.message || 'Erro na requisição');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Handle register form submission
async function handleRegister(e) {
    e.preventDefault();

    const userData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        cpf: document.getElementById('cpf').value,
        senha: document.getElementById('senha').value
    };

    try {
        await apiRequest('/usuario', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        showMessage('Cadastro realizado com sucesso! Redirecionando para login...', 'success');

        // Redirect to login page after successful registration
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Show message function
function showMessage(message, type = 'info') {
    resRegister.className = `message ${type}`;
    resRegister.textContent = message;
    resRegister.style.display = 'block';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    registerForm.addEventListener('submit', handleRegister);
});