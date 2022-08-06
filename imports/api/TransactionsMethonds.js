import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import SimpleSchema from "simpl-schema";

import { TransactionsCollection } from "./TransactionsCollection";

Meteor.methods({
  "transitions.insert"(args) {
    const schema = new SimpleSchema({
      isTransferring: {
        type: Boolean,
      },
      sourceWalletId: {
        type: String,
      },
      destinationWalletId: {
        type: String,
        optional: !args.isTransferring,
      },
      amount: {
        type: Number,
        min: 1,
      },
    });

    const cleanWallet = schema.clean(args);
    schema.validate(cleanWallet);
    const { isTransferring, sourceWalletId, destinationWalletId, amount } =
      args;
    return TransactionsCollection.insert({
      type: isTransferring ? "TRANSFER" : "ADD",
      sourceWalletId,
      destinationWalletId: isTransferring ? destinationWalletId : null,
      amount,
      createdAt: new Date(),
    });
  },
});
