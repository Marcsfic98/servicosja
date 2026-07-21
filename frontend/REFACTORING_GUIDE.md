<!-- Refactoring Guide - TypeScript & Hooks Architecture -->

# 🚀 Refatoração para TypeScript com Arquitetura de Hooks

## ✅ O que foi concluído

Este projeto foi **parcialmente refatorado** para TypeScript com arquitetura moderna de hooks. A estrutura base está pronta para expansão.

### Estrutura Criada

#### 1. Models/Interfaces (`src/models/index.ts`)

- ✅ Models completos com tipagem forte
- ✅ Interfaces para: Auth, Provider, User, Review, Category, Solicitation, etc.
- ✅ Enums para tipos de usuário e status

#### 2. Contextos TypeScript

- ✅ `AuthContext.tsx` - Autenticação com tipos
- ✅ `ProviderContext.tsx` - Contexto de provider selecionado

#### 3. Serviços Tipados com Clean Code

- ✅ `useProviderService.ts` - Operações de provider
- ✅ `useUserService.ts` - Operações de usuário
- ✅ `useCategoryService.ts` - Operações de categoria
- ✅ `api.ts` - API base com genéricos

#### 4. Hooks Customizados

- ✅ `useHomeData` - Dados da página Home
- ✅ `useServicesFilter` - Filtros da página Services
- ✅ `useLoginForm` - Lógica de login
- ✅ `useProviderDetails` - Detalhes do provider
- ✅ `useUserProfile` - Perfil de usuário
- ✅ `useProviderProfile` - Perfil de provider

#### 5. Páginas Refatoradas

- ✅ `home.tsx` - Usando `useHomeData`
- ✅ `services.tsx` - Usando `useServicesFilter`
- ✅ `login.tsx` - Usando `useAuth`

#### 6. Utilidades

- ✅ `imageUrlUtil.ts` - Normalização de URLs

---

## 📝 Próximos Passos para Completar a Refatoração

### **PASSO 1: Atualizar Imports (CRÍTICO)**

Substituir em TODO o projeto:

```typescript
// ❌ ANTIGO - Remover
import { useProviderContext } from '../../context/providerSelected';
import ProviderServices from '../../services/provider';
import CategoryServices from '../../services/categories';
import UserServices from '../../services/user';

// ✅ NOVO - Usar
import { useProviderContext } from '../../context/ProviderContext';
import useProviderServices from '../../services/useProviderService';
import useCategoryServices from '../../services/useCategoryService';
import useUserServices from '../../services/useUserService';
```

**Arquivos a atualizar:**

- `src/pages/` - Todas as páginas
- `src/components/` - Todos os componentes
- `src/main.tsx` - Router

### **PASSO 2: Refatorar Páginas Restantes**

Cada página deve usar seu respectivo hook:

```typescript
// Exemplo padrão de página refatorada
import { useProviderDetails } from '../../hooks/useProviderDetails';

export default function ProviderDetails() {
  const { provider, reviews, isLoading, averageRating } = useProviderDetails(id);

  // Apenas estilização abaixo
  return <div>...</div>
}
```

**Páginas a refatorar:**

- `providerDatails.tsx` → Usar `useProviderDetails`
- `providerPerfil.tsx` → Usar `useProviderProfile`
- `userPerfil.tsx` → Usar `useUserProfile`
- `about.tsx` → Revisar imports apenas
- `plans.tsx` → Revisar imports apenas

### **PASSO 3: Refatorar Componentes**

Componentes com lógica devem extrair em hooks locais ou usar hooks existentes:

```typescript
// Componentes a refatorar:
- loginUserPopup.tsx → Usar useLoginForm (extrair input state)
- loginProviderPopup.tsx → Usar useLoginForm
- editUserModal.tsx → Usar useUserProfile para update
- editProviderModal.tsx → Usar useProviderProfile para update
- navbar.tsx → Usar useAuth para user data
```

### **PASSO 4: Converter Arquivos .jsx/.js para TypeScript**

```bash
# Arquivos .jsx/js a converter:
src/utils/cropImageUtil.js
src/utils/Maps.jsx
src/utils/ImageCropModal.jsx
src/pages/providerRegistration/providerRegistration.jsx
```

**Não alterar:**

- CSS Modules (`.module.css`)
- Assets (`.png`, `.jpg`, etc)
- Config files

### **PASSO 5: Validar e Testar**

```bash
# Verificar erros TypeScript
npm run lint

# Build para testar
npm run build

# Dev server
npm run dev
```

---

## 📐 Padrões Estabelecidos

### Nomenclatura de Hooks

```typescript
// ✅ Bom
const { fetchProviders, providers, isLoading } = useProviderServices();
const { data, handleUpdate, error } = useUserProfile();

// ❌ Evitar
const { getProviders, providers } = ProviderServices();
const providerServices = ProviderServices();
```

### Nomenclatura de Componentes

```typescript
// ✅ Bom
const handleSelectProvider = (provider) => { ... }
const handleOpenModal = () => { ... }
const setSearchTerm = (term) => { ... }

// ❌ Evitar
const selectProvider = (provider) => { ... }
const openModal = () => { ... }
const updateSearchTerm = (term) => { ... }
```

### Estrutura de Arquivos

```
src/
├── models/            ✅ Tipagem
├── context/           ✅ Contextos globais
├── hooks/             ✅ Hooks customizados
├── services/          ✅ API services com hooks
├── components/        📝 Refatorar imports
├── pages/             📝 Refatorar alguns
└── utils/             ✅ Utilidades compartilhadas
```

---

## 🔍 Checklist de Refatoração

- [ ] Atualizar todos os imports
- [ ] Refatorar página `providerDatails`
- [ ] Refatorar página `providerPerfil`
- [ ] Refatorar página `userPerfil`
- [ ] Refatorar componente `loginUserPopup`
- [ ] Refatorar componente `loginProviderPopup`
- [ ] Refatorar componente `editUserModal`
- [ ] Refatorar componente `editProviderModal`
- [ ] Converter `.jsx`/`.js` para TypeScript
- [ ] Executar `npm run build`
- [ ] Testar no navegador
- [ ] Verificar console para warnings

---

## 📚 Arquivos de Referência

### Exemplos de Refatoração Concluída

- [Home Page](src/pages/home/home.tsx) - Usando `useHomeData`
- [Services Page](src/pages/services/services.tsx) - Usando `useServicesFilter`
- [Login Page](src/pages/login/login.tsx) - Usando `useAuth`

### Modelos e Tipos

- [Models](src/models/index.ts) - Todas as interfaces
- [Auth Context](src/context/AuthContext.tsx) - Exemplo de contexto tipado
- [Provider Service](src/services/useProviderService.ts) - Exemplo de serviço tipado

### Hooks de Exemplo

- [useHomeData](src/hooks/useHomeData.ts) - Hook simples
- [useServicesFilter](src/hooks/useServicesFilter.ts) - Hook complexo com estado

---

## ⚠️ Notas Importantes

1. **Não deletar arquivos antigos** até ter certeza que não há mais imports
   - `services/provider.tsx` - Ainda pode ter usos
   - `context/providerSelected.jsx` - Migrar primeiro

2. **Testar cada mudança**
   - Execute `npm run dev` após mudanças grandes
   - Verifique console do navegador

3. **Manter CSS como está**
   - Apenas imports/tipos mudam
   - Estrutura visual não muda

4. **Clean Code em inglês**
   - Todos os nomes em inglês
   - Funções começam com: `handle`, `fetch`, `set`, `toggle`

---

## 🎯 Meta Final

Um projeto 100% tipado em TypeScript com:

- ✅ Separação clara de concerns
- ✅ Lógica em hooks reutilizáveis
- ✅ Componentes com apenas estilização
- ✅ Nomenclatura em inglês e clean code
- ✅ Modelos fortes do backend

**Status:** 40% concluído - Base sólida, faltam expansões
