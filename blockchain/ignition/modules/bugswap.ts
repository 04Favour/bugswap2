import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BugSwapModule = buildModule("BugSwapDeployment", (m) => {
  // Deploy the BugSwap contract
  const bugSwap = m.contract("BugSwap", ["0x4f72ff1ecc6103f730d4e2f5e5256a409e32b765", "0xc601488e9221b94c4003e3eda5c6d70df45e674d"]);

  // Return the deployed contract for potential further use
  return { bugSwap };
});

export default BugSwapModule;
