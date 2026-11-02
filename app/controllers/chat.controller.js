const { chatService, ChatError } = require('../services/chat.service');

function handle(work) {
  return async (req, res) => {
    try { res.json(await work(req)); }
    catch (error) {
      if (!(error instanceof ChatError)) console.error('Chat:', error.message);
      res.status(error instanceof ChatError ? error.status : 500).json({
        message: error instanceof ChatError ? error.message : 'No se pudo procesar el chat.',
      });
    }
  };
}

module.exports = {
  createchat_order: handle((req) => chatService.createConversation(req.body.id_pedido, req.user.id)),
  getchat_order: handle((req) => chatService.getMessages(req.query.id_pedido, req.user.id)),
  insertchat_order: handle((req) => chatService.sendMessage(req.body.id_pedido, req.user.id, req.body.mensaje)),
};
