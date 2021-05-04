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
    binancetest: {
      provider: () => new HDWalletProvider(mnemonic, 'https://data-seed-prebsc-1-s1.binance.org:8545'),
      host: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      network_id: 97,
    }
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
}
