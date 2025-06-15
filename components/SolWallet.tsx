"use client";

import { Keypair } from "@solana/web3.js";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Plus, Trash } from "lucide-react";
import WalletCard from "./WalletCard";
import { useState } from "react";

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
  onDeleteAll: () => void;
}
export default function SolWallet({
  mnemonic,
  onGenerateMnemonic,
  wallets,
  onAddWallet,
  onDeleteWallet,
  onDeleteAll
}: Props) {
  const [showPrivateKeys, setShowPrivateKeys] = useState<{
    [key: number]: boolean;
  }>({});
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

  const togglePrivateKey = (index: number) => {
    setShowPrivateKeys((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-3xl font-bold text-primary">Solana Wallets</h2>
        <div className="flex gap-4 ">
          {wallets.length > 0 && (
            <Button variant="outline" onClick={onDeleteAll} className="flex items-center gap-2">
              <Trash className="w-4 h-4 text-destructive" />
              Delete All
            </Button>
          )}
          <Button variant="outline" onClick={newWallet} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Wallet
          </Button>
        </div>
      </div>

      {wallets.length === 0 ? (
        <p className="text-muted-foreground">
          No wallets yet. Click "Add Wallet" to generate one.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((wallet) => (
            <WalletCard
              key={wallet.index}
              walletNumber={wallet.index + 1}
              publicKey={wallet.publicKey}
              privateKey={wallet.privateKey}
              onDelete={() => onDeleteWallet(wallet.index)}
              onCopyPublicKey={() => copyToClipboard(wallet.publicKey)}
              onCopyPrivateKey={() => copyToClipboard(wallet.privateKey)}
              showPrivateKey={showPrivateKeys[wallet.index] || false}
              onTogglePrivateKey={() => togglePrivateKey(wallet.index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
