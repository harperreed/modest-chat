module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'json', 'vue'],
  testMatch: ['**/tests/unit/**/*.spec.js'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,vue}', '!src/main.js', '!src/router/index.js'],
  coverageReporters: ['html', 'text-summary']
};
