"use client";

import { mnemonicToSeed } from "bip39";
import { Wallet } from "ethers";
import { HDNodeWallet } from "ethers";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

interface WalletInfo {
  publicKey: string;
  privateKey: string;
  index: number;
}

interface Props {
  mnemonic: string;
  onGenerateMnemonic: () => void;
  wallets: WalletInfo[];
  onAddWallet: (wallet: WalletInfo) => void;
  onDeleteWallet: (index: number) => void;
}

export default function EthWallet({
  mnemonic,
  onGenerateMnemonic,
  wallets,
  onAddWallet,
  onDeleteWallet,
}: Props) {
  const newWallet = async () => {
    try {
      if (!mnemonic) {
        onGenerateMnemonic();
        return;
      }

      const seed = await mnemonicToSeed(mnemonic);
      const newIndex = wallets.length;
      const path = `m/44'/60'/${newIndex}'/0'`;
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(path);
      const privateKey = child.privateKey;
      const wallet = new Wallet(privateKey);

      onAddWallet({
        publicKey: wallet.address,
        privateKey: privateKey,
        index: newIndex,
      });

      toast.success("New Etherium wallet generated");
    } catch (error) {
      console.error("Error generating wallet:", error);
      toast.error("Failed to generate wallet");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Etherium Wallets</h2>
        <Button onClick={newWallet} className="flex items-center gap-2">
          <Plus />
          Add Wallet
        </Button>
      </div>

      <div className="grid gap-4">
        {wallets.map((wallet, index) => (
          <div key={index} className="">
            <p>Eth Key- {wallet.publicKey}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
