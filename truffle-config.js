const TestRPC = require('ganache-cli')
const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require('fs');

const mnemonic = fs.readFileSync('.secret').toString().trim();

module.exports = {
  networks: {
    development: {
      provider: TestRPC.provider(),
      network_id: '*'
    },
    dev: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*'
    },
    testnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      confirmations: 5,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    bsc: {
      provider: () => new HDWalletProvider(mnemonic, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 5,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  plugins: ["solidity-coverage"],
  compilers: {
    solc: {
      version: '^0.6.0',
      settings: {
        optimizer: {
          enabled: true
        }
      }
    }
  }
};
