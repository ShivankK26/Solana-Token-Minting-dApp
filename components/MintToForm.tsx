import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  createMintToInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAccount,
} from "@solana/spl-token";
import { FC, useState } from "react";

export const MintToForm: FC = () => {
  const [txSig, setTxSig] = useState("");
  const [balance, setBalance] = useState("");
  const [tokenAccount, setTokenAccount] = useState("");
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const link = () => {
    return txSig
      ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
      : "";
  };

  const mintTo = async (event) => {
    event.preventDefault();
    if (!connection || !publicKey) {
      return;
    }

    const transaction = new web3.Transaction();
    const mintPubKey = new web3.PublicKey(event.target.mint.value);
    const recepientKey = new web3.PublicKey(event.target.recepient.value);
    const amount = event.target.amount.value;

    const associatedToken = await getAssociatedTokenAddress(
      mintPubKey,
      recepientKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    transaction.add(
      createMintToInstruction(mintPubKey, associatedToken, publicKey, amount),
    );

    const signature = await sendTransaction(transaction, connection);

    await connection.confirmTransaction(signature, "confirmed");

    setTxSig(signature);
    setTokenAccount(associatedToken.toString());

    const account = await getAccount(connection, associatedToken);
    setBalance(account.amount.toString());

    return (
      <div>
        <br />
        {publicKey ? (
          <form onSubmit={mintTo} className="mt-4">
            <label htmlFor="mint" className="block">
              Token Mint:
            </label>
            <input
              id="mint"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter Token Mint"
              required
            />
            <label htmlFor="recepient" className="mt-4 block">
              Recepient:
            </label>
            <input
              id="recepient"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter Recepient Public Key"
              required
            />
            <label htmlFor="amount" className="mt-4 block">
              Amount Tokens To Mint:
            </label>
            <input
              id="amount"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Eg- 100"
              required
            />

            <button
              type="submit"
              className="mt-4 inline-flex items-center rounded-md border border-transparent bg-blue-500 px-4 py-2 font-semibold uppercase tracking-widest text-white transition hover:bg-blue-600 focus:border-blue-700 focus:outline-none focus:ring focus:ring-blue-200 active:bg-blue-700 disabled:opacity-25"
            >
              Mint Tokens
            </button>
          </form>
        ) : (
          <span></span>
        )}

        {txSig ? (
          <div className="mt-4">
            <p className="text-xl font-bold text-black">
              Token Balance: {balance}
            </p>
            <p className="text-xl font-bold text-black">
              View your transaction on:{" "}
            </p>
            <a href={link()} className="text-xl font-semibold text-purple-600">
              Solana Explorer
            </a>
          </div>
        ) : null}
      </div>
    );
  };
};
