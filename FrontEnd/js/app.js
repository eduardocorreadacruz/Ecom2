// API Configuration
const API_BASE = 'http://localhost:3000'; // Adjust if backend port is different

// Global state
let currentUser = null;
let cart = [];
let products = [];
let filteredProducts = [];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const productsGrid = document.getElementById('productsGrid');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const loginLink = document.getElementById('loginLink');
const productModal = document.getElementById('productModal');
const userInfo = document.getElementById('userInfo');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const adminPanel = document.getElementById('adminPanel');
const adminBtn = document.getElementById('adminBtn');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupEventListeners();
    checkAuthStatus();
    loadProducts();
}

// Setup event listeners
function setupEventListeners() {
    // Search
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Navigation categories
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;
            filterByCategory(category);
        });
    });

    // Cart
    cartBtn.addEventListener('click', openCart);
    document.querySelector('.cart-close').addEventListener('click', closeCart);

    // Auth
    logoutBtn.addEventListener('click', logout);

    // Checkout
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);

    // Admin
    adminBtn.addEventListener('click', () => window.open('./html/produto.html', '_blank'));

    // Close cart when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartSidebar && cartSidebar.classList.contains('open')) {
            closeCart();
        }
    });
}

// API helper functions
async function apiRequest(endpoint, options = {}) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

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


function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('statusLog');
    currentUser = null;
    cart = [];
    updateUI();
    showMessage('Logout realizado com sucesso!', 'success');
}

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
        currentUser = JSON.parse(user);
    }

    updateUI();
}

// Product functions
async function loadProducts() {
    try {
        loading.style.display = 'block';
        errorDiv.style.display = 'none';

        const data = await apiRequest('/produto');
        products = data;
        filteredProducts = [...products];

        displayProducts(filteredProducts);
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    } finally {
        loading.style.display = 'none';
    }
}

function displayProducts(productsToShow) {
    productsGrid.innerHTML = '';

    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">Nenhum produto encontrado.</p>';
        return;
    }

    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <i class="fas fa-${getProductIcon(product.categoria)}"></i>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.nome}</h3>
            <span class="product-category">${product.categoria}</span>
            <p class="product-brand">${product.marca}</p>
            <p class="product-price">R$ ${parseFloat(product.preco).toFixed(2)}</p>
            <div class="product-actions">
                <button class="add-to-cart-btn" onclick="addToCart(${product.codProduto})">
                    <i class="fas fa-cart-plus"></i>
                </button>
            </div>
        </div>
    `;
    return card;
}

function getProductIcon(category) {
    const icons = {
        'CPU': 'microchip',
        'GPU': 'tv',
        'RAM': 'memory',
        'Motherboard': 'chess-board',
        'SSD': 'hdd',
        'HDD': 'hdd',
        'PSU': 'plug',
        'Case': 'box',
        'Cooler': 'fan',
        'Monitor': 'desktop',
        'Keyboard': 'keyboard',
        'Mouse': 'mouse'
    };
    return icons[category] || 'cog';
}

function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();

    if (!query) {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product =>
            product.nome.toLowerCase().includes(query) ||
            product.marca.toLowerCase().includes(query) ||
            product.categoria.toLowerCase().includes(query)
        );
    }

    displayProducts(filteredProducts);
}

function filterByCategory(category) {
    // Update active nav link
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');

    if (category === 'all') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => product.categoria === category);
    }

    displayProducts(filteredProducts);
}

// Cart functions
function addToCart(productId) {
    if (!currentUser) {
        openModal(loginModal);
        showMessage('Faça login para adicionar produtos ao carrinho.', 'warning');
        return;
    }

    const product = products.find(p => p.codProduto === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.codProduto === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartUI();
    showMessage(`${product.nome} adicionado ao carrinho!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.codProduto !== productId);
    updateCartUI();
}

function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.codProduto === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartUI();
    }
}

function updateCartUI() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    updateCartModal();
}

function updateCartModal() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Carrinho vazio</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item-simple">
            <span>${item.nome} (x${item.quantity})</span>
            <span>R$ ${(item.preco * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

async function handleCheckout() {
    if (cart.length === 0) {
        showMessage('Seu carrinho está vazio.', 'warning');
        return;
    }

    // Store cart in localStorage for checkout page
    localStorage.setItem('cart', JSON.stringify(cart));

    // Open checkout in new tab
    window.open('html/checkout.html', '_blank');

    // Close cart sidebar
    closeCart();
}

// UI functions
function updateUI() {
    if (currentUser) {
        loginLink.style.display = 'none';
        userInfo.style.display = 'flex';
        userName.textContent = `Olá, ${currentUser.nome} (${currentUser.tipo_usuario})`;

        if (currentUser.tipo_usuario === 'ADMIN') {
            adminPanel.style.display = 'block';
        }
    } else {
        loginLink.style.display = 'inline';
        userInfo.style.display = 'none';
        adminPanel.style.display = 'none';
    }
}

function openCart() {
    updateCartModal();
    cartSidebar.classList.add('open');
}

function closeCart() {
    cartSidebar.classList.remove('open');
}

function viewProductDetails(productId) {
    const product = products.find(p => p.codProduto === productId);
    if (!product) return;

    const productDetails = document.getElementById('productDetails');
    const productModalTitle = document.getElementById('productModalTitle');

    productModalTitle.textContent = product.nome;

    productDetails.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image">
                <i class="fas fa-${getProductIcon(product.categoria)}" style="font-size: 8rem; color: #667eea;"></i>
            </div>
            <div class="product-detail-info">
                <div class="product-detail-header">
                    <h2>${product.nome}</h2>
                    <span class="product-category">${product.categoria}</span>
                    <p class="product-brand">Marca: ${product.marca}</p>
                </div>

                <div class="product-price-large">
                    <strong>R$ ${parseFloat(product.preco).toFixed(2)}</strong>
                </div>

                ${product.descricao ? `<div class="product-description">
                    <h3>Descrição</h3>
                    <p>${product.descricao}</p>
                </div>` : ''}

                ${product.especificacoes ? `<div class="product-specifications">
                    <h3>Especificações</h3>
                    <div class="specs-grid">
                        ${Object.entries(product.especificacoes).map(([key, value]) =>
                            `<div class="spec-item">
                                <strong>${key}:</strong> ${value}
                            </div>`
                        ).join('')}
                    </div>
                </div>` : ''}

                <div class="product-actions-large">
                    <button class="add-to-cart-btn-large" onclick="addToCart(${product.codProduto}); closeModal();">
                        <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </div>
    `;

    openModal(productModal);
}

function showMessage(message, type = 'info') {
    // Simple notification - in a real app, use a proper notification library
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;

    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };

    notification.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Add some CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    .notification {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
    }

    .quantity-controls button {
        width: 30px;
        height: 30px;
        border: none;
        background: #667eea;
        color: white;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .quantity-controls button:hover {
        background: #5a67d8;
    }

    .remove-btn {
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        cursor: pointer;
        margin-left: 10px;
    }

    .remove-btn:hover {
        background: #c82333;
    }

    .no-products {
        grid-column: 1 / -1;
        text-align: center;
        font-size: 1.2rem;
        color: #666;
        padding: 40px;
    }
`;
document.head.appendChild(style);