"use client";

import EthWallet from "@/components/EthWallet";
import SolWallet from "@/components/SolWallet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateMnemonic } from "bip39";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronDown, Copy } from "lucide-react";

interface Wallet {
  publicKey: string;
  privateKey: string;
  index: number;
}
export default function Home() {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [ethWallets, setEthWallets] = useState<Wallet[]>([]);
  const [solWallets, setSolWallets] = useState<Wallet[]>([]);
  const [isMnemonicVisible, setIsMnemonicVisible] = useState(false);

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

  const copyMnemonicToClipboard = () => {
    navigator.clipboard.writeText(mnemonic);
    toast.success("Mnemonic phrase copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-background p-4  max-w-7xl mx-auto px-8">
      <div className="mb-8">
        <Button
          variant="outline"
          className="w-full flex justify-between items-center"
          onClick={() => setIsMnemonicVisible(!isMnemonicVisible)}
        >
          <span className="font-semibold">View Mnemonic Phrase</span>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isMnemonicVisible ? "rotate-180" : ""
            }`}
          />
        </Button>
        {isMnemonicVisible && (
          <div className="mt-4 p-4 border rounded-lg bg-card">
            <div className="grid grid-cols-3 gap-4 text-center">
              {mnemonic.split(" ").map((word, index) => (
                <div
                  key={index}
                  className="p-2 bg-muted rounded-md font-mono text-sm"
                >
                  <span className="text-xs text-muted-foreground mr-2">
                    {index + 1}
                  </span>
                  {word}
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-4 flex items-center gap-2"
              onClick={copyMnemonicToClipboard}
            >
              <Copy className="w-4 h-4" />
              Copy Mnemonic
            </Button>
          </div>
        )}
      </div>
      <Tabs defaultValue="eth">
        <TabsList className="w-2xl mx-auto h-12">
          <TabsTrigger value="eth" className="cursor-pointer">
            Etherium
          </TabsTrigger>
          <TabsTrigger value="sol" className="cursor-pointer">
            Solana
          </TabsTrigger>
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
