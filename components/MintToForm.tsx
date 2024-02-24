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
          <form onSubmit={mintTo} className="">
            <label htmlFor="mint">Token Mint:</label>
            <input
              id="mint"
              type="text"
              className=""
              placeholder="Enter Token Mint"
              required
            />
            <label htmlFor="recepient">Recepient:</label>
            <input
              id="recepient"
              type="text"
              className=""
              placeholder="Enter Recepient Public Key"
              required
            />
            <label htmlFor="amount">Amount Tokens To Mint:</label>
            <input
              id="amount"
              type="text"
              className=""
              placeholder="Eg- 100"
              required
            />

            <button type="submit" className="">
              Mint Tokens
            </button>
          </form>
        ) : (
          <span></span>
        )}

        {txSig ? (
          <div>
            <p>Token Balance: {balance}</p>
            <p>View your transaction on: </p>
            <a href={link()}>Solana Explorer</a>
          </div>
        ) : null}
      </div>
    );
  };
};
