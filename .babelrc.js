/**
 * Babel Configuration Pointer File
 * 
 * This file serves as the entry point for Babel configuration and MUST remain 
 * in the project root directory. Here's why:
 * 
 * What Babel does:
 * - Transpiles modern JavaScript (ES6+) to backwards-compatible code
 * - Enables use of latest JS features while maintaining browser/Node compatibility
 * - Currently configured for Node.js environment via @babel/preset-env
 * 
 * Why this file is in the root:
 * - Babel's file discovery mechanism looks for config files starting from the
 *   current directory and moving upward through parent directories
 * - Tools like Jest, bundlers, and other build tools expect to find Babel
 *   config following this standard discovery pattern
 * - Moving this file would break automatic detection by these tools
 * 
 * Project organization:
 * - This file acts as a lightweight pointer to the actual configuration
 * - Real config is in ./config/babel.config.js for better organization
 * - This approach keeps tooling compatibility while organizing configs centrally
 * 
 * Used by: Jest (via babel-jest), and potentially other build tools
 */
module.exports = require('./config/babel.config.js');
