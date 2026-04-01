/**
 * Normaliza un texto removiendo acentos, espacios y convirtiéndolo a minúsculas
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Descompone caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remueve diacríticos
    .replace(/\s+/g, ''); // Remueve espacios
}

/**
 * Verifica si una subsecuencia existe en un texto normalizado
 * Ejemplo: "aarre" existe en "arequipe" porque está en secuencia
 */
export function matchesSubsequence(text: string, subsequence: string): boolean {
  let textIdx = 0;
  let subIdx = 0;

  while (textIdx < text.length && subIdx < subsequence.length) {
    if (text[textIdx] === subsequence[subIdx]) {
      subIdx++;
    }
    textIdx++;
  }

  return subIdx === subsequence.length;
}

/**
 * Búsqueda mejorada que soporta:
 * - Palabras individuales
 * - Subsecuencias (fuzzy match)
 * - Normalización automática (sin acentos, espacios, mayúsculas)
 */
export function enhancedSearch(text: string, query: string): boolean {
  if (!text || !query) return false;

  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);

  // Si es vacío después de normalizar
  if (!normalizedQuery) return false;

  // 1. Búsqueda exacta (contiene la cadena completa)
  if (normalizedText.includes(normalizedQuery)) {
    return true;
  }

  // 2. Búsqueda por palabras individuales
  const words = normalizedQuery.split(/\s+/).filter(w => w.length > 0);
  if (words.length > 0) {
    const allWordsMatch = words.every(word => normalizedText.includes(word));
    if (allWordsMatch) {
      return true;
    }
  }

  // 3. Búsqueda por subsecuencias (fuzzy match)
  if (matchesSubsequence(normalizedText, normalizedQuery)) {
    return true;
  }

  return false;
}

/**
 * Calcula un score de relevancia para ordenar resultados
 * Mayor score = mejor coincidencia
 */
export function getSearchScore(text: string, query: string): number {
  if (!text || !query) return 0;

  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return 0;

  let score = 0;

  // Búsqueda exacta: máxima puntuación
  if (normalizedText === normalizedQuery) {
    return 1000;
  }

  // Contiene la cadena completa
  if (normalizedText.includes(normalizedQuery)) {
    score += 100;
  }

  // Comienza con la cadena
  if (normalizedText.startsWith(normalizedQuery)) {
    score += 50;
  }

  // Palabras individuales
  const words = normalizedQuery.split(/\s+/).filter(w => w.length > 0);
  const matchedWords = words.filter(word => normalizedText.includes(word)).length;
  score += matchedWords * 10;

  // Subsecuencia
  if (matchesSubsequence(normalizedText, normalizedQuery)) {
    score += 5;
  }

  // Bonus por longitud de coincidencia
  score += Math.min(normalizedText.length / normalizedQuery.length, 2) * 10;

  return score;
}
