const hre = require("hardhat");

async function main() {
  console.log("Deploying TestToken contract...");

  // Get the signer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Get the contract factory
  const TestToken = await hre.ethers.getContractFactory("TestToken");

  // Deploy the contract
  const testToken = await TestToken.deploy();
  await testToken.waitForDeployment();

  const address = await testToken.getAddress();
  console.log("TestToken deployed to:", address);

  // Get token info
  const name = await testToken.name();
  const symbol = await testToken.symbol();
  const totalSupply = await testToken.totalSupply();

  console.log("Token Name:", name);
  console.log("Token Symbol:", symbol);
  console.log("Total Supply:", hre.ethers.formatEther(totalSupply));

  // Save contract address for frontend
  const fs = require('fs');
  const contractData = {
    address: address,
    name: name,
    symbol: symbol,
    totalSupply: hre.ethers.formatEther(totalSupply)
  };

  fs.writeFileSync('./contract-address.json', JSON.stringify(contractData, null, 2));
  fs.writeFileSync('./public/contract-address.json', JSON.stringify(contractData, null, 2));
  console.log("Contract data saved to contract-address.json and public/contract-address.json");

  // Test the contract functions
  console.log("\nTesting contract functions...");
  try {
    const testName = await testToken.name();
    const testSymbol = await testToken.symbol();
    const testTotalSupply = await testToken.totalSupply();
    
    console.log("✅ name():", testName);
    console.log("✅ symbol():", testSymbol);
    console.log("✅ totalSupply():", hre.ethers.formatEther(testTotalSupply));
    console.log("🎉 Contract deployed and tested successfully!");
  } catch (error) {
    console.error("❌ Error testing contract:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 