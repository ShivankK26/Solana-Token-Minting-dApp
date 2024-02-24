import { FC, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  getMinimumBalanceForRentExemptMint,
  createInitializeMintInstruction,
} from "@solana/spl-token";

export const CreateMintForm: FC = () => {
  const [txSig, setTxSig] = useState("");
  const [mint, setMint] = useState("");

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const link = () => {
    return txSig
      ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
      : "";
  };

  const createMint = async (event: any) => {
    event.preventDefault();
    if (!connection || !publicKey) {
      return;
    }

    const mint = web3.Keypair.generate();

    const lamports = await getMinimumBalanceForRentExemptMint(connection);

    const transaction = new web3.Transaction();

    transaction.add(
      web3.SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mint.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mint.publicKey,
        0,
        publicKey,
        publicKey,
        TOKEN_PROGRAM_ID,
      ),
    );

    sendTransaction(transaction, connection, {
      signers: [mint],
    }).then((sig) => {
      setTxSig(sig);
      setMint(mint.publicKey.toString());
    });
  };

  return (
    <div>
      {publicKey ? (
        <form onSubmit={createMint} className="mt-4">
          <button
            type="submit"
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Create Mint
          </button>
        </form>
      ) : (
        <span className="text-xl font-bold text-black">
          Please Connect Your Wallet
        </span>
      )}

      {txSig ? (
        <div className="mt-4">
          <p className="text-xl font-bold text-black">
            Token Mint Address: {mint}
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
