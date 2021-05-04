const TestRPC = require('ganache-cli')
const HDWalletProvider = require("@truffle/hdwallet-provider");

// add private key here
const privKeyBinanceTestnet = ["b679378ab94044ae66ff4c470c8269ef392d2ecf1c938a4674113b81511dfdfd"];

module.exports = {
  networks: {
    development: {
      provider: TestRPC.provider(),
      network_id: '*'
    },
    testnet: {
      host: 'qtum:testpasswd@localhost',
      port: 23889,
      network_id: '*'
    },
    dev: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*'
    },
    binancetest: {
      provider: () => new HDWalletProvider(privKeyBinanceTestnet, 'https://data-seed-prebsc-1-s1.binance.org:8545'),
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
