# 🧠 MindEase — Projeto Hackathon Pós FIAP

Este é um projeto feito para **mobile** e **web** a fim de atender necessidades cognitivas. O app oferece gerenciamento de projetos e tarefas com um sistema integrado de **Pomodoro Timer**, ajudando o usuário a organizar e executar suas atividades de forma produtiva.

## 👨‍💻 Autores do projeto

- [@Adler Coelho](https://www.linkedin.com/in/adlercoelhosantos/)
- [@Erick Nunes](https://www.linkedin.com/in/erick-nunes-bb81a9136/)
- [@Robson Rodrigues](https://www.linkedin.com/in/robson-rodrigues-ribeiro/)
- [@Virgílio Cano](https://www.linkedin.com/in/virgiliocano/)

## 🚀 Funcionalidades

- **Autenticação** — Login e registro via Firebase Auth (e-mail/senha)
- **Projetos** — CRUD completo de projetos com timestamps
- **Tarefas** — Gerenciamento de tarefas por projeto em visualização kanban
- **Pomodoro Timer** — Temporizador customizável com ciclos, música de fundo e alertas sonoros
- **Histórico Pomodoro** — Registro e consulta de sessões realizadas
- **Preferências** — Configurações de tema, som e comportamento do app
- **Perfil** — Gerenciamento de nome e avatar do usuário

## 🛠️ Tech Stack

| Camada | Tecnologia |
|---|---|
| Framework | React Native 0.81 + Expo SDK 54 |
| Linguagem | TypeScript 5.9 |
| Navegação | Expo Router 6 |
| Backend | Firebase 23 (Auth, Firestore, Storage, Crashlytics) |
| UI | Lucide React Native, Reanimated 4, Gesture Handler |
| Áudio | Expo AV |
| Testes | Jest 29 + Testing Library React Native 13 |

## 📂 Estruturação da aplicação

```
// mobile
mobile/
  ├── app/
  │   ├── _layout.tsx              # Layout raiz (providers, toast, task timer global)
  │   ├── index.tsx                # Entry — verifica auth e redireciona
  │   ├── (screens)/
  │   │   ├── home/                # Tela principal com tabs
  │   │   ├── login/               # Autenticação
  │   │   ├── register/            # Cadastro
  │   │   ├── projects/            # CRUD de projetos
  │   │   ├── tasks/               # Gerenciamento de tarefas (kanban)
  │   │   └── preferences/         # Configurações do usuário
  │   ├── components/              # Componentes reutilizáveis
  │   │   ├── ui/                  # Biblioteca de UI (Accordion, Button, Modal, etc.)
  │   │   ├── home/                # Componentes da Home
  │   │   ├── projects/            # Componentes de Projetos
  │   │   ├── tasks/               # Componentes de Tarefas (Timer widget, colunas)
  │   │   └── preferencesItems/    # Itens de preferências
  │   ├── services/                # Camada de serviços
  │   │   ├── firebaseAuth.ts      # Autenticação
  │   │   ├── firebaseStorage.ts   # Upload de arquivos
  │   │   ├── firestorePaths.ts    # Referências do Firestore
  │   │   ├── projects.ts          # CRUD de projetos
  │   │   ├── tasks.ts             # CRUD de tarefas
  │   │   ├── pomodoroHistory.ts   # Histórico de sessões Pomodoro
  │   │   ├── pomodoroSettings.ts  # Configurações do Pomodoro
  │   │   ├── preferences.ts       # Preferências do usuário
  │   │   ├── soundService.ts      # Reprodução de áudio
  │   │   └── eventBus.ts          # Pub/Sub entre componentes
  │   ├── hooks/                   # Custom hooks (tema, cores)
  │   ├── constants/               # Constantes (theme)
  │   ├── styles/                  # Estilos compartilhados
  │   ├── types/                   # Tipos TypeScript
  │   └── interface/               # Interfaces/tipos de componentes
  ├── assets/
  │   ├── audios/                  # Sons (pomodoro_done.mp3, música)
  │   └── images/                  # Imagens e ícones
  └── utils/                       # Utilitários

// web
web/
  └── (em desenvolvimento)
```

## 🔀 Fluxo de Navegação

```
Index (Verifica Auth)
├── Não logado → Login / Register
└── Logado → Home (Tabs)
    ├── Pomodoro (Timer, Histórico, Configurações)
    ├── Projetos (Lista, Criar, Editar, Detalhe)
    ├── Tarefas (Board Kanban, Criar, Editar, Detalhe)
    ├── Preferências
    └── Perfil + Menu
```

## ⚙️ Como rodar

### Pré-requisitos

- Node 22+
- Java 17+ (para build Android)
- Android Studio com emulador configurado ou dispositivo físico

### Detalhes para a aplicação Web

> Em desenvolvimento.

### Detalhes para a aplicação Mobile

1. Faça o clone desse projeto:
   ```bash
   git clone https://github.com/seu-usuario/pos-fiap-FRNT-hackathon.git
   ```

2. Acesse a pasta do projeto mobile:
   ```bash
   cd pos-fiap-FRNT-hackathon/mobile
   ```

3. Instale as dependências:
   ```bash
   npm i -f
   ```

4. Inicie o app no Android:
   ```bash
   npm run android
   ```

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm start` | Inicia o Expo Dev Server |
| `npm run android` | Compila e roda no Android |
| `npm run ios` | Compila e roda no iOS |
| `npm run web` | Inicia versão web (Expo) |
| `npm run lint` | Executa ESLint |
| `npm test` | Executa testes com Jest |

## 🧪 Testes

O projeto utiliza **Jest** com o preset `jest-expo` e **Testing Library React Native** para testes unitários.

```bash
cd mobile
npm test
```

Os testes cobrem serviços (Firebase Auth, Firestore, Storage), hooks, componentes e utilitários.

## Contribuindo

Contribuições são bem-vindas! Abra uma issue ou envie um pull request.

## Licença

Este projeto está sob a licença MIT.
