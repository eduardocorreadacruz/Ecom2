// Configuração de ambiente para a aplicação
const ENV_CONFIG = {
    // URLs do backend em diferentes ambientes
    LOCAL: 'http://localhost:3000',
    DEVELOPMENT: 'https://seu-backend-dev.railway.app', // URL de desenvolvimento
    PRODUCTION: 'https://seu-backend-production.railway.app' // URL de produção
    
    // Como usar:
    // 1. Obtenha a URL do seu projeto Railway após o deploy
    // 2. Substitua as URLs acima pelas URLs reais
    // 3. Remova as URLs que não usar
};

// Função para detectar o ambiente atual
function getEnvironment() {
    const hostname = window.location.hostname;
    
    // Detecta se está rodando localmente
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'LOCAL';
    }
    
    // Detecta se está no Vercel (domínio padrão)
    if (hostname.includes('vercel.app')) {
        return 'PRODUCTION';
    }
    
    // Para outros casos, assume produção
    return 'PRODUCTION';
}

// Função para obter a URL da API baseada no ambiente
function getApiBaseUrl() {
    const environment = getEnvironment();
    const config = ENV_CONFIG[environment];
    
    if (!config || config.includes('seu-backend')) {
        console.warn('⚠️ Configuração de API não encontrada ou não atualizada!');
        console.warn('Por favor, atualize as URLs no arquivo config.js');
    }
    
    return config || ENV_CONFIG.LOCAL; // Fallback para localhost
}

// Exporta a API_BASE para ser usada no app.js
window.API_BASE = getApiBaseUrl();

console.log('🌍 Ambiente detectado:', getEnvironment());
console.log('🔗 URL da API:', window.API_BASE);