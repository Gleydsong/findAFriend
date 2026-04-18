# FindAFriend API

API REST para adoção de pets com cadastro de ORGs, autenticação JWT e busca de animais por cidade com filtros opcionais.

## Stack

- TypeScript
- Fastify
- Prisma ORM
- PostgreSQL
- Vitest
- Docker Compose

## Requisitos

- Node.js 20+
- Docker / Docker Compose

## Configuração

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env` com base no exemplo:

```bash
cp .env.example .env
```

3. Suba o PostgreSQL:

```bash
npm run db:up
```

4. Sincronize o schema Prisma:

```bash
npm run prisma:push
```

5. Gere o Prisma Client:

```bash
npm run prisma:generate
```

## Executando

```bash
npm run dev
```

API disponível em `http://localhost:3333`.

## Testes

```bash
npm test
npm run test:e2e
npm run test:coverage
```

## Rotas

### ORGs

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/orgs` | Cadastra uma ORG |
| POST | `/sessions` | Autentica uma ORG e retorna um JWT |

### Pets

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/orgs/pets` | Cadastra um pet para a ORG autenticada |
| GET | `/pets?city=Sao%20Paulo` | Lista pets por cidade com filtros opcionais |
| GET | `/pets/:id` | Retorna detalhes do pet com contato da ORG |

## Filtros de busca

Todos os filtros abaixo sao opcionais, exceto `city`:

- `age`: `PUPPY`, `ADULT`, `SENIOR`
- `size`: `SMALL`, `MEDIUM`, `LARGE`
- `energyLevel`: `LOW`, `MEDIUM`, `HIGH`
- `independence`: `LOW`, `MEDIUM`, `HIGH`
- `environment`: `SMALL`, `MEDIUM`, `LARGE`

## Variáveis de ambiente

```env
NODE_ENV=development
PORT=3333
DATABASE_URL="postgresql://docker:docker@localhost:55432/findafriend?schema=public"
JWT_SECRET="findafriend-dev-secret"
```
