const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');

const createTicket = async (req, res) => {
  const { title, description } = req.body;

  try {
    const newTicket = new Ticket({
      title,
      description,
      user: req.user.id
    });

    const ticket = await newTicket.save();
    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const comments = await Comment.find({ ticket: req.params.id })
      .sort({ createdAt: -1 });

    const ticketWithComments = {
      ...ticket.toObject(),
      comments
    };

    res.json(ticketWithComments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const updateTicketStatus = async (req, res) => {
  const { status } = req.body;

  try {
    let ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    if (ticket.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    ticket.status = status;
    ticket.updatedAt = Date.now();
    
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const addComment = async (req, res) => {
  const { text } = req.body;

  try {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    if (ticket.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const newComment = new Comment({
      text,
      user: req.user.id,
      ticket: ticket.id
    });

    const comment = await newComment.save();
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createTicket,
  getTickets,
  updateTicketStatus,
  addComment,
  getTicket
};