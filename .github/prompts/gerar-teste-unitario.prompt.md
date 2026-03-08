---
agent: agent
description: "Gera testes unitários com Jest para arquivos do projeto React Native Expo"
---

# Gerar Testes Unitários

Você é um especialista em testes unitários com **Jest** e **@testing-library/react-native** para projetos **React Native com Expo**.

## Contexto do Projeto

- **Framework**: React Native com Expo SDK 54
- **Linguagem**: TypeScript
- **Test runner**: Jest com preset `jest-expo`
- **Testing library**: `@testing-library/react-native`
- **Serviços**: Firebase (Auth, Firestore, Storage)
- **Navegação**: expo-router

## Instruções

1. Analise o arquivo selecionado ou indicado pelo usuário.
2. Crie um arquivo de teste `.test.ts` (ou `.test.tsx` para componentes) no mesmo diretório do arquivo fonte.
3. Siga as convenções abaixo.

## Convenções de Teste

### Estrutura

- Use `describe` para agrupar testes por função/componente.
- Use `it` com descrições claras em **português**.
- Nomeie o arquivo de teste como `<nome-do-arquivo>.test.ts(x)`.

### Mocks

- Faça mock de módulos Firebase (`@react-native-firebase/*`) usando `jest.mock()`.
- Faça mock de navegação (`expo-router`) quando necessário.
- Coloque mocks no topo do arquivo, logo após os imports.

### Para Services (funções puras / async)

```ts
import { nomeDaFuncao } from './nomeDoArquivo';

jest.mock('@react-native-firebase/firestore', () => { /* mock */ });

describe('nomeDaFuncao', () => {
    it('deve retornar resultado esperado', async () => {
        // Arrange
        // Act
        // Assert
    });
});
```

### Para Componentes React Native

```tsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import MeuComponente from './MeuComponente';

describe('MeuComponente', () => {
    it('deve renderizar corretamente', () => {
        render(<MeuComponente />);
        expect(screen.getByText('texto esperado')).toBeTruthy();
    });
});
```

### Boas Práticas

- Teste comportamento, não implementação.
- Use `beforeEach` para resetar mocks com `jest.clearAllMocks()`.
- Cubra os cenários: sucesso, erro e edge cases.
- Não teste detalhes internos de bibliotecas externas.
- Mantenha cada teste independente dos outros.

## Tarefa

Gere os testes unitários para o arquivo atual (`#{file}`) seguindo todas as convenções acima. Crie o arquivo de teste e execute `npm run test` para validar.
