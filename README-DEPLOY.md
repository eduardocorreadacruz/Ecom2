# 🚀 Guia de Deploy - Frontend Vercel + Backend Railway

## ✅ Configuração Atual

O frontend já está configurado para funcionar com ambos os ambientes:

### 📁 Arquivos Modificados:
- **`config.js`**: Nova configuração de ambiente automática
- **`app.js`**: Removida configuração fixa de API_BASE
- **`index.html`**: Adicionado carregamento do config.js

### 🔧 Como Funciona:

1. **Em Desenvolvimento (localhost)**:
   - Detecta automaticamente `localhost` ou `127.0.0.1`
   - Usa `http://localhost:3000`

2. **Em Produção (Vercel)**:
   - Detecta domínio `vercel.app`
   - Usa a URL do seu projeto Railway

---

## 📋 Passos para Deploy

### 1️⃣ Backend no Railway
- ✅ Já está funcionando no Railway
- ⚠️ **IMPORTANTE**: Anote a URL do seu projeto Railway

### 2️⃣ Configurar URLs no config.js
Edite o arquivo `config.js` e atualize as URLs:

```javascript
const ENV_CONFIG = {
    LOCAL: 'http://localhost:3000',
    DEVELOPMENT: 'https://seu-backend-dev.railway.app', // ← Substitua pela URL real
    PRODUCTION: 'https://seu-backend-production.railway.app' // ← Substitua pela URL real
};
```

### 3️⃣ Deploy Frontend no Vercel

#### Opção A: Deploy via Git (Recomendado)
1. Faça push do código para o GitHub
2. Conecte o repositório no Vercel
3. Configure as variáveis de ambiente se necessário

#### Opção B: Deploy Manual
1. Instale a CLI do Vercel: `npm install -g vercel`
2. Navegue até a pasta `FrontEnd`
3. Execute: `vercel --prod`

---

## 🔍 Verificação Pós-Deploy

### Teste no Navegador:
1. Abra o site no Vercel
2. Abra as Ferramentas de Desenvolvedor (F12)
3. Vá para a aba "Console"
4. Procure pelas mensagens:
   ```
   🌍 Ambiente detectado: PRODUCTION
   🔗 URL da API: https://seu-backend-production.railway.app
   ```

### Teste de Funcionalidades:
- ✅ Carregamento de produtos
- ✅ Login/Cadastro
- ✅ Adição ao carrinho
- ✅ Checkout

---

## 🚨 Solução de Problemas

### Erro: "Configuração de API não encontrada"
**Solução**: Atualize as URLs no `config.js`

### Erro: "CORS" ou "Network Error"
**Possíveis Causas**:
1. URL da API incorreta no `config.js`
2. Backend não está rodando
3. Problema de CORS no Railway

### Erro: "401 Unauthorized"
**Solução**: Verifique se o token JWT está sendo enviado corretamente

---

## 🔄 Atualizações Futuras

Para mudar a URL do backend:
1. Edite `config.js`
2. Atualize a URL соответствующая (DEVELOPMENT ou PRODUCTION)
3. Faça novo deploy se necessário

---

## 📞 Suporte

Se tiver dúvidas:
- Verifique o console do navegador para logs de debug
- Confirme se o backend está rodando no Railway
- Teste a URL da API diretamente no navegador

---

## 🎯 Resumo Final

✅ **Frontend preparado para deploy**  
✅ **Detecção automática de ambiente**  
✅ **Configuração flexível via config.js**  
⚠️ **Precisa atualizar URLs reais no config.js**  
⚠️ **Deploy manual necessário**

O código está pronto! Só precisa atualizar as URLs do Railway no `config.js` e fazer o deploy no Vercel.