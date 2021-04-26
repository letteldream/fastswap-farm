const TestRPC = require('ganache-cli')

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
