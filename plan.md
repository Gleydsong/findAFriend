# Plano de Implementação — FindAFriend API

## Visão Geral

API REST para sistema de adoção de animais, seguindo princípios SOLID com testes automatizados.

**Stack:** TypeScript, Fastify, Prisma ORM, PostgreSQL, Vitest, Docker Compose

**Status:** implementado. Ajuste adicional feito no carregamento de ambiente para que Prisma e aplicação usem `.env` quando existir, com fallback para `.env.example` no setup local.

## Arquitetura

Padrão **Repository + Use Case** para respeitar SOLID:

```
src/
├── @types/              # Tipos globais (ex: fastify.d.ts)
├── env/                 # Validação de variáveis de ambiente (zod)
│   └── index.ts
├── lib/                 # Instâncias compartilhadas (prisma client)
│   └── prisma.ts
├── repositories/        # Contratos e implementações de acesso a dados
│   ├── orgs-repository.ts              (interface)
│   ├── pets-repository.ts              (interface)
│   ├── prisma/
│   │   ├── prisma-orgs-repository.ts
│   │   └── prisma-pets-repository.ts
│   └── in-memory/
│       ├── in-memory-orgs-repository.ts
│       └── in-memory-pets-repository.ts
├── use-cases/           # Regras de negócio
│   ├── create-org.ts
│   ├── authenticate-org.ts
│   ├── create-pet.ts
│   ├── fetch-pets-by-city.ts
│   ├── get-pet-details.ts
│   ├── errors/
│   │   ├── org-already-exists-error.ts
│   │   ├── invalid-credentials-error.ts
│   │   └── resource-not-found-error.ts
│   └── factories/
│       ├── make-create-org.ts
│       ├── make-authenticate-org.ts
│       ├── make-create-pet.ts
│       ├── make-fetch-pets-by-city.ts
│       └── make-get-pet-details.ts
├── http/
│   ├── controllers/
│   │   ├── orgs/
│   │   │   ├── register.ts
│   │   │   ├── authenticate.ts
│   │   │   └── routes.ts
│   │   └── pets/
│   │       ├── create.ts
│   │       ├── search.ts
│   │       ├── details.ts
│   │       └── routes.ts
│   └── middlewares/
│       └── verify-jwt.ts
├── app.ts               # Configuração do Fastify (plugins, rotas)
└── server.ts            # Ponto de entrada (listen)
```

## Modelo de Dados (Prisma)

```prisma
model Org {
  id            String   @id @default(uuid())
  name          String
  email         String   @unique
  password_hash String
  address       String
  city          String
  state         String
  cep           String
  whatsapp      String
  created_at    DateTime @default(now())

  pets Pet[]
}

model Pet {
  id              String   @id @default(uuid())
  name            String
  about           String
  age             String       // filhote, adulto, idoso
  size            String       // pequeno, médio, grande
  energy_level    String       // baixa, média, alta
  independence    String       // baixo, médio, alto
  environment     String       // amplo, médio, pequeno
  photos          String[]
  requirements    String[]
  created_at      DateTime @default(now())

  org    Org    @relation(fields: [org_id], references: [id])
  org_id String
}
```

## Endpoints da API

### ORGs

| Método | Rota      | Descrição     | Auth |
| ------ | --------- | ------------- | ---- |
| POST   | /orgs     | Cadastrar ORG | Não  |
| POST   | /sessions | Login (JWT)   | Não  |

### Pets

| Método | Rota       | Descrição                        | Auth |
| ------ | ---------- | -------------------------------- | ---- |
| POST   | /orgs/pets | Cadastrar pet                    | Sim  |
| GET    | /pets      | Listar pets por cidade + filtros | Não  |
| GET    | /pets/:id  | Detalhes de um pet               | Não  |

## Regras de Negócio

1. Cidade obrigatória para listar pets
2. ORG deve ter endereço e WhatsApp
3. Pet sempre vinculado a uma ORG
4. Contato de adoção via WhatsApp da ORG
5. Filtros de pet (exceto cidade) são opcionais
6. Acesso administrativo requer login da ORG

## Fases de Implementação

### Fase 1 — Setup do Projeto

- Configurar TypeScript, ESLint, tsup
- Configurar Fastify e variáveis de ambiente (zod)
- Docker Compose para PostgreSQL
- Configurar Prisma ORM com schema inicial
- Configurar Vitest
- Fazer testes unicos e unitarios

### Fase 2 — Módulo de ORGs

- Interface `OrgsRepository`
- `InMemoryOrgsRepository`
- Use case `CreateOrg` (com hash de senha via bcryptjs)
- Use case `AuthenticateOrg`
- Testes unitários dos use cases
- `PrismaOrgsRepository`
- Controllers HTTP (register, authenticate)
- Testes E2E das rotas

### Fase 3 — Módulo de Pets

- Interface `PetsRepository` (com método de busca por cidade + filtros)
- `InMemoryPetsRepository`
- Use case `CreatePet`
- Use case `FetchPetsByCity` (cidade obrigatória, filtros opcionais)
- Use case `GetPetDetails`
- Testes unitários dos use cases
- `PrismaPetsRepository`
- Controllers HTTP (create, search, details)
- Middleware `verifyJwt` para rotas protegidas
- Testes E2E das rotas

### Fase 4 — Finalização

- Revisão geral de SOLID
- Documentação de rotas (README ou Swagger)
- Verificação de cobertura de testes
