import { STRUCTURE_TYPES, CONTRADICTION_TYPES, STRUGGLE_TYPES } from '@/lib/taxonomy'

/**
 * Returns subtypes for a given type from the taxonomy.
 * @param {string} type - The high-level type (e.g. "Caste-Based Contradictions")
 * @param {string} dialectic - "structure", "contradiction", or "struggle"
 */
export function getSubtypes(type, dialectic) {
  switch (dialectic) {
    case 'structure':
      return STRUCTURE_TYPES[type] ? Object.keys(STRUCTURE_TYPES[type]) : []
    case 'contradiction':
      return CONTRADICTION_TYPES[type] ? Object.keys(CONTRADICTION_TYPES[type]) : []
    case 'struggle':
      return STRUGGLE_TYPES[type] ? Object.keys(STRUGGLE_TYPES[type]) : []
    default:
      return []
  }
}

/**
 * Returns sub-subtypes for a given type + subtype combo.
 * @param {string} type - Top-level type
 * @param {string} subtype - Mid-level subtype
 * @param {string} dialectic - "structure", "contradiction", or "struggle"
 */
export function getSubsubtypes(type, subtype, dialectic) {
  let source
  if (dialectic === 'structure') source = STRUCTURE_TYPES
  if (dialectic === 'contradiction') source = CONTRADICTION_TYPES
  if (dialectic === 'struggle') source = STRUGGLE_TYPES

  return source?.[type]?.[subtype] || []
}

/**
 * Returns all top-level types for a given dialectical category.
 * e.g. ["Caste-Based Contradictions", "State vs Market Contradictions"]
 */
export function getAllTopLevelTypes(dialectic) {
  switch (dialectic) {
    case 'structure':
      return Object.keys(STRUCTURE_TYPES)
    case 'contradiction':
      return Object.keys(CONTRADICTION_TYPES)
    case 'struggle':
      return Object.keys(STRUGGLE_TYPES)
    default:
      return []
  }
}