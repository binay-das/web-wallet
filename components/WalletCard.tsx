"use client";

import { Copy, Eye, EyeOff, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface WalletCardProps {
  walletNumber: number;
  publicKey: string;
  privateKey: string;
  showPrivateKey: boolean;
  onTogglePrivateKey: () => void;
  onCopyPublicKey: () => void;
  onCopyPrivateKey: () => void;
  onDelete: () => void;
}

export default function WalletCard({
  walletNumber,
  publicKey,
  privateKey,
  showPrivateKey,
  onTogglePrivateKey,
  onCopyPublicKey,
  onCopyPrivateKey,
  onDelete,
}: WalletCardProps) {
  return (
    <Card className="max-w-sm w-full shadow-sm gap-1">
      <CardHeader className="flex flex-row justify-between items-center pb-">
        <CardTitle className="text-lg">Wallet {walletNumber}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          aria-label="Delete wallet"
        >
          <Trash className="w-4 h-4 text-destructive" />
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Public Key</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCopyPublicKey}
              aria-label="Copy public key"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p
            className="font-mono text-sm text-muted-foreground break-all cursor-pointer hover:text-foreground transition"
            onClick={onCopyPublicKey}
          >
            {publicKey}
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Private Key</span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={onTogglePrivateKey}
                aria-label="Toggle private key visibility"
              >
                {showPrivateKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCopyPrivateKey}
                aria-label="Copy private key"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p
            className="font-mono text-sm text-muted-foreground break-all cursor-pointer hover:text-foreground transition"
            onClick={onCopyPrivateKey}
          >
            {showPrivateKey
              ? `${privateKey.slice(0, 6)}${"*".repeat(18)}`
              : "•".repeat(24)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
