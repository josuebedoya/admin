/**
 * Ejemplos y pruebas del sistema de búsqueda mejorado
 * Este archivo muestra cómo funciona la búsqueda con diferentes casos
 */

import { normalizeText, matchesSubsequence, enhancedSearch, getSearchScore } from '@/utils/searchUtils';

// Test 1: Normalización
console.log('=== TEST 1: NORMALIZACIÓN ===');
console.log(normalizeText('Arequipe')); // 'arequipe'
console.log(normalizeText('CAFÉ')); // 'cafe'
console.log(normalizeText('La Carreta')); // 'lacarreta'

// Test 2: Subsecuencias (Fuzzy)
console.log('\n=== TEST 2: SUBSECUENCIAS (FUZZY) ===');
console.log(matchesSubsequence('arequipe', 'aarre')); // true
console.log(matchesSubsequence('arequipelacarreta', 'aql')); // true
console.log(matchesSubsequence('cafe', 'cfl')); // false
console.log(matchesSubsequence('cafeconleche', 'cfl')); // true

// Test 3: Búsqueda Completa
console.log('\n=== TEST 3: BÚSQUEDA COMPLETA ===');
console.log(enhancedSearch('Arequipe La Carreta', 'arequipe')); // true
console.log(enhancedSearch('Arequipe La Carreta', 'aarre')); // true - fuzzy
console.log(enhancedSearch('Arequipe La Carreta', 'la carreta')); // true - palabras
console.log(enhancedSearch('Arequipe La Carreta', 'xyz')); // false

// Test 4: Scoring (Relevancia)
console.log('\n=== TEST 4: SCORING (RELEVANCIA) ===');
const producto = 'Arequipe La Carreta';
console.log('Score "arequipe":', getSearchScore(producto, 'arequipe')); // Alto (palabra exacta)
console.log('Score "aarre":', getSearchScore(producto, 'aarre')); // Medio (fuzzy)
console.log('Score "la":', getSearchScore(producto, 'la')); // Bajo (palabra corta)

// Test 5: Casos Reales
console.log('\n=== TEST 5: CASOS REALES ===');
const productos = [
  'Café Colombiano Premium',
  'Arequipe La Carreta',
  'Chocolate con Leche',
  'Galletas Integrales',
  'Leche Descremada'
];

function testSearch(query: string) {
  console.log(`\nBúsqueda: "${query}"`);
  const resultados = productos
    .map(p => ({ producto: p, score: getSearchScore(p, query), match: enhancedSearch(p, query) }))
    .filter(r => r.match)
    .sort((a, b) => b.score - a.score);
  
  if (resultados.length === 0) {
    console.log('  ❌ Sin resultados');
  } else {
    resultados.forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.producto} (score: ${r.score})`);
    });
  }
}

testSearch('cafe'); // Encontrará "Café Colombiano Premium"
testSearch('cfl'); // Encontrará "Café Colombiano Premium", "Chocolate con Leche"
testSearch('leche'); // Encontrará "Chocolate con Leche", "Leche Descremada"
testSearch('aql'); // Encontrará "Arequipe La Carreta"
testSearch('xyz'); // Sin resultados
