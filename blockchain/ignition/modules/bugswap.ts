import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BugSwapModule = buildModule("BugSwapDeployment", (m) => {
  // Deploy the BugSwap contract
  const bugSwap = m.contract("BugSwap", ["0x05d95818798affdb2bc6009d3b9f0a06f2ce56c4", "0xabb94ec1a2425dd2b9579a111a75b5a78ff6519c"]);

  // Return the deployed contract for potential further use
  return { bugSwap };
});

export default BugSwapModule;
