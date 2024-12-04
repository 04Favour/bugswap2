import { useWriteContract } from "wagmi";
import { bugSwapAbi } from "@/generated";
import { useToast } from "@/hooks/use-toast";

import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent(){
  const [amountA, setAmountA] = React.useState("");
  const [tokenAAddress, setTokenAAddress] = React.useState("");
  const [tokenBAddress, setTokenBAddress] = React.useState("");
  const { toast } = useToast();

  const {
    data: swapContractHash,
    isPending: swapContractPending,
    writeContract: swapContract,
  } = useWriteContract();
  const {
    data: setTokenHash,
    isPending: setTokenPending,
    writeContract: setToken,
  } = useWriteContract();

  const handleSwap = async () => {
    swapContract(
      {
        address: "0x9A1E047D527e115441e5Bd77FD249D9908eFFB96",
        abi: bugSwapAbi,
        functionName: "swap",
        args: [BigInt(amountA)],
      },
      {
        onSuccess() {
          toast({
            title: "Swap successful!",
          });
        },
        onError(error) {
          toast({
            title: "Swap failed!",
          });
          console.error(error);
        },
      }
    );
  };

  const handleSetTokens = async () => {
    setToken(
      {
        address: "0x9A1E047D527e115441e5Bd77FD249D9908eFFB96",
        abi: bugSwapAbi,
        functionName: "setTokens",
        args: [tokenBAddress as `0x${string}`, tokenBAddress as `0x${string}`],
      },
      {
        onSuccess() {
          toast({
            title: "Tokens set successfully!",
          });
        },
        onError(error) {
          toast({
            title: "Setting tokens failed!",
          });
          console.error(error);
        },
      }
    );
  };

  return (
    <div>
     
      <Card>
        <CardHeader>
          <h2>Swap Tokens</h2>
        </CardHeader>
        <CardContent>
          <Input
            disabled={swapContractPending}
            type="number"
            value={amountA}
            onChange={(e) => setAmountA(e.target.value)}
            placeholder="Amount of Token A"
          />
          <div>Amount of Token B: {amountA}</div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSwap}>Swap</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <h2>Set Tokens</h2>
        </CardHeader>
        <CardContent>
          <Input
            disabled={setTokenPending}
            type="text"
            value={tokenAAddress}
            onChange={(e) => setTokenAAddress(e.target.value)}
            placeholder="Token A Address"
          />
          <Input
            disabled={setTokenPending}
            type="text"
            value={tokenBAddress}
            onChange={(e) => setTokenBAddress(e.target.value)}
            placeholder="Token B Address"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSetTokens}>Set Tokens</Button>
        </CardFooter>
      </Card>
      {swapContractHash && (
        <div>Swap Contract Transaction Hash: {swapContractHash}</div>
      )}
      {setTokenHash && <div>Set Token Transaction Hash: {setTokenHash}</div>}
    </div>
  );
}
