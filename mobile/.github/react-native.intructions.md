# React Native - Melhores Práticas e Guidelines

## 📱 Estrutura de Projeto

### Organização de Pastas
- **app/**: Telas e navegação (usando Expo Router)
- **components/**: Componentes reutilizáveis
- **services/**: APIs, Firebase, e integrações externas
- **types/**: TypeScript interfaces e types
- **constants/**: Configurações, temas e valores fixos
- **hooks/**: Custom hooks reutilizáveis
- **utils/**: Funções utilitárias

### Convenção de Nomenclatura
- **Componentes**: PascalCase (ex: `UserProfile.tsx`)
- **Hooks**: camelCase com prefixo "use" (ex: `useAuth.ts`)
- **Arquivos de estilo**: mesmo nome do componente + `.styles.ts`
- **Types/Interfaces**: PascalCase com prefixo "I" para interfaces (ex: `IUserData`)

## 🎨 Estilos e UI

### StyleSheet vs Styled Components
- Prefira `StyleSheet.create()` para performance
- Separe estilos em arquivo dedicado quando complexo
- Use constantes para cores, espaçamentos e fontes
- Evite estilos inline em JSX (prejudica performance)

```typescript
// ✅ Bom
import { styles } from './styles';
<View style={styles.container} />

// ❌ Evitar
<View style={{ padding: 20, backgroundColor: '#fff' }} />
```

### Responsividade
- Use dimensões relativas (%, Dimensions API)
- Implemente escalas para diferentes tamanhos de tela
- Teste em múltiplos dispositivos e orientações

## ⚡ Performance

### Otimização de Renderização
- Use `React.memo()` para componentes funcionais
- Implemente `useMemo()` e `useCallback()` quando apropriado
- Evite funções anônimas em props de listas
- Use `FlatList` ou `SectionList` para listas longas (suportam virtualização)

```typescript
// ✅ Bom
const MemoizedItem = React.memo(({ item }) => <Text>{item.name}</Text>);

// FlatList com otimizações
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <MemoizedItem item={item} />}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
/>
```

### Imagens
- Use dimensões fixas sempre que possível
- Implemente cache de imagens
- Considere formatos otimizados (WebP)
- Use `resizeMode` apropriado

## 🔒 TypeScript

### Tipagem Forte
- Sempre defina tipos para props e state
- Evite `any` - use `unknown` se necessário
- Crie interfaces para dados de API
- Use tipos utilitários do TypeScript

```typescript
// ✅ Bom
interface IUserProfileProps {
  userId: string;
  onPress?: () => void;
}

const UserProfile: React.FC<IUserProfileProps> = ({ userId, onPress }) => {
  // ...
};
```

## 🔄 Estado e Dados

### Gerenciamento de Estado
- Use `useState` para estado local simples
- `useReducer` para lógica de estado complexa
- Context API para estado global leve
- Considere Redux/Zustand para apps grandes

### Async Operations
- Use `useEffect` corretamente (sempre limpe side effects)
- Implemente loading e error states
- Trate erros de rede adequadamente

```typescript
// ✅ Bom
const [data, setData] = useState<IUserData | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  let isMounted = true;
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await api.getUser();
      if (isMounted) setData(result);
    } catch (err) {
      if (isMounted) setError(err.message);
    } finally {
      if (isMounted) setLoading(false);
    }
  };
  
  fetchData();
  
  return () => { isMounted = false; };
}, []);
```

## 🔐 Segurança

- Nunca armazene credenciais em código
- Use variáveis de ambiente (.env)
- Implemente autenticação segura (JWT, OAuth)
- Valide inputs do usuário
- Use HTTPS para todas as requisições

## 📦 Dependências

### Gerenciamento de Pacotes
- Mantenha dependências atualizadas
- Remova pacotes não utilizados
- Verifique licenças de bibliotecas
- Use versões específicas (evite `^` em produção)

## 🧪 Testes

- Escreva testes para lógica crítica
- Use Jest + React Native Testing Library
- Teste componentes, hooks e utils
- Mock serviços externos

## 🚀 Build e Deploy

### Otimizações de Produção
- Habilite ProGuard/R8 (Android)
- Configure app signing adequadamente
- Otimize bundle size
- Implemente over-the-air updates (Expo Updates/CodePush)

## 📱 Navegação

### Expo Router / React Navigation
- Use tipagem para rotas
- Implemente deep linking
- Configure header e tab navigation apropriadamente
- Gerencie estado de navegação corretamente

## ♿ Acessibilidade

- Adicione `accessibilityLabel` em elementos interativos
- Use `accessibilityRole` e `accessibilityHint`
- Teste com leitores de tela
- Garanta contraste adequado de cores

## 🔧 Debugging

- Use Reactotron para debugging
- Configure Flipper para inspeção
- Implemente logging apropriado
- Use error boundaries

## 📝 Boas Práticas Gerais

1. **Código Limpo**: Funções pequenas, uma responsabilidade por função
2. **Componentização**: Componentes reutilizáveis e compostos
3. **Comentários**: Apenas quando necessário, código deve ser auto-explicativo
4. **Constantes**: Extraia valores mágicos para constantes nomeadas
5. **Validação**: Valide props com TypeScript e PropTypes se necessário
6. **Formatação**: Use ESLint e Prettier
7. **Git**: Commits pequenos e descritivos, use conventional commits

## 🔥 Firebase (Específico do Projeto)

- Configure regras de segurança adequadamente
- Use Firebase Authentication para autenticação
- Implemente offline persistence quando apropriado
- Monitore uso e custos no console

## 🎯 Padrões de Código

```typescript
// ✅ Componente bem estruturado
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { styles } from './styles';

interface IMyComponentProps {
  title: string;
  onComplete?: () => void;
}

export const MyComponent: React.FC<IMyComponentProps> = ({ title, onComplete }) => {
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Setup e cleanup
    return () => {
      // Cleanup
    };
  }, []);
  
  if (loading) {
    return <ActivityIndicator />;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};
```

---

**Lembre-se**: Código é lido mais vezes do que escrito. Priorize clareza e manutenibilidade!