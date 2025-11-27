# TechParts E-Commerce - Sistema Completo

Um sistema completo de e-commerce para venda de peças de computador, desenvolvido com arquitetura moderna e escalável.

## Visão Geral

O TechParts é uma plataforma completa de e-commerce que inclui:

- **Frontend**: Interface responsiva para clientes e administradores
- **Backend**: API RESTful com autenticação JWT
- **Banco de Dados**: MySQL/MariaDB com relacionamentos complexos
- **Funcionalidades**: Catálogo de produtos, carrinho de compras, checkout, gestão de estoque, painel administrativo

## Funcionalidades

### Usuários
- Cadastro e login de usuários
- Autenticação JWT
- Perfis de usuário (Cliente/Administrador)
- Validação de CPF

### Produtos
- Catálogo completo de peças de computador
- Categorias: CPU, GPU, RAM, Placa-Mãe, SSD, HDD, Fonte, Gabinete, Cooler
- Pesquisa e filtros por categoria
- Detalhes técnicos dos produtos
- Imagens e descrições

### Carrinho e Checkout
- Carrinho de compras persistente
- Sistema de checkout completo
- Cálculo automático de frete
- Validação de estoque em tempo real
- Endereço de entrega com ViaCEP

### Gestão de Estoque
- Controle de quantidade por produto
- Alertas de estoque baixo
- Movimentação de entrada/saída
- Integração automática com vendas

### Painel Administrativo
- Gestão completa de produtos (CRUD)
- Controle de estoque
- Gerenciamento de pedidos
- Relatórios e estatísticas

### Pedidos
- Histórico completo de pedidos
- Rastreamento de status
- Detalhes de entrega
- Validação de estoque antes da venda

## Arquitetura

### Backend
```
backend/
├── src/
│   ├── controllers/     # Controladores HTTP
│   ├── services/        # Regras de negócio
│   ├── models/          # Modelos de dados (Sequelize)
│   ├── routes/          # Definição de rotas
│   ├── middlewares/     # Middlewares de autenticação/autorização
│   ├── utils/           # Utilitários (JWT, validação, criptografia)
│   ├── db/              # Configuração do banco
│   └── server/          # Configuração do Express
├── index.js            # Ponto de entrada
├── index_local.js      # Versão local (desenvolvimento)
└── sync.js            # Sincronização do banco
```

### Frontend
```
frontend/
├── index.html          # Página principal (catálogo)
├── css/
│   ├── style.css       # Estilos principais
│   └── admin.css       # Estilos do painel admin
├── js/
│   ├── app.js          # Lógica da página principal
│   ├── checkout.js     # Lógica do checkout
│   └── cadProduto.js   # Gestão de produtos (admin)
└── html/
    ├── login.html      # Login
    ├── register.html   # Cadastro
    ├── produto.html    # Gestão de produtos
    ├── checkout.html   # Checkout
    └── outros...
```

## Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para banco de dados
- **MySQL/MariaDB** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Hash de senhas
- **CORS** - Controle de acesso cross-origin

### Frontend
- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização responsiva
- **JavaScript (ES6+)** - Interatividade
- **Font Awesome** - Ícones

### Desenvolvimento
- **Postman** - Testes de API
- **Git** - Controle de versão
- **VS Code** - Ambiente de desenvolvimento

## Modelo de Dados

### Principais Tabelas

#### Usuários (`usuarios`)
```sql
- codUsuario (PK)
- nome
- email
- telefone
- cpf
- senha (hash)
- tipo_usuario (CLIENTE/ADMIN)
- ativo
- createdAt/updatedAt
```

#### Produtos (`produtos`)
```sql
- codProduto (PK)
- nome
- modelo
- categoria
- marca
- descricao
- preco
- imagem_url
- ativo
- createdAt/updatedAt
```

#### Estoque (`estoques`)
```sql
- codEstoque (PK)
- idProduto (FK → produtos)
- quantidade_atual
- quantidade_minima
- createdAt/updatedAt
```

#### Pedidos (`pedidos`)
```sql
- codPedido (PK)
- idUsuario (FK → usuarios)
- valorSubtotal
- valorFrete
- valorTotal
- status
- createdAt/updatedAt
```

#### Itens do Pedido (`itens_pedidos`)
```sql
- codItemPedido (PK)
- idPedido (FK → pedidos)
- idProduto (FK → produtos)
- quantidade
- precoUnitario
- valorTotalItem
```

#### Entregas (`entregas`)
```sql
- codEntrega (PK)
- idPedido (FK → pedidos)
- cep
- logradouro
- numero
- complemento
- bairro
- localidade
- uf
```

## API Endpoints

### Autenticação
```
POST   /auth/login           # Login de usuário
POST   /usuario              # Cadastro de usuário
```

### Produtos
```
GET    /produto               # Listar produtos
POST   /produto               # Criar produto (ADMIN)
PUT    /produto/:id           # Atualizar produto (ADMIN)
DELETE /produto/:id           # Deletar produto (ADMIN)
```

### Pedidos
```
GET    /pedido                # Listar pedidos do usuário
POST   /pedido                # Criar pedido
GET    /pedido/:id            # Detalhes do pedido
PATCH  /pedido/:id/status     # Atualizar status (ADMIN)
GET    /pedido/admin/todos    # Listar todos os pedidos (ADMIN)
```

### Estoque
```
GET    /estoque               # Listar estoques (ADMIN)
GET    /estoque/:idProduto    # Estoque de produto específico
POST   /estoque/:idProduto/adicionar  # Adicionar estoque
POST   /estoque/:idProduto/remover    # Remover estoque
```

## Como Executar

### Pré-requisitos
- Node.js (v14+)
- MySQL/MariaDB
- npm ou yarn

### 1. Clonagem e Instalação
```bash
git clone <seu-repositorio>
cd ecom/BackEnd
npm install
```

### 2. Configuração do Banco
```bash
# Criar banco de dados MySQL
CREATE DATABASE ecom;

# Configurar variáveis de ambiente (.env)
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=ecom
JWT_SECRET=sua_chave_secreta_super_segura
```

### 3. Sincronização do Banco
```bash
# Executar sincronização das tabelas
node sync.js
```

### 4. Executar o Servidor
```bash
# Produção
npm start

# Desenvolvimento (com nodemon)
npm run dev
```

### 5. Acessar o Sistema
- **Frontend**: Abrir `FrontEnd/index.html` no navegador
- **API**: `http://localhost:3000`
- **Admin**: Acesse com usuário do tipo ADMIN

## Testando a API

### Exemplo: Cadastro de Usuário
```bash
POST http://localhost:3000/usuario
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "11999999999",
  "cpf": "52998224725",
  "senha": "senha123"
}
```

### Exemplo: Login
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

### Exemplo: Criar Produto (ADMIN)
```bash
POST http://localhost:3000/produto
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json

{
  "nome": "Placa de Vídeo RTX 3060",
  "modelo": "RTX 3060",
  "categoria": "GPU",
  "marca": "NVIDIA",
  "preco": 2999.99,
  "ativo": true
}
```

## Interface do Usuário

### Página Principal
- Catálogo de produtos com filtros por categoria
- Barra de pesquisa
- Carrinho de compras
- Menu de usuário

### Painel Administrativo
- Gestão de produtos (CRUD)
- Controle de estoque
- Visualização de pedidos
- Relatórios

### Processo de Compra
1. Navegação no catálogo
2. Adição ao carrinho
3. Checkout com endereço
4. Confirmação do pedido

## Segurança

- **Hash de Senhas**: bcrypt para armazenamento seguro
- **JWT Tokens**: Autenticação stateless
- **Validações**: CPF, dados obrigatórios
- **Middleware de Autenticação**: Proteção de rotas
- **Autorização**: Controle de acesso por tipo de usuário

## Responsividade

O frontend é totalmente responsivo, funcionando perfeitamente em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## Fluxo de Dados

```
Cliente → Frontend → API → Controller → Service → Model → Banco
       ←         ←     ←          ←        ←      ←
```

## Funcionalidades Futuras

- Sistema de avaliações e comentários
- Lista de desejos (wishlist)
- Cupons de desconto
- Integração com gateways de pagamento
- Notificações por email
- Rastreamento de pedidos
- Sistema de recomendações
- Blog/notícias
- Chat de suporte

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Autor

**Eduardo Corrêa Da Cruz**

  