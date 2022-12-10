const { run } = require("hardhat");

const verifyContract = async (contractAddress, args) => {
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
      // contract: "contracts/OldCrypto.test.sol:OldCrypt3DPunksTest",
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!!!");
    } else {
      console.log(e.message);
    }
  }
};

module.exports = { verifyContract };
