const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
    senderwalletId :{type:mongoose.Schema.Types.ObjectId, ref:"wallet",required:true},
    receiverwalletId :{type:mongoose.Schema.Types.ObjectId, ref:"wallet",required:true},
    amount:{type: Number, required:true},
});

module.exports = mongoose.model("transaction", transactionSchema);