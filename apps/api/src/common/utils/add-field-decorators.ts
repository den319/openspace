import * as fs from 'fs'
import * as path from 'path'

interface PropertyInfo {
  name: string
  type: string
  isArray: boolean
  isOptional: boolean
  line: number
}

/**
 * Parse a TypeScript class and extract property information
 */
function parseClassProperties(
  content: string,
  className: string,
): PropertyInfo[] {
  const properties: PropertyInfo[] = []
  const lines = content.split('\n')

  // Find the class definition - handle both regular classes and those with implements
  const classRegex = new RegExp(
    `class\\s+${className}(?:\\s+extends\\s+[^{]+)?(?:\\s+implements\\s+[^{]+)?\\s*{`,
  )
  let classStartIndex = -1

  for (let i = 0; i < lines.length; i++) {
    if (
      classRegex.test(lines[i]) ||
      (lines[i].includes(`class ${className}`) &&
        !lines[i].trim().startsWith('//'))
    ) {
      classStartIndex = i
      break
    }
  }

  if (classStartIndex === -1) return properties

  // Find matching closing brace
  let braceCount = 0
  let inClass = false

  for (let i = classStartIndex; i < lines.length; i++) {
    const line = lines[i]

    // Count braces
    for (const char of line) {
      if (char === '{') {
        braceCount++
        inClass = true
      }
      if (char === '}') {
        braceCount--
        if (braceCount === 0 && inClass) {
          // Class ended
          return properties
        }
      }
    }

    // Skip if not in class body yet
    if (!inClass) continue

    // Check if line already has @Field decorator
    if (i > 0 && lines[i - 1].trim().startsWith('@Field')) {
      continue
    }

    // Match property declarations
    // Pattern: propertyName?: Type[] | Type
    const propertyMatch = line.match(
      /^\s+([a-zA-Z_][a-zA-Z0-9_]*)\??:\s*(.+?)(?:\s*;|\s*$)/,
    )

    if (
      propertyMatch &&
      !line.trim().startsWith('//') &&
      !line.trim().startsWith('*')
    ) {
      const propertyName = propertyMatch[1]
      let propertyType = propertyMatch[2].trim()
      const isOptional = line.includes('?:')

      // Check if it's an array
      const isArray = propertyType.endsWith('[]')
      if (isArray) {
        propertyType = propertyType.slice(0, -2)
      }

      properties.push({
        name: propertyName,
        type: propertyType,
        isArray,
        isOptional,
        line: i,
      })
    }
  }

  return properties
}

/**
 * Generate @Field decorator for a property
 */
function generateFieldDecorator(prop: PropertyInfo, indent: string): string {
  const { type, isArray, isOptional } = prop

  // Determine if we need a type function
  const needsTypeFunction = !isPrimitiveType(type)

  let decorator = `${indent}@Field(`

  if (needsTypeFunction) {
    if (isArray) {
      decorator += `() => [${type}]`
    } else {
      decorator += `() => ${type}`
    }
  }

  // Add options
  if (isOptional || needsTypeFunction) {
    decorator += needsTypeFunction ? ', ' : ''
    decorator += `{ nullable: true }`
  }

  decorator += ')'

  return decorator
}

/**
 * Check if a type is a primitive TypeScript/GraphQL type
 */
function isPrimitiveType(type: string): boolean {
  const primitives = [
    'string',
    'number',
    'boolean',
    'String',
    'Number',
    'Boolean',
    'Date',
  ]
  return primitives.includes(type)
}

/**
 * Add @Field decorators to a file
 */
function addFieldDecorators(filePath: string): boolean {
  console.log(`Processing: ${filePath}`)

  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  // Find all @InputType() and @ObjectType() classes
  const classPattern =
    /@(?:InputType|ObjectType)\(\)\s*(?:export\s+)?class\s+([a-zA-Z_][a-zA-Z0-9_]*)/g
  let match
  const classNames: string[] = []

  while ((match = classPattern.exec(content)) !== null) {
    classNames.push(match[1])
  }

  if (classNames.length === 0) {
    console.log(`  No @InputType or @ObjectType classes found`)
    return false
  }

  let modified = false
  const newLines = [...lines]
  let offset = 0 // Track line number offset as we add lines

  for (const className of classNames) {
    const properties = parseClassProperties(content, className)

    if (properties.length === 0) continue

    console.log(
      `  Found class: ${className} with ${properties.length} properties`,
    )

    for (const prop of properties) {
      const actualLineIndex = prop.line + offset
      const line = newLines[actualLineIndex]

      // Check if decorator already exists
      if (
        actualLineIndex > 0 &&
        newLines[actualLineIndex - 1].trim().startsWith('@Field')
      ) {
        console.log(`    Skipping ${prop.name} (already has @Field)`)
        continue
      }

      // Get indentation from the property line
      const indentMatch = line.match(/^(\s*)/)
      const indent = indentMatch ? indentMatch[1] : '  '

      // Generate and insert decorator
      const decorator = generateFieldDecorator(prop, indent)
      newLines.splice(actualLineIndex, 0, decorator)
      offset++
      modified = true

      console.log(`    Added @Field to ${prop.name}`)
    }
  }

  if (modified) {
    // Check if @Field is imported
    const importLine = newLines.find(
      (line) => line.includes('import') && line.includes('@nestjs/graphql'),
    )

    if (importLine && !importLine.includes('Field')) {
      const importIndex = newLines.indexOf(importLine)
      const updatedImport = importLine.replace(
        /import\s*{([^}]+)}/,
        (match, imports) => {
          const importList = imports.split(',').map((s: string) => s.trim())
          if (!importList.includes('Field')) {
            importList.unshift('Field')
          }
          return `import { ${importList.join(', ')} }`
        },
      )
      newLines[importIndex] = updatedImport
      console.log(`  Updated imports to include Field`)
    }

    fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8')
    console.log(`  ✓ File updated successfully\n`)
    return true
  } else {
    console.log(`  No changes needed\n`)
    return false
  }
}

/**
 * Recursively find all .ts files in a directory
 */
function findTypeScriptFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      // Skip node_modules and dist
      if (file !== 'node_modules' && file !== 'dist') {
        findTypeScriptFiles(filePath, fileList)
      }
    } else if (file.endsWith('.ts') && !file.endsWith('.spec.ts')) {
      fileList.push(filePath)
    }
  }

  return fileList
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('Usage: ts-node add-field-decorators.ts <directory-or-file>')
    console.log('Example: ts-node add-field-decorators.ts src/models')
    process.exit(1)
  }

  const target = args[0]
  const targetPath = path.resolve(target)

  if (!fs.existsSync(targetPath)) {
    console.error(`Error: Path does not exist: ${targetPath}`)
    process.exit(1)
  }

  const stat = fs.statSync(targetPath)
  let files: string[] = []

  if (stat.isDirectory()) {
    console.log(`Scanning directory: ${targetPath}\n`)
    files = findTypeScriptFiles(targetPath)
  } else if (targetPath.endsWith('.ts')) {
    files = [targetPath]
  } else {
    console.error('Error: Target must be a directory or .ts file')
    process.exit(1)
  }

  console.log(`Found ${files.length} TypeScript files\n`)

  let modifiedCount = 0

  for (const file of files) {
    if (addFieldDecorators(file)) {
      modifiedCount++
    }
  }

  console.log(`\n✓ Complete! Modified ${modifiedCount} files.`)
}

main()
