"use client";

import { Keypair } from "@solana/web3.js";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Plus, Trash, List, Grid } from "lucide-react";
import WalletCard from "./WalletCard";
import { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";

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
  onDeleteAll,
}: Props) {
  const [showPrivateKeys, setShowPrivateKeys] = useState<{
    [key: number]: boolean;
  }>({});
  const [isGridView, setIsGridView] = useState(true);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState<number | null>(null);

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

  const handleDeleteWallet = (index: number) => {
    onDeleteWallet(index);
    setWalletToDelete(null);
  };

  const handleDeleteAll = () => {
    onDeleteAll();
    setIsDeleteAllOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-3xl font-bold text-primary">Solana Wallets</h2>
        <div className="flex gap-4 items-center">
          {wallets.length > 0 && (
            <>
              <Button
                variant="outline"
                onClick={() => setIsDeleteAllOpen(true)}
                className="flex items-center gap-2"
              >
                <Trash className="w-4 h-4 text-destructive" />
                Delete All
              </Button>
              <div className="flex gap-2">
                <Button
                  variant={isGridView ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setIsGridView(true)}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={!isGridView ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setIsGridView(false)}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
          <Button
            variant="outline"
            onClick={newWallet}
            className="flex items-center gap-2"
          >
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
        <div
          className={
            isGridView
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "flex flex-col gap-4"
          }
        >
          {wallets.map((wallet) => (
            <WalletCard
              key={wallet.index}
              walletNumber={wallet.index + 1}
              publicKey={wallet.publicKey}
              privateKey={wallet.privateKey}
              onDelete={() => setWalletToDelete(wallet.index)}
              onCopyPublicKey={() => copyToClipboard(wallet.publicKey)}
              onCopyPrivateKey={() => copyToClipboard(wallet.privateKey)}
              showPrivateKey={showPrivateKeys[wallet.index] || false}
              onTogglePrivateKey={() => togglePrivateKey(wallet.index)}
            />
          ))}
        </div>
      )}
      <ConfirmationDialog
        isOpen={isDeleteAllOpen}
        onClose={() => setIsDeleteAllOpen(false)}
        onConfirm={handleDeleteAll}
        title="Delete All Wallets?"
        description="This will permanently delete all your Solana wallets. This action cannot be undone."
      />
      <ConfirmationDialog
        isOpen={walletToDelete !== null}
        onClose={() => setWalletToDelete(null)}
        onConfirm={() => handleDeleteWallet(walletToDelete!)}
        title="Delete Wallet?"
        description="This will permanently delete this wallet. This action cannot be undone."
      />
    </div>
  );
}
