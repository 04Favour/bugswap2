import { useAccount } from "wagmi";
import { Account } from "./account";
import { WalletOptions } from "./wallet-options";
// import { useConnect } from 'wagmi'

export function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return <WalletOptions />;

  // const { connectors, connect } = useConnect()

  // return connectors.map((connector) => (
  //   <button key={connector.uid} onClick={() => connect({ connector })}>
  //     {connector.name}
  //   </button>
  // ))
}
