#!/usr/bin/env node
/**
 * Question generation script (placeholder).
 * The actual question JSON files are maintained directly in public/data/.
 * This script validates the existing question files.
 */
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '..', 'public', 'data')

const subjects = ['rbh', 'bwh', 'ikp', 'zib', 'ntg']

for (const id of subjects) {
  try {
    const raw = readFileSync(join(dataDir, `${id}.json`), 'utf-8')
    const data = JSON.parse(raw)
    const count = data.questions.length
    const valid = data.questions.every(
      (q) =>
        q.id &&
        q.text &&
        q.options?.length === 4 &&
        typeof q.correct === 'number' &&
        q.correct >= 0 &&
        q.correct <= 3 &&
        q.explanation &&
        q.difficulty >= 1 &&
        q.difficulty <= 3
    )
    console.log(`${id.toUpperCase()}: ${count} questions – ${valid ? '✓ valid' : '✗ INVALID'}`)
  } catch (e) {
    console.log(`${id.toUpperCase()}: ✗ ${e.message}`)
  }
}
