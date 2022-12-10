require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  etherscan: {
    apiKey: {
      // rinkeby: ETHERSCAN_API_KEY,
      // kovan: ETHERSCAN_API_KEY,
      // polygon: POLYGONSCAN_API_KEY,
      goerli: "",
    },
  },
  networks: {
    hardhat: {},
    goerli: {
      url: "https://goerli.infura.io/v3/08d0a9d1045146dc888e62677f83e772",
      accounts: [""],
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: "64f8b125-40ba-4ff6-bd6a-1d89d1e86612",
  },
};
