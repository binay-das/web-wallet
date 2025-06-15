"use client";

import EthWallet from "@/components/EthWallet";
import SolWallet from "@/components/SolWallet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    setSolWallets((prev) => prev.filter((w) => w.index != index));
    toast.success("Wallet deleted");
  };

  const handleAddEthWallet = (wallet: Wallet) => {
    setEthWallets((prev) => [...prev, wallet]);
  };
  const handleDeleteEthWallet = (index: number) => {
    setEthWallets((prev) => prev.filter((w) => w.index != index));
    toast.success("Wallet deleted");
  };

  const deleteAllSolWallets = () => {
    setSolWallets([]);
    toast.success("All Solana wallets deleted");
  };
  const deleteAllEthWallets = () => {
    setEthWallets([]);
    toast.success("All Etherium wallets deleted");
  };

  return (
    <div className="min-h-screen bg-background p-4  max-w-7xl mx-auto px-8">
      <Tabs defaultValue="eth">
        <TabsList className="w-2xl mx-auto h-12">
          <TabsTrigger value="eth" className="cursor-pointer">Etherium</TabsTrigger>
          <TabsTrigger value="sol" className="cursor-pointer">Solana</TabsTrigger>
        </TabsList>
        <TabsContent value="eth">
          <EthWallet
            mnemonic={mnemonic}
            onGenerateMnemonic={newMnemonic}
            wallets={ethWallets}
            onAddWallet={handleAddEthWallet}
            onDeleteWallet={handleDeleteEthWallet}
            onDeleteAll={deleteAllEthWallets}
          />
        </TabsContent>
        <TabsContent value="sol">
          <SolWallet
            mnemonic={mnemonic}
            onGenerateMnemonic={newMnemonic}
            wallets={solWallets}
            onAddWallet={handleAddSolWallet}
            onDeleteWallet={handleDeleteSolWallet}
            onDeleteAll={deleteAllSolWallets}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
