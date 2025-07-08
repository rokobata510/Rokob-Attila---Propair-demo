const express = require('express');
const router = express.Router();
const protect = require('../middleware/Auth');
const {
  createTicket,
  getTickets,
  getTicket,
  updateTicketStatus,
  addComment
} = require('../controllers/ticketController');

router.use(protect);

router.post('/', createTicket);
router.get('/', getTickets);
router.get('/:id', getTicket);
router.put('/:id/status', updateTicketStatus);
router.post('/:id/comments', addComment);

module.exports = router;