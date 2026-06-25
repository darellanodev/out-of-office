// tree-exclude.js (ESM)
import fs from 'fs'
import path from 'path'

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd()
const maxDepth = process.argv[3] ? Number(process.argv[3]) : 8
const outFile = process.argv[4]

const excludeDirNames = new Set(['node_modules', '.git'])

function safeReadDir(p) {
  try {
    return fs.readdirSync(p, { withFileTypes: true })
  } catch {
    return []
  }
}

function formatEntry(name, branch, indent) {
  return indent + branch + name
}

const lines = []
lines.push(root)

function showTree(currentPath, depth, indent = '') {
  if (depth > maxDepth) return

  const entries = safeReadDir(currentPath)
    .filter((e) => !(e.isDirectory() && excludeDirNames.has(e.name)))
    .sort((a, b) => a.name.localeCompare(b.name))

  entries.forEach((e, idx) => {
    const isLast = idx === entries.length - 1
    const branch = isLast ? '└─ ' : '├─ '
    const name = e.isDirectory() ? `${e.name}/` : e.name

    lines.push(formatEntry(name, branch, indent))

    if (e.isDirectory()) {
      const nextIndent = indent + (isLast ? '   ' : '│  ')
      showTree(path.join(currentPath, e.name), depth + 1, nextIndent)
    }
  })
}

showTree(root, 1)

const output = lines.join('\n')
console.log(output)

if (outFile) {
  fs.writeFileSync(outFile, output, 'utf8')
}
