# 🧱 1. E-commerce API (em desenvolvimento)

Uma API modular para autenticação, cadastro e gestão de usuários, construída com arquitetura escalável, organizada e preparada para crescimento contínuo.

---

# 🧩 2. Descrição

Este projeto tem como objetivo fornecer a base de um sistema de e-commerce moderno, iniciando pelo módulo de **usuários, autenticação e autorização**, permitindo:

- Cadastro de usuários
- Login com validação de credenciais
- Emissão de token JWT para sessões autenticadas
- Organização do código em camadas independentes
- Estrutura flexível para evolução futura

## 🎯 Problema que resolve

API em Node.js quando cresce sem organização pode sofrer com:

- Controllers cheios e difíceis de manter
- Regras de negócio misturadas com lógica HTTP
- Código com alto acoplamento
- Dificuldade de testar e dar manutenção

Este projeto separa responsabilidades em camadas, facilitando:

- Reutilização
- Testes unitários
- Evolução de funcionalidades
- Compreensão do fluxo completo

---

# ⚙️ 3. Tecnologias Utilizadas

- Node.js
- Express.js
- Sequelize (ORM)
- MySQL / MariaDB
- JWT
- bcrypt
- dotenv
- Postman (testes)
- (futuramente) HTML/CSS/JS para o front

---

# 📁 4. Estrutura de Pastas do Projeto

A estrutura segue uma arquitetura em camadas mantendo funções bem separadas.

```
backend/
├─ index.js
├─ src/
│  ├─ server/
│  ├─ routes/
│  ├─ controllers/
│  ├─ services/
│  ├─ models/
│  ├─ utils/
│  └─ db/
```

---

# 🔁 5. Fluxo de Execução da Aplicação

Quando uma requisição HTTP chega, o fluxo segue:

```
Rota (routes/)
   ↓
Controller (controllers/)
   ↓
Service (services/)
   ↓
Model (models/)
   ↓
Banco de Dados
```

### 📌 Papel de cada camada

- **routes/**  
  Define endpoints e encaminha para o controller correto.

- **controllers/**  
  Recebem dados HTTP, validam o necessário e chamam os serviços.  
  Não possuem regras de negócio.

- **services/**  
  Contêm regras de negócio (Use Cases), como:

  - validar senha
  - gerar token
  - chamar o model
  - aplicar validações de domínio

- **models/**  
  Acessam o banco de dados via Sequelize.

- **db/**  
  Configuração da conexão com MySQL/MariaDB.

- **utils/**  
  Funções auxiliares como:

  - validação
  - bcrypt
  - JWT
  - formatações

Essa estrutura reduz acoplamento e facilita evolução.

---

# 🏛 6. Arquitetura do Projeto

Este projeto **não utiliza o MVC clássico**, pois no MVC tradicional:

- Controllers podem crescer e acumular lógica
- Models podem misturar regras de domínio com persistência
- Escalar para sistemas maiores se torna complexo

## ✔ O que foi adotado

Utilizamos uma **Arquitetura em Camadas com Service Layer**, inspirada na:

> **Clean Architecture de Robert C. Martin (Uncle Bob)**

Aplicada de forma prática ao Node.js.

Isso pode ser descrito como:

> *Clean Architecture modular baseada em camadas*

### Benefícios

- Baixo acoplamento
- Facilita testes
- Escalável para domínios maiores
- Separação clara de responsabilidades

---

# 💡 7. Princípios Relacionados (SOLID)

Alguns princípios aplicados:

### **S — Single Responsibility Principle**
Cada arquivo tem apenas uma responsabilidade.  
Services cuidam da regra de negócio, controllers apenas recebem requisições.

### **O — Open/Closed Principle**
O sistema permite extensão sem alteração de blocos existentes.

### **D — Dependency Inversion Principle**
Camadas de alto nível (como Service) não dependem diretamente de detalhes internos (como banco).

---

# 🔒 8. Autenticação e Autorização

A API inclui:

- Cadastro de usuário
- Login com e-mail e senha
- Hash de senha com **bcrypt**
- Token JWT contendo:
  - id
  - email
  - tipo de usuário

Rotas protegidas exigem envio:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

---

# 💾 9. Como Rodar o Projeto

### 1️⃣ Clonar o repositório

```
git clone SEU_REPO.git
```

### 2️⃣ Instalar dependências

```
npm install
```

### 3️⃣ Configurar `.env`

Exemplo:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=senha
DB_NAME=ecommerce
JWT_SECRET=SUA_CHAVE_SECRETA
```

### 4️⃣ Rodar sincronização do Sequelize (se aplicável)

### 5️⃣ Iniciar servidor

```
npm start
```

---

# 🧪 10. Como Testar no Postman

### Cadastro

`POST /usuario`

Body exemplo:

```json
{
  "nome": "Carlos",
  "email": "carlos@gmail.com",
  "telefone": "11999999999",
  "cpf": "52998224725",
  "senha": "123"
}
```

### Login

`POST /auth/login`

Após login bem-sucedido, o token JWT será retornado.

### Salvando token automaticamente no Postman

```js
let body = pm.response.json();

if (body.token) {
    pm.environment.set("jwt", body.token);
}
```

---

# 📚 11. Referências

## Sobre Clean Architecture

- **EngSoftModerna — “Construindo Sistemas com uma Arquitetura Limpa”**  
  https://engsoftmoderna.info/artigos/arquitetura-limpa.html

- **Medium — “Fundamentos da Clean Architecture” (Niltone Apontes)**  
  https://niltoneapontes.medium.com/fundamentos-da-clean-architecture-020eda7f8da1

- **Zup Blog — “Clean Architecture para Desenvolvedores”**  
  https://zup.com.br/blog/clean-architecture-arquitetura-limpa/

Essas referências explicam fundamentos, camadas e como escalar sistemas limpos.

---

# 💬 12. Autor & Licença

Projeto mantido por **Carlos Roberto da Silva Filho**

Distribuído sob a **Licença MIT**, permitindo:

- uso comercial
- modificação
- redistribuição

com apenas obrigatoriedade de manter o aviso de copyright.

---
