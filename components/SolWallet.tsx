"use client";

import { Keypair } from "@solana/web3.js";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
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
export default function SolWallet({
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
      const path = `m/44'/501'/${newIndex}'/0'`;

      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const keyPair = Keypair.fromSeed(derivedSeed);

      onAddWallet({
        publicKey: keyPair.publicKey.toString(),
        privateKey: Buffer.from(keyPair.secretKey).toString("hex"),
        index: newIndex,
      });

      toast.success("New Solana wallet generated");
    } catch (error) {
      console.error("Error generating wallet:", error);
      toast.error("Failed to generate wallet");
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Solana Wallets</h2>
        <Button onClick={newWallet} className="flex items-center gap-2">
          <Plus />
          Add Wallet
        </Button>
      </div>

      <div className="grid gap-4">
        {wallets.map((wallet, index) => (
          <div key={index} className="">
            <p>Public Key- {wallet.publicKey}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
