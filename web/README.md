## MindEase Web

Aplicação web do MindEase, uma plataforma para organização de projetos e tarefas com foco em bem-estar, utilizando **React**, **TypeScript**, **Vite**, **Material UI** e **Tailwind CSS**.

### Scripts principais

- **Instalar dependências**
  - `npm install`

- **Rodar em desenvolvimento**
  - `npm run dev`

- **Build para produção**
  - `npm run build`

- **Pré-visualizar build**
  - `npm run preview`

### Estrutura básica

- **`src/pages`**: telas principais da aplicação
  - `Login` / `Register`: autenticação
  - `Home`: overview com atalhos para Tarefas, Modo Foco e Preferências
  - `Projects`: gerenciamento de projetos
  - `Tasks`: kanban de tarefas com integração ao Pomodoro
  - `Preferences`: preferências visuais e modos de uso

- **`src/components`**: componentes reutilizáveis
  - `SideNav`: navegação lateral autenticada
  - `PomodoroWidget` e `PomodoroControls`: timer de foco
  - `Icon`: coleção de ícones utilizados nas telas
  - `buttons` e `inputs`: componentes de formulário padronizados

- **`src/api`**: comunicação com backend / Firebase (auth, projetos, tarefas).

### Tecnologias

- **React + TypeScript**
- **Vite** para bundling e desenvolvimento rápido
- **Material UI (MUI)** para componentes de interface
- **Tailwind CSS** para utilitários de layout e espaçamento
- Integração com **Firebase** (auth e dados) via camada de API em `src/api`.

### Como começar

1. Entre na pasta `web`:
   - `cd web`
2. Instale as dependências:
   - `npm install`
3. Configure variáveis de ambiente (Firebase, etc.) conforme o README raiz ou documentação interna.
4. Rode o projeto:
   - `npm run dev`
5. Acesse no navegador o endereço exibido no terminal (por padrão, algo como `http://localhost:5173`).

### Fluxo de uso

- Crie uma conta ou faça login.
- Na **Home**, navegue rapidamente para:
  - **Projetos/Tarefas**: criar projetos e tarefas organizadas em kanban.
  - **Modo Foco (Pomodoro)**: iniciar ciclos de foco a partir das tarefas.
  - **Preferências**: ajustar modos de visualização e foco.