import { ethers } from "hardhat";
async function main() {
  const SendFile = await ethers.getContractFactory("SendFile");
  const file = await SendFile.deploy();
  await file.deployed();
  console.log("SendFile deployed to:", file.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
