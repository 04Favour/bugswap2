import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Typography,
  InputAdornment,
  TextField,
} from '@mui/material'
import { useWalletClient, useWriteContract } from 'wagmi'
import { bugSwapAbi, ierc20Abi } from '@/generated'
import { useToast } from '@/hooks/use-toast'
import { ethers} from 'ethers'

export const Route = createFileRoute('/')({
  component: SwapComponent,
})

function SwapComponent() {
  const [amountA, setAmountA] = useState<string>('')
  const [tokenAAddress, setTokenAAddress] = useState<string>('')
  const [tokenBAddress, setTokenBAddress] = useState<string>('')
  const { toast } = useToast()
  const walletClient = useWalletClient() // Add this line to define walletClient

  const {
    data: swapContractHash,
    isPending: swapContractPending,
    writeContract: swapContract,
  } = useWriteContract()
  const {
    data: setTokenHash,
    isPending: setTokenPending,
    writeContract: setToken,
  } = useWriteContract()

  const handleSwap = async () => {
    try {
      if (!walletClient) {
        throw new Error("Wallet client not available");
      }
  
      // Step 1: Set up the swap pair
      const setTokensConfig = swapContract(
        {
          address: "0xb7bc50d9990813B039a2BA1d60E389C50479456A",
          abi: bugSwapAbi,
          functionName: "setTokens",
          args: [tokenAAddress as `0x${string}`, tokenBAddress as `0x${string}`], // Replace these with actual addresses
        },
      );
      await setTokensConfig;

      console.log("Swap pair set successfully");
  
      // Step 2: Perform the swap using the underlying ERC20 tokens
      // const amountToSwap = BigInt(amountA); // Convert to BigInt
  
      // Swap Token A for Token B
      const tokenAToken = new ethers.Contract(tokenAAddress, ierc20Abi, );
      const tokenBToken = new ethers.Contract(tokenBAddress, ierc20Abi, );
  
      // const tokenAToTokenB = await tokenAToken.balanceOf(walletClient.address);
      const minAmountB = BigInt(1000000000000000000); // Minimum amount of Token B to receive
  
      const tx = await tokenAToken.approveAndCall(
        tokenBAddress,
        minAmountB,
        ethers.utils.solidityPack(['address', 'uint256'], [tokenBAddress, minAmountB])
      );
  
      console.log("Swap transaction sent:", tx.hash);
  
      const receipt = await tx.wait();
      console.log("Swap transaction mined:", receipt.blockNumber);
  
      // Check the final balance of Token B
      const finalBalance = await tokenBToken.balanceOf(walletClient.address);
      console.log(`Final Token B balance: ${finalBalance}`);
  
      const STOKEN1 = "Token A";
      const STOKEN2 = "Token B";
      toast({
        title: "Swap successful!",
        description: `Swapped ${amountA} ${STOKEN1} for ${ethers.utils.formatEther(finalBalance)} ${STOKEN2}`,
      });
    } catch (error) {
      console.error("Swap error:", error);
      toast({
        title: "Swap failed",
        description: error.message || JSON.stringify(error),
      });
    }
  };
  
  const handleSetTokens = async () => {
    try {
      await setToken(
        {
          address: '0xb7bc50d9990813B039a2BA1d60E389C50479456A',
          abi: bugSwapAbi,
          functionName: 'setTokens',
          args: [tokenBAddress as `0x${string}`, tokenAAddress as `0x${string}`],
        },
        {
          onSuccess() {
            toast({
              title: 'Tokens set successfully!',
            })
          },
          onError(error) {
            toast({
              title: 'Setting tokens failed!',
              description: error.message || JSON.stringify(error),
            })
            console.error('Set tokens error:', error)
          },
        },
      )
    } catch (error) {
      console.error('Unexpected set tokens error:', error)

      let errorMessage
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else {
        errorMessage = JSON.stringify(error)
      }

      toast({
        title: 'Unexpected set tokens failure',
        description: errorMessage,
      })
    }
  }

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Card sx={{ width: '100%', mt: 4, mb: 4 }}>
        <CardHeader title="Swap Tokens" />
        <CardContent>
          <TextField
            fullWidth
            label="Amount of Token A"
            type="number"
            value={amountA}
            onChange={(e) => setAmountA(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
          <Typography sx={{ mt: 2 }}>Amount of Token B: {amountA}</Typography>
        </CardContent>
        <CardActions>
          <Button onClick={handleSwap} disabled={swapContractPending}>
            Swap
          </Button>
        </CardActions>
      </Card>

      <Card sx={{ width: '100%', mt: 4, mb: 4 }}>
        <CardHeader title="Set Tokens" />
        <CardContent>
          <TextField
            fullWidth
            label="Token A Address"
            value={tokenAAddress}
            onChange={(e) => setTokenAAddress(e.target.value)}
          />
          <TextField
            fullWidth
            label="Token B Address"
            value={tokenBAddress}
            onChange={(e) => setTokenBAddress(e.target.value)}
          />
        </CardContent>
        <CardActions>
          <Button onClick={handleSetTokens} disabled={setTokenPending}>
            Set Tokens
          </Button>
        </CardActions>
      </Card>

      {swapContractHash && (
        <Typography sx={{ mt: 4 }}>
          Swap Contract Transaction Hash: {swapContractHash}
        </Typography>
      )}
      {setTokenHash && (
        <Typography sx={{ mt: 2 }}>
          Set Token Transaction Hash: {setTokenHash}
        </Typography>
      )}
    </Box>
  )
}

export default SwapComponent
