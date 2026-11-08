const { buildSchema, GraphQLError } = require('graphql');
const { createHandler } = require('graphql-http/lib/use/express');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/use/ws');
const { chatService, ChatError } = require('../services/chat.service');
const { allowedOrigins } = require('../services/cors');

function createChatSchema(service = chatService) {
  const schema = buildSchema(`
    type Message {
      id: ID!
      mensaje: String!
      fecha: String!
      tipo_usuario: Int!
      img_icon: String
    }
    type Query { getchat_order(id_pedido: ID!, token: String!): [Message!]! }
    type Mutation {
      insertchat_order(id_pedido: ID!, mensaje: String!, fecha: String, token: String!): Message!
    }
    type Subscription { listenOrderMessages(id_pedido: ID!, token: String!): Message! }
  `);
  const safe = (fn) => async (...args) => {
    try { return await fn(...args); }
    catch (error) {
      if (!(error instanceof ChatError)) console.error('Chat:', error.message);
      throw new GraphQLError(error instanceof ChatError ? error.message : 'No se pudo procesar el chat.', {
        extensions: { code: error instanceof ChatError ? String(error.status) : 'INTERNAL_SERVER_ERROR' },
      });
    }
  };
  schema.getQueryType().getFields().getchat_order.resolve = safe(async (_, args) => {
    const user = await service.authenticate(args.token);
    return service.getMessages(args.id_pedido, user.id);
  });
  schema.getMutationType().getFields().insertchat_order.resolve = safe(async (_, args) => {
    const user = await service.authenticate(args.token);
    return service.sendMessage(args.id_pedido, user.id, args.mensaje);
  });
  schema.getSubscriptionType().getFields().listenOrderMessages.subscribe = safe((_, args) =>
    service.subscribe(args.id_pedido, args.token)
  );
  schema.getType('Message').getFields().fecha.resolve = (message) =>
    message.fecha instanceof Date ? message.fecha.toISOString() : String(message.fecha);
  return schema;
}

function attachChat(app, server, service = chatService) {
  const schema = createChatSchema(service);
  app.all('/graphql', createHandler({ schema }));
  const ws = new WebSocketServer({
    server, path: '/graphql',
    verifyClient: ({ origin }) => !origin || allowedOrigins.includes(origin),
  });
  const cleanup = useServer({ schema }, ws);
  return { schema, dispose: () => cleanup.dispose() };
}

module.exports = { attachChat, createChatSchema };
