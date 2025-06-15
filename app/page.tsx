"use client";

import SolWallet from "@/components/SolWallet";
import { Tabs } from "@/components/ui/tabs";
import { generateMnemonic } from "bip39";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Wallet {
  publicKey: string;
  privateKey: string;
  index: number;
}
export default function Home() {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [ethWallets, setEthWallets] = useState<Wallet[]>([]);
  const [solWallets, setSolWallets] = useState<Wallet[]>([]);
  const [activeTab, setActiveTab] = useState<string>("eth");

  useEffect(() => {
    const storedMnemonic = localStorage.getItem("mnemonic");
    if (storedMnemonic) {
      setMnemonic(storedMnemonic);
    } else {
      newMnemonic();
    }
  }, []);

  const newMnemonic = async () => {
    const mn = generateMnemonic();
    if (!mn) {
      toast.error("Failed to generate mnemonic phrase!");
      return null;
    }
    setMnemonic(mn);
    localStorage.setItem("mnemonic", mn);
    toast.success("New mnemonic phrase generated");
  };

  const handleAddSolWallet = (wallet: Wallet) => {
    setSolWallets((prev) => [...prev, wallet]);
  };
  const handleDeleteSolWallet = (index: number) => {
    setSolWallets(prev => prev.filter(w => w.index != index))
  }
  return (
    <div className="min-h-screen bg-background p-4">
      <Tabs></Tabs>
      <SolWallet
        mnemonic={mnemonic}
        onGenerateMnemonic={newMnemonic}
        wallets={solWallets}
        onAddWallet={handleAddSolWallet}
        onDeleteWallet={handleDeleteSolWallet}
      />
    </div>
  );
}
