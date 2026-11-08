const express = require('express');
const { createServer } = require('node:http');
const path = require('node:path');
const cors = require('cors');
const helmet = require('helmet');
const { router } = require('./routes/index');
const { corsOptions } = require('./services/cors');
const { attachChat } = require('./graphql/chat');

// Construction is separate from startup so tests never connect to the configured database.
function createApp({ routes = router, chatService } = {}) {
  const app = express();
  const server = createServer(app);
  app.use(express.json());
  app.use(helmet());
  app.use(cors(corsOptions));
  app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'pages/index.html')));
  app.use('/api', routes);
  const chat = attachChat(app, server, chatService);
  app.get('/healthCheck', (req, res) => res.json({ status: 'OK' }));
  // A pathless fallback also covers '/' without Express 5 wildcard syntax.
  app.use((req, res) => res.status(404).json({ error: 'URL_NOT_FOUND' }));
  return { app, server, chat };
}

module.exports = { createApp };
