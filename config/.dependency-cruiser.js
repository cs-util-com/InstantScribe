/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  options: {
    doNotFollow: { path: 'node_modules' },
    includeOnly: 'src',
    exclude: { path: '((^|\\/)\\.stryker-tmp/)|((^|\\/)playwright-report/)' },
    reporterOptions: { dot: { collapsePattern: 'node_modules/[^/]*' } },
  },
  forbidden: [
    // No circular dependencies
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: { circular: true },
    },

    // Enforce a simple layered architecture: utils can't import from components
    {
      name: 'no-utils-importing-from-components',
      severity: 'error',
      from: { path: '^src/utils' },
      to: { path: '^src/components' },
    },
  ],
};
