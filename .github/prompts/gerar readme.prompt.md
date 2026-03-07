---
agent: agent
description: "Gerar o readme com base nas informações do projeto, como nome, descrição, tecnologias usadas, instruções de instalação e uso."
---

# Gerar Testes Unitários

Você é um especialista em escrever uma documentação em  **markdown** para o meu projeto.

## Contexto do Projeto

- **Framework**: React Native com Expo SDK 54
- **Linguagem**: TypeScript
- **Test runner**: Jest com preset `jest-expo`
- **Testing library**: `@testing-library/react-native`
- **Serviços**: Firebase (Auth, Firestore, Storage)
- **Navegação**: expo-router

## Instruções

1. Criar conforme o modelo abaixo um arquivo `README.md` para o projeto, utilizando as informações do contexto acima. O readme deve conter as seguintes seções:

```markdown
# 🧠 Projeto Hackathon — Pós FIAP

Este é um projeto feito com para mobile e web afim de atender necessidades cognitivas.

## 👨‍💻 Autores do projeto 

- [@Adler Coelho](https://www.linkedin.com/in/adlercoelhosantos/)
- [@Erick Nunes](https://www.linkedin.com/in/erick-nunes-bb81a9136/)
- [@Robson Rodrigues](https://www.linkedin.com/in/robson-rodrigues-ribeiro/)
- [@Virgílio Cano](https://www.linkedin.com/in/virgiliocano/)

## Estruturação da aplicação

```
// mobile
  ├── /apps
  │   ├── /root-config (Orquestração com Single-SPA ::9000)
  │   ├── /login (React ::8501)
  │   ├── /dashboard (React ::8500)
  │   ├── /transfers (React ::8502)
  │   ├── /api (NodeJs + Express ::3000)
  ├── /libs
  │   ├── /api-client (React ::8504)
  ├── /packages
  │   ├── /ui (React ::8503)
// web
  ├── /apps
  │   ├── /root-config (Orquestração com Single-SPA ::9000)
  │   ├── /login (React ::8501)
  │   ├── /dashboard (React ::8500)
  │   ├── /transfers (React ::8502)
  │   ├── /api (NodeJs + Express ::3000)
  ├── /libs
  │   ├── /api-client (React ::8504)
  ├── /packages
  │   ├── /ui (React ::8503)  
```

### Detalhes para a aplicação Web
...

### Detalhes para a aplicação Mobile

- Node 22+
- Faça o clone desse projeto
- Dentro da pasta do projeto, execute ```npm i -f```
- Para subir as aplicações, execute ```npm run android```

## Contribuindo

Contribuições são bem-vindas! Abra uma issue ou envie um pull request.

## Licença

Este projeto está sob a licença MIT.
```
