# Sistema de Búsqueda Mejorado

## Características

El sistema de búsqueda ahora soporta:

1. **Normalización Automática**: Ignora automáticamente:
   - Mayúsculas/minúsculas
   - Acentuación (á, é, í, ó, ú → a, e, i, o, u)
   - Espacios en blanco

2. **Búsqueda por Palabras Individuales**: 
   - Si buscas "carreta la", encontrará productos que contengan ambas palabras en cualquier orden

3. **Búsqueda Fuzzy (Subsecuencias)**:
   - Busca "aarre" y encuentra "arequipe" (porque a-r-r-e existe en secuencia)
   - Busca "aql" y encuentra "arequipe la carreta" (porque a-q-l existe en secuencia)

## Ejemplos de Uso

### Caso 1: Producto "Arequipe la carreta"

| Búsqueda | Resultado | Razón |
|----------|-----------|-------|
| `arequipe` | ✅ Match | Coincidencia de palabra exacta |
| `AREQUIPE` | ✅ Match | Se ignoran mayúsculas |
| `carreta` | ✅ Match | Coincidencia de palabra exacta |
| `la carreta` | ✅ Match | Ambas palabras están presentes |
| `aarre` | ✅ Match | Subsecuencia fuzzy (a-r-r-e) |
| `arre` | ✅ Match | Subsecuencia fuzzy (a-r-r-e) |
| `aql` | ✅ Match | Subsecuencia fuzzy (a-q-l en "arequipe la carreta") |
| `xyz` | ❌ No match | No existe en ninguna forma |

### Caso 2: Producto "Café con Leche"

| Búsqueda | Resultado | Razón |
|----------|-----------|-------|
| `cafe` | ✅ Match | Se ignora acentuación |
| `café` | ✅ Match | Se normaliza automáticamente |
| `cfl` | ✅ Match | Subsecuencia fuzzy (café con leche → c-f-l) |
| `con` | ✅ Match | Palabra individual |

## Ubicación de los Archivos

- **`src/utils/searchUtils.ts`**: Funciones principales de búsqueda
  - `normalizeText(text)`: Normaliza texto
  - `matchesSubsequence(text, subsequence)`: Búsqueda fuzzy
  - `enhancedSearch(text, query)`: Búsqueda principal
  - `getSearchScore(text, query)`: Calcula relevancia

- **`src/utils/serverSearchUtils.ts`**: Utilidades para búsqueda en servidor
  - `filterBySearch()`: Filtra un array
  - `filterAndRankBySearch()`: Filtra y ordena por relevancia

- **`src/server/services/get.ts`**: Servicio actualizado que usa búsqueda mejorada

- **`src/hooks/usePaginatedTable.ts`**: Hook actualizado que usa búsqueda mejorada en cliente

## Cómo Funciona

### En el Server (Next.js Actions)
```typescript
// Antes: Usa ilike de Supabase (simple)
// Ahora: Usa enhancedSearch para búsqueda inteligente

await getProducts({
  search: "aarre", // Encontrará "arequipe"
  page: 1,
  pageSize: 10
});
```

### En el Cliente (React)
```typescript
// Usa la búsqueda mejorada automáticamente
const {items, searchTerm, handleSearchChange} = usePaginatedTable({
  queryKey: 'products',
  initialData: products,
  initialTotalCount: totalCount,
  fetchFn: fetchProducts
});

// searchTerm = "aarre" → Encontrará "arequipe"
```

## Rendimiento

- **Cliente**: Búsqueda instantánea en datos locales
- **Servidor**: Búsqueda mejorada se aplica después de filtros básicos de Supabase
- Para datasets muy grandes (>10k items), considera implementar índices de búsqueda full-text en Supabase directamente
