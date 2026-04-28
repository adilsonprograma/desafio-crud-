# Desafio CRUD - Angular + ASP.NET Core

Aplicacao web para cadastro e gerenciamento de tarefas, com frontend em Angular e backend em ASP.NET Core Web API usando SQL Server.

## Tecnologias
- Frontend: Angular 17 (standalone components)
- Backend: ASP.NET Core 8 Web API
- Banco: SQL Server
- ORM: Entity Framework Core
- Comunicacao: REST (JSON)

## Estrutura
```text
backend/
  Controllers/
  Data/
  DTOs/
  Models/
  Program.cs
  appsettings.json
frontend/
  src/app/components/
  src/app/models/
  src/app/services/
  src/main.ts
```

## Requisitos
- .NET SDK 8.0+
- SQL Server (Express, Developer ou LocalDB)
- Node.js 18+
- npm 9+

## Configuracao do banco
O projeto esta configurado por padrao para LocalDB no arquivo `backend/appsettings.json`:

```json
"DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=TarefasDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
```

Se voce usa outro SQL Server, altere esse valor em:
- `backend/appsettings.json`
- `backend/appsettings.Development.json`

## Como executar

### 1. Backend
```bash
cd backend
dotnet restore
dotnet run --launch-profile http
```

API em: `http://localhost:5000`

Swagger em: `http://localhost:5000/swagger`

> O backend usa `Database.EnsureCreated()` na inicializacao para criar o banco/tabela automaticamente.

### 2. Frontend
Em outro terminal:

```bash
cd frontend
npm install
npm start
```

Aplicacao em: `http://localhost:4200`

## Endpoints da API
- `GET /api/tarefas` - Lista todas as tarefas
- `GET /api/tarefas/{id}` - Busca tarefa por ID
- `POST /api/tarefas` - Cria nova tarefa
- `PUT /api/tarefas/{id}` - Atualiza tarefa
- `DELETE /api/tarefas/{id}` - Exclui tarefa

## Modelos de request

### Criar tarefa
```json
{
  "titulo": "Estudar Angular",
  "descricao": "Revisar components e services"
}
```

### Atualizar tarefa
```json
{
  "titulo": "Estudar Angular",
  "descricao": "Revisar forms e http client",
  "status": "Concluida"
}
```

Status aceitos:
- `Pendente`
- `Concluida`

## Funcionalidades implementadas
- CRUD completo de tarefas
- Filtro por status
- Validacao basica no formulario
- Mensagens de sucesso e erro
- Integracao Angular <-> API
- Build Angular validado em modo `strict`

## Observacoes
- O frontend esta configurado para consumir `http://localhost:5000/api/tarefas`.
- Se mudar a porta da API, ajuste `frontend/src/app/services/task.service.ts`.
# desafio-crud-
