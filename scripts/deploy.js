const hre = require("hardhat");

async function main() {
  const DiskRental = await hre.ethers.getContractFactory("DiskRental");
  const diskRental = await DiskRental.deploy();
  await diskRental.waitForDeployment();

  console.log("DiskRental deployed to:", diskRental.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});