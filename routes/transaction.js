const express = require('express');
const router = express.Router();
const Wallet = require('../model/wallet');
const Transaction = require('../model/transaction');
const authMiddleware = require('../middleware/auth');

// Transfer funds between two wallets
router.post('/transfer', authMiddleware, async (req, res) => {
  try {
    const { receiverWalletId, amount } = req.body;
    const senderWallet = await Wallet.findOne({ userId: req.userId });
    const receiverWallet = await Wallet.findById(receiverWalletId);
    
    if (!senderWallet || !receiverWallet) {
      throw new Error('Invalid wallet IDs');
    }

    if (senderWallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    const transaction = new Transaction({
      senderWalletId: senderWallet._id,
      receiverWalletId,
      amount,
    });

    await transaction.save();

    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    await senderWallet.save();
    await receiverWallet.save();

    res.status(201).json({ message: 'Funds transferred successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get list of transactions for the authenticated user
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const senderWallet = await Wallet.findOne({ userId: req.userId });
    const transactions = await Transaction.find({
      $or: [
        { senderWalletId: senderWallet._id },
        { receiverWalletId: senderWallet._id },
      ],
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;