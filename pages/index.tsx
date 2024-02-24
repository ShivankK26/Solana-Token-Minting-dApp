import Image from "next/image";
import { Inter } from "next/font/google";
import NavBar from "@/components/NavBar";
import WalletContextProvider from "../components/WalletContextProvider";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { CreateMintForm } from "../components/CreateMint";
import { CreateTokenAccountForm } from "@/components/CreateTokenAccount";
import { MintToForm } from "@/components/MintToForm";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <WalletContextProvider>
        <NavBar />
        <BalanceDisplay />
        <CreateMintForm />
        <CreateTokenAccountForm />
        <MintToForm />
      </WalletContextProvider>
    </div>
  );
}
