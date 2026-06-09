const { execSync } = require('child_process');

// Get the assigned port from microfrontends
const port = execSync('npx microfrontends port', {
  encoding: 'utf8',
  stdio: ['pipe', 'pipe', 'pipe']
}).trim();

// Start Next.js dev server on the assigned port
execSync(`next dev --port ${port}`, {
  stdio: 'inherit'
});
