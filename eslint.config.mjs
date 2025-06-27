// Import necessary Node.js modules for path resolution
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Import ESLint core utilities and plugins
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js' // Recommended JavaScript rules
import typescriptEslint from '@typescript-eslint/eslint-plugin' // TypeScript ESLint plugin
import tsParser from '@typescript-eslint/parser' // TypeScript parser for ESLint
import importPlugin from 'eslint-plugin-import' // Rules for import statements
import simpleImportSort from 'eslint-plugin-simple-import-sort' // Plugin for sorting imports/exports
import unusedImports from 'eslint-plugin-unused-imports' // Plugin for detecting unused imports/variables
import globals from 'globals' // Global variables for different environments

// Determine current file and directory paths for FlatCompat setup
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize FlatCompat for compatibility with legacy ESLint configurations
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended, // Use recommended JS rules as base
    allConfig: js.configs.all, // All JS rules for reference, if needed
})

// Export the ESLint configuration as a flat config array
export default [
    // Extend recommended rules from ESLint and TypeScript ESLint
    // This provides a solid foundation of common best practices
    ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'),
    {
        // Define plugins used in this configuration
        plugins: {
            '@typescript-eslint': typescriptEslint,
            'unused-imports': unusedImports,
            'simple-import-sort': simpleImportSort,
            'import': importPlugin,
        },

        // Configure language options for parsing and environment
        languageOptions: {
            // Define global variables available in the environment
            // Spreading `globals.browser` for browser environments
            // Consider adding `...globals.node` if your project includes Node.js-specific files
            globals: {
                ...globals.browser,
                // ...globals.node, // Uncomment if you need Node.js globals
            },

            // Specify the parser to be used (TypeScript parser for TypeScript files)
            parser: tsParser,
            // Set the ECMAScript version to the latest available
            ecmaVersion: 'latest',
            // Specify the source type as 'module' for ES Modules
            sourceType: 'module',
        },

        // Define specific rules to enforce code style and quality
        rules: {
            // Disallow unnecessary `return await` statements (improves performance/readability)
            'no-return-await': 'error',

            // Disable the base ESLint `no-useless-constructor` rule
            // This is done because the TypeScript-specific version is more accurate
            'no-useless-constructor': 'off',
            // Enforce meaningful constructors in TypeScript classes
            '@typescript-eslint/no-useless-constructor': 'error',

            // Enforce consistent use of trailing commas
            // 'always-multiline' ensures trailing commas are present for multi-line items
            'comma-dangle': [
                'error', {
                    arrays: 'always-multiline',
                    objects: 'always-multiline',
                    imports: 'always-multiline',
                    exports: 'always-multiline',
                    functions: 'never', // 'never' for functions, can be 'always-multiline' if preferred
                },
            ],

            // Enforce import and export sorting for consistency and readability
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',

            // Handle unused variables and imports
            // Disable `@typescript-eslint/no-unused-vars` to let `unused-imports` handle it
            // `unused-imports` provides more comprehensive detection and auto-fix capabilities
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'error', // Enforce removal of unused imports
            'unused-imports/no-unused-vars': [
                'warn', {
                    vars: 'all', // Check all variables
                    varsIgnorePattern: '^_', // Ignore variables starting with '_'
                    args: 'after-used', // Check arguments after they are used
                    argsIgnorePattern: '^_', // Ignore arguments starting with '_'
                },
            ],

            // Enforce newlines when chaining calls for better readability
            'newline-per-chained-call': [
                'error', {
                    ignoreChainWithDepth: 2, // Allow up to 2 chained calls on the same line
                },
            ],

            // Enforce consistent newlines around array brackets
            // 'multiline: true' combined with 'minItems: 1' means if there's more than one item
            // or the array spans multiple lines, each item gets its own line.
            'array-bracket-newline': [
                'warn', {
                    multiline: true,
                    minItems: 1, // Enforce newlines if 1 or more items and multiline
                },
            ],

            // Enforce consistent newlines around object curly braces
            // This rule ensures object properties are on newlines when they exceed a certain count or are multiline.
            'object-curly-newline': [
                'warn', {
                    ObjectPattern: {
                        multiline: true,
                        minProperties: 2, // For object destructuring, enforce newlines for 2+ properties
                    },
                    ImportDeclaration: {
                        multiline: true,
                        minProperties: 2, // For named imports, enforce newlines for 2+ properties
                    },
                    ExportDeclaration: {
                        multiline: true,
                        minProperties: 2, // For named exports, enforce newlines for 2+ properties
                    },
                    // You might also want to apply this to `ObjectExpression` for regular object literals:
                    // ObjectExpression: { multiline: true, minProperties: 2 },
                },
            ],

            // Enforce consistent newlines between object properties
            // 'allowAllPropertiesOnSameLine: true' allows flexibility but can lead to inconsistency.
            // Set to `false` for stricter multi-line property enforcement.
            'object-property-newline': [
                'error', {
                    allowAllPropertiesOnSameLine: true,
                },
            ],

            // Enforce object shorthand syntax for properties and methods where applicable
            'object-shorthand': [
                'error', 'always', {
                    ignoreConstructors: true,
                    avoidQuotes: true, // Prefer property names without quotes if valid
                },
            ],

            // Enforce spaces inside object curly braces
            'object-curly-spacing': [
                'warn', 'always',
            ],

            // Enforce 4-space indentation
            // Also ensures `case` statements inside `switch` blocks are indented
            indent: [
                'error', 4, { SwitchCase: 1 },
            ],

            // Enforce single quotes for string literals
            // `avoidEscape: true` allows template literals even if they don't have interpolations
            quotes: [
                'error', 'single', { avoidEscape: true },
            ],

            // Disallow semicolons at the end of statements
            semi: [
                'error', 'never',
            ],

            // Enforce a maximum line length for code readability
            'max-len': [
                'warn', {
                    code: 120, // A common and generally more readable line length than 150
                    tabWidth: 4,
                    ignoreComments: true,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true, // Ignore regex literals from line length check
                },
            ],

            // Limit maximum consecutive empty lines to 1
            'no-multiple-empty-lines': [
                'error', {
                    max: 1, // Maximum empty lines anywhere in the file
                    maxEOF: 1, // Maximum empty lines at the end of the file
                    maxBOF: 0, // No empty lines at the beginning of the file
                },
            ],

            // Disallow blank lines between class members (base ESLint rule)
            // This rule is kept off to prevent conflict if `@typescript-eslint` was expected to override.
            // Given the previous error, we rely on the default behavior or other rules.
            'lines-between-class-members': 'off',

            // Disallow blank lines immediately inside blocks (e.g., at the start or end of a function body)
            // Setting to 'never' can make some code less readable. Consider 'always' or 'consistent'
            // for 'blocks' if you prefer more breathing room.
            'padded-blocks': [
                'error', {
                    blocks: 'never',
                    switches: 'never',
                    classes: 'never',
                },
            ],

            // Enforce a single newline after import statements
            'import/newline-after-import': [
                'error', { count: 1 },
            ],

            // --- Additional Common Style Rules for Enhanced Consistency ---

            // Enforce consistent brace style for control statements (e.g., if, for, while)
            // '1tbs' (one true brace style) keeps the opening brace on the same line as the statement.
            'brace-style': [
                'error', '1tbs', { allowSingleLine: true },
            ],

            // Disallow spaces inside computed property brackets (e.g., `obj[foo]` instead of `obj[ foo ]`)
            'computed-property-spacing': [
                'error', 'never',
            ],

            // Enforce consistent spacing before and after commas
            'comma-spacing': [
                'error', { before: false, after: true },
            ],

            // Disallow spaces between a function name and the opening parenthesis of its call
            'func-call-spacing': [
                'error', 'never',
            ],

            // Enforce consistent spacing before and after keywords (e.g., `if (foo)` instead of `if(foo)`)
            'keyword-spacing': [
                'error', { before: true, after: true },
            ],

            // Enforce a maximum number of parameters in function definitions
            'max-params': [
                'warn', { max: 4 },
            ], // Warn if a function has more than 4 parameters

            // Prefer `const` over `let` for variables that are never reassigned
            'prefer-const': 'error',

            // Prefer arrow functions as callbacks
            'prefer-arrow-callback': [
                'error', { allowNamedFunctions: false, allowUnboundThis: true },
            ],

            // Prefer template literals over string concatenation
            'prefer-template': 'error',

            // Disallow unnecessary calls to `.call()` or `.apply()`
            'no-useless-call': 'error',

            // Disallow unnecessary `return` statements (e.g., `return;` at the end of a void function)
            'no-useless-return': 'error',

            // Enforce consistent spacing before and after semicolons (though semicolons are disallowed here)
            'semi-spacing': [
                'error', { before: false, after: true },
            ],

            // Disallow spaces inside parentheses
            'space-in-parens': [
                'error', 'never',
            ],

            // Enforce consistent spacing before and after unary operators (e.g., `typeof foo`, `!bar`)
            'space-unary-ops': [
                'error', { words: true, nonwords: false },
            ],

            // Enforce consistent spacing for comments
            'spaced-comment': [
                'error', 'always', {
                    line: {
                        markers: [
                            '/',
                        ], // For `//` comments
                        exceptions: [
                            '-', '+',
                        ], // Allow `//---` or `//+++`
                    },
                    block: {
                        balanced: true, // Block comments must have equal spacing on both sides
                        markers: [
                            '!',
                        ], // For `/*!` comments
                        exceptions: [
                            '*',
                        ], // Allow `/**`
                    },
                },
            ],

            // Enforce placing single-line comments above the code line they refer to
            'line-comment-position': [
                'error', { position: 'above' },
            ],

            // Disallow the use of `var` keyword
            'no-var': 'error',

            // Enforce consistent spacing before function parentheses
            'space-before-function-paren': [
                'error', {
                    anonymous: 'always', // Space before parentheses for anonymous functions (e.g., `function () {}`)
                    named: 'never',      // No space for named functions (e.g., `function foo() {}`)
                    asyncArrow: 'always', // Space for async arrow functions (e.g., `async () => {}`)
                },
            ],

            // Enforce consistent spacing before blocks
            'space-before-blocks': [
                'error', 'always',
            ],

            // Enforce spaces around infix operators (e.g., `a + b`, `x === y`)
            'space-infix-ops': 'error',

            // Enforce consistent spacing for switch case colons
            'switch-colon-spacing': [
                'error', { after: true, before: false },
            ],

            // --- TypeScript-specific Rules ---

            // The `@typescript-eslint/type-annotation-spacing` rule was removed due to a TypeError.
            // Its functionality for consistent spacing around type annotations may be partially covered
            // by the recommended TypeScript ESLint configuration, or it might require a different
            // approach with your specific ESLint and plugin versions.

            // Disallow the use of the `any` type (can be 'warn' or 'error' based on strictness)
            '@typescript-eslint/no-explicit-any': 'warn', // Warns about `any`, consider 'error' for stricter projects

            // Disallow unused expressions (TypeScript version)
            // This rule is more robust for TypeScript code.
            'no-unused-expressions': 'off', // Disable base rule
            '@typescript-eslint/no-unused-expressions': [
                'error',
                {
                    allowShortCircuit: true, // Allow short-circuiting (e.g., `foo && bar()`)
                    allowTernary: true,     // Allow ternary expressions (e.g., `condition ? a : b`)
                    allowTaggedTemplates: true, // Allow tagged templates (e.g., `css`foo``)
                },
            ],

            // Enforce explicit member accessibility (public, private, protected) in classes
            // 'no-public' means that 'public' can be omitted as it's the default.
            '@typescript-eslint/explicit-member-accessibility': [
                'error', { accessibility: 'no-public' },
            ],

            // Disallow "magic numbers" (numeric literals that are not clearly explained)
            // Encourages using named constants instead of raw numbers.
            '@typescript-eslint/no-magic-numbers': [
                'warn',
                {
                    ignore: [
                        0, 1, -1,
                    ], // Common numbers to ignore (e.g., array indices, basic loops)
                    ignoreArrayIndexes: true,
                    enforceConst: true, // Recommend `const` for these numbers
                    detectObjects: false, // Do not detect numbers in object literals
                },
            ],

            // Enforce consistent naming conventions for various identifiers in TypeScript
            // This is a powerful rule that can significantly improve code readability.
            '@typescript-eslint/naming-convention': [
                'error',
                // General variable-like naming (variables, parameters, properties)
                {
                    selector: 'variableLike',
                    format: [
                        'camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case',
                    ], // Allow camelCase, PascalCase, UPPER_CASE
                    leadingUnderscore: 'allow', // Allow variables starting with '_' for unused/ignored
                    trailingUnderscore: 'forbid',
                },
                // Type naming (interfaces, types, enums, classes)
                {
                    selector: 'typeLike',
                    format: [
                        'PascalCase',
                    ], // Enforce PascalCase for types
                },
                // Property naming (can be more flexible due to API requirements etc.)
                {
                    selector: 'property',
                    format: [
                        'camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE',
                    ],
                    filter: {
                        regex: '[- ]', // Allow hyphens and spaces for specific cases like CSS-in-JS property names
                        match: false,
                    },
                },
                // Function and method naming
                {
                    selector: [
                        'function', 'method',
                    ],
                    format: [
                        'camelCase',
                    ], // Enforce camelCase for functions and methods
                },
                // Enum member naming
                {
                    selector: 'enumMember',
                    format: [
                        'PascalCase', 'UPPER_CASE',
                    ], // Allow PascalCase or UPPER_CASE for enum members
                },
                // Interface naming (optional, but often prefixed with 'I')
                {
                    selector: 'interface',
                    format: [
                        'PascalCase',
                    ],
                    custom: {
                        regex: '^I[A-Z]', // Enforce interfaces to start with 'I'
                        match: true,
                    },
                },
            ],
        },
    },
]