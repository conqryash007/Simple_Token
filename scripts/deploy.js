const hre = require("hardhat");
const { verifyContract } = require("./../utils/verify");

async function main() {
  // const contract = await hre.ethers.getContractFactory("SimpleToken");
  // const token = await contract.deploy("XToken", "XTK", 18);
  // await token.deployed();

  // console.log(token.address);

  verifyContract("0xB34d221D3f4F79233aC1D7d36E17f5bB4b81E987", [
    "XToken",
    "XTK",
    18,
  ]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
