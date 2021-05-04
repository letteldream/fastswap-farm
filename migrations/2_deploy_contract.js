const MasterChef = artifacts.require('MasterChef');
const MockERC20 = artifacts.require('MockERC20');

const ether = (n) => web3.utils.toWei(n, 'ether');

module.exports = function (deployer, network) {
  deployer.then(async () => {
    if (network === 'development' || network === 'test' || network === 'soliditycoverage' || network == 'otherhost'){

    } else if (network == 'binancetestnet' || network == 'dev') {
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
    } else if (network == 'binancemainnet') {}
  });
};
