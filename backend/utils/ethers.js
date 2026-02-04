const { ethers } = require("hardhat");

async function initContract() {
  const accounts = await ethers.getSigners();
  const DiskRental = await ethers.getContractFactory("DiskRental");
  const diskRentalContract = await DiskRental.deploy();
  await diskRentalContract.waitForDeployment();
  console.log("DiskRental deployed at:", await diskRentalContract.getAddress());
  return { diskRentalContract, accounts };
}

module.exports = { initContract };