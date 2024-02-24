import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { FC, useState } from "react";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";

export const CreateTokenAccountForm: FC = () => {
  const [txSig, setTxSig] = useState("");
  const [tokenAccount, setTokenAccount] = useState("");
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const link = () => {
    return txSig
      ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
      : "";
  };

  const createTokenAccount = async (event: any) => {
    event.preventDefault();
    if (!connection || !publicKey) {
      return;
    }

    const transaction = new web3.Transaction();
    const owner = new web3.PublicKey(event.target.owner.value);
    const mint = new web3.PublicKey(event.target.mint.value);

    const associatedToken = getAssociatedTokenAddress(
      mint,
      owner,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    transaction.add(
      createAssociatedTokenAccountInstruction(
        publicKey,
        associatedToken,
        owner,
        mint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      ),
    );

    sendTransaction(transaction, connection).then((sig) => {
      setTxSig(sig);
      setTokenAccount(associatedToken.toString());
    });
  };

  return (
    <div>
      <br />
      {publicKey ? (
        <form onSubmit={createTokenAccount} className="">
          <label htmlFor="owner">Token Mint:</label>
          <input
            id="mint"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter Token Mint"
            required
          />

          <label htmlFor="owner">Token Account Owner: </label>
          <input
            id="owner"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter Token Account Owner Public Key"
            required
          />

          <button
            type="submit"
            className="mt-4 inline-flex items-center rounded-md border border-transparent bg-blue-500 px-4 py-2 font-semibold uppercase tracking-widest text-white transition hover:bg-blue-600 focus:border-blue-700 focus:outline-none focus:ring focus:ring-blue-200 active:bg-blue-700 disabled:opacity-25"
          >
            Create Token Address
          </button>
        </form>
      ) : (
        <span></span>
      )}
      {txSig ? (
        <div className="mt-4">
          <p className="text-xl font-bold text-black">
            Token Account Address: {tokenAccount}
          </p>
          <p className="text-xl font-bold text-black">
            View your transaction on:
          </p>
          <a href={link()} className="text-blue-500 hover:underline">
            Solana Explorer
          </a>
        </div>
      ) : null}
    </div>
  );
};
