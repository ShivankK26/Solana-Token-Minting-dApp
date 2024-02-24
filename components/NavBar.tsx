import React, { FC } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";


const NavBar: FC = () => {
  return (
  <div className="flex items-center justify-center bg-black py-4 font-normal text-white">
    <div className="flex items-center">
      <div className="mr-auto">
        <Image src="/solanaLogo.png" height={30} width={200} alt={""} />
      </div>
      <div className="ml-80 text-center text-3xl font-bold text-white">
        <span className="">SOL Token Minting dApp</span>
      </div>
    </div>
    <div className="ml-auto">
      <WalletMultiButton />
    </div>
  </div>
  );
};

export default NavBar;
