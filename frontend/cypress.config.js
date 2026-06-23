const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: 'https://214K.local',
    setupNodeEvents(on, config) {
      
      // implement node event listeners here
    },
  },
});
