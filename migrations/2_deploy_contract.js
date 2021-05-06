const MasterChef = artifacts.require('MasterChef');
const MockERC20 = artifacts.require('MockERC20');
const Fast = artifacts.require('Fast');
const FastswapFactory = artifacts.require('FastswapFactory');

const ether = (n) => web3.utils.toWei(n, 'ether');

async function addLP(name, token0, token1, amount, fastswapFactory, masterchef) {
  console.log('\n'+name);

  let pair = await fastswapFactory.getPair.call(token0, token1);
  if (pair == '0x0000000000000000000000000000000000000000') {
    console.log('Pair doesn\'t exist, creating...');
    await fastswapFactory.createPair(token0, token1);
    pair = await fastswapFactory.getPair.call(token0, token1);
  }

  console.log('Pair address: ' + pair);
  await masterchef.add(ether(amount), pair, false);
  console.log('----------------------------------------------------');
}

module.exports = function (deployer, network) {
  deployer.then(async () => {
    if (network === 'development' || network === 'test' || network === 'soliditycoverage' || network == 'otherhost') {}
    else if (network == 'dev') {
      const fast = await deployer.deploy(MockERC20, 'FAST Token', 'FAST', ether('1000000'));

      const ts = new Date().getTime();
      const masterchef = await deployer.deploy(MasterChef, fast.address, ts + 30 * 60);
      await fast.transfer(masterchef.address, ether('120000'));

      const FAST_pair = await deployer.deploy(MockERC20, 'FAST/BNB', 'FAST', ether('1000000'));
      await masterchef.add(ether('20000'), FAST_pair.address, false);
      await FAST_pair.approve(masterchef.address, ether('100'));
      await masterchef.deposit(0, ether('100'));

      const MVP_pair = await deployer.deploy(MockERC20, 'MVP/BNB', 'MVP', ether('1000000'));
      await masterchef.add(ether('7500'), MVP_pair.address, false);
      await MVP_pair.approve(masterchef.address, ether('100'));
      await masterchef.deposit(1, ether('100'));

      const YFT_pair = await deployer.deploy(MockERC20, 'YFT/BNB', 'YFT', ether('1000000'));
      await masterchef.add(ether('7500'), YFT_pair.address, false);
      await YFT_pair.approve(masterchef.address, ether('100'));
      await masterchef.deposit(2, ether('100'));

      const CAKE_pair = await deployer.deploy(MockERC20, 'CAKE/BNB', 'CAKE', ether('1000000'));
      await masterchef.add(ether('5000'), CAKE_pair.address, false);
      await CAKE_pair.approve(masterchef.address, ether('100'));
      await masterchef.deposit(3, ether('100'));

      const ETH_pair = await deployer.deploy(MockERC20, 'ETH/BNB', 'ETH', ether('1000000'));
      await masterchef.add(ether('5000'), ETH_pair.address, false);
      await ETH_pair.approve(masterchef.address, ether('100'));
      await masterchef.deposit(4, ether('100'));

      const SUSHI_pair = await deployer.deploy(MockERC20, 'SUSHI/BNB', 'SUSHI', ether('1000000'))
      await masterchef.add(ether('5000'), SUSHI_pair.address, false);
      await SUSHI_pair.approve(masterchef.address, ether('100'));
      await masterchef.deposit(5, ether('100'));

      const DODO_pair = await deployer.deploy(MockERC20, 'DODO/BNB', 'DODO', ether('1000000'));
      await masterchef.add(ether('5000'), DODO_pair.address, false);
      await DODO_pair.approve(masterchef.address, ether('100'));
      await masterchef.deposit(6, ether('100'));

      const COMP_pair = await deployer.deploy(MockERC20, 'COMP/BNB', 'COMP', ether('1000000'));
      await masterchef.add(ether('5000'), COMP_pair.address, false);
      await COMP_pair.approve(masterchef.address, ether('100'));
      await masterchef.deposit(7, ether('100'));

      const DAI_pair = await deployer.deploy(MockERC20, 'DAI/BNB', 'DAI', ether('1000000'));
      await masterchef.add(ether('5000'), DAI_pair.address, false);
      await DAI_pair.approve(masterchef.address, ether('100'));
      await masterchef.deposit(8, ether('100'));

      const BAND_pair = await deployer.deploy(MockERC20, 'BAND/BNB', 'BAND', ether('1000000'));
      await masterchef.add(ether('5000'), BAND_pair.address, false);
      await BAND_pair.approve(masterchef.address, ether('100'));
      await masterchef.deposit(9, ether('100'));

      const DOT_pair = await deployer.deploy(MockERC20, 'DOT/BNB', 'DOT', ether('1000000'));
      await masterchef.add(ether('5000'), DOT_pair.address, false);
      await DOT_pair.approve(masterchef.address, ether('100'));
      await masterchef.deposit(10, ether('100'));

      const LINK_pair = await deployer.deploy(MockERC20, 'LINK/BNB', 'LINK', ether('1000000'));
      await masterchef.add(ether('5000'), LINK_pair.address, false);
      await LINK_pair.approve(masterchef.address, ether('100'));
      await masterchef.deposit(11, ether('100'));

      const USDT_pair = await deployer.deploy(MockERC20, 'USDT/BNB', 'USDT', ether('1000000'));
      await masterchef.add(ether('5000'), USDT_pair.address, false);
      await USDT_pair.approve(masterchef.address, ether('100'));
      await masterchef.deposit(12, ether('100'));

      const UNI_pair = await deployer.deploy(MockERC20, 'UNI/BNB', 'UNI', ether('1000000'));
      await masterchef.add(ether('5000'), UNI_pair.address, false);
      await UNI_pair.approve(masterchef.address, ether('100'));
      await masterchef.deposit(13, ether('100'));

      const SXP_pair = await deployer.deploy(MockERC20, 'SXP/BNB', 'SXP', ether('1000000'));
      await masterchef.add(ether('5000'), SXP_pair.address, false);
      await SXP_pair.approve(masterchef.address, ether('100'));
      await masterchef.deposit(14, ether('100'));

      const USDC_pair = await deployer.deploy(MockERC20, 'USDC/BNB', 'USDC', ether('1000000'));
      await masterchef.add(ether('5000'), USDC_pair.address, false);
      await USDC_pair.approve(masterchef.address, ether('100'));
      await masterchef.deposit(15, ether('100'));

      const ONEINCH_pair = await deployer.deploy(MockERC20, 'ONEINCH/BNB', 'ONEINCH', ether('1000000'));
      await masterchef.add(ether('5000'), ONEINCH_pair.address, false);
      await ONEINCH_pair.approve(masterchef.address, ether('100'));
      await masterchef.deposit(16, ether('100'));
        
      const YFI_pair = await deployer.deploy(MockERC20, 'YFI/BNB', 'YFI', ether('1000000'));
      await masterchef.add(ether('5000'), YFI_pair.address, false);
      await YFI_pair.approve(masterchef.address, ether('100'));
      await masterchef.deposit(17, ether('100'));

      const AAVE_pair = await deployer.deploy(MockERC20, 'AAVE/BNB', 'AAVE', ether('1000000'));
      await masterchef.add(ether('5000'), AAVE_pair.address, false);
      await AAVE_pair.approve(masterchef.address, ether('100'));
      await masterchef.deposit(18, ether('100'));

      const SNX_pair = await deployer.deploy(MockERC20, 'SNX/BNB', 'SNX', ether('1000000'));
      await masterchef.add(ether('5000'), SNX_pair.address, false);
      await SNX_pair.approve(masterchef.address, ether('100'));
      await masterchef.deposit(19, ether('100'));

    } else if (network == 'testnet' || network == 'bsc') {
      let fastTokenAddress;
      if (network == 'testnet') {
        fastTokenAddress = '0xF8759390158213A448300b8784C3ab37f7AA5319';
      } else if (network == 'bsc') {
        fastTokenAddress = '0x4d338614fc25afe6edf3994f331b4bad32fb3c6a';
      }

      const wBNB = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';
      
      let fastswapFactory;
      let start;
      if (network == 'testnet') {
        fastswapFactory = await FastswapFactory.at('0x554DB92dcb69bB96b6F543f1154d5471c29C8ca2');
        start = 1622858744;
      } else if (network == 'bsc') {
        fastswapFactory = await FastswapFactory.at('0x59DA12BDc470C8e85cA26661Ee3DCD9B85247C88');
        start = 1622858744;
      }

      const fast = await Fast.at(fastTokenAddress);

      // TODO: time start contract
      const masterchef = await deployer.deploy(MasterChef, fastTokenAddress, start);

      await fast.transfer(masterchef.address, ether('120000'));

      // FAST/BNB
      await addLP('FAST/BNB', fastTokenAddress, wBNB, '20000', fastswapFactory, masterchef);

      // MVP/BNB
      // await addLP('MVP/BNB', '', wBNB, '7500', fastswapFactory, masterchef);

      // YFT/BNB
      await addLP('YFT/BNB', '0xB5257E125C9311B61CA7a58b3C11cB8806AFaC1f', wBNB, '7500', fastswapFactory, masterchef);

      // CAKE/BNB
      await addLP('CAKE/BNB', '0xcd5c032ad7b385cca69dbc1f711dc382ae33c5f9', wBNB, '5000', fastswapFactory, masterchef);

      // ETH/BNB
      await addLP('ETH/BNB', '0x2170ed0880ac9a755fd29b2688956bd959f933f8', wBNB, '5000', fastswapFactory, masterchef);

      // SUSHI/BNB
      await addLP('SUSHI/BNB', '0x947950bcc74888a40ffa2593c5798f11fc9124c4', wBNB, '5000', fastswapFactory, masterchef);

      // DODO/BNB
      await addLP('DODO/BNB', '0x67ee3cb086f8a16f34bee3ca72fad36f7db929e2', wBNB, '5000', fastswapFactory, masterchef);

      // COMP/BNB
      await addLP('COMP/BNB', '0x52ce071bd9b1c4b00a0b92d298c512478cad67e8', wBNB, '5000', fastswapFactory, masterchef);

      // DAI/BNB
      await addLP('DAI/BNB', '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', wBNB, '5000', fastswapFactory, masterchef);

      // BAND/BNB
      await addLP('BAND/BNB', '0xad6caeb32cd2c308980a548bd0bc5aa4306c6c18', wBNB, '5000', fastswapFactory, masterchef);

      // DOT/BNB
      await addLP('DOT/BNB', '0x7083609fce4d1d8dc0c979aab8c869ea2c873402', wBNB, '5000', fastswapFactory, masterchef);

      // LINK/BNB
      await addLP('LINK/BNB', '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd', wBNB, '5000', fastswapFactory, masterchef);

      // USDT/BNB
      await addLP('USDT/BNB', '0x55d398326f99059ff775485246999027b3197955', wBNB, '5000', fastswapFactory, masterchef);

      // UNI/BNB
      await addLP('UNI/BNB', '0xbf5140a22578168fd562dccf235e5d43a02ce9b1', wBNB, '5000', fastswapFactory, masterchef);

      // SXP/BNB
      await addLP('SXP/BNB', '0x47bead2563dcbf3bf2c9407fea4dc236faba485a', wBNB, '5000', fastswapFactory, masterchef);

      // USDC/BNB
      await addLP('USDC/BNB', '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', wBNB, '5000', fastswapFactory, masterchef);

      // ONEINCH/BNB
      await addLP('ONEINCH/BNB', '0x111111111117dC0aa78b770fA6A738034120C302', wBNB, '5000', fastswapFactory, masterchef);

      // YFI/BNB
      await addLP('YFI/BNB', '0x88f1a5ae2a3bf98aeaf342d26b30a79438c9142e', wBNB, '5000', fastswapFactory, masterchef);

      // AAVE/BNB
      await addLP('AAVE/BNB', '0xfb6115445bff7b52feb98650c87f44907e58f802', wBNB, '5000', fastswapFactory, masterchef);

      // SNX/BNB
      await addLP('SNX/BNB', '0x9ac983826058b8a9c7aa1c9171441191232e8404', wBNB, '5000', fastswapFactory, masterchef);
    }
  });
};
