const {time} = require('@openzeppelin/test-helpers');

const FAST = artifacts.require('MockERC20');
const MVP = artifacts.require('MockERC20');
const YFT = artifacts.require('MockERC20');
const CAKE = artifacts.require('MockERC20');
const ETH = artifacts.require('MockERC20');
const SUSHI = artifacts.require('MockERC20');
const DODO = artifacts.require('MockERC20');
const COMP = artifacts.require('MockERC20');
const DAI = artifacts.require('MockERC20');
const BAND = artifacts.require('MockERC20');
const DOT = artifacts.require('MockERC20');
const LINK = artifacts.require('MockERC20');
const USDT = artifacts.require('MockERC20');
const UNI = artifacts.require('MockERC20');
const SXP = artifacts.require('MockERC20');
const USDC = artifacts.require('MockERC20');
const ONEINCH = artifacts.require('MockERC20');
const YFI = artifacts.require('MockERC20');
const AAVE = artifacts.require('MockERC20');
const SNX = artifacts.require('MockERC20');

const MasterChef = artifacts.require('MasterChef');
const Fast = artifacts.require('MockERC20');

module.exports = async function (deployer, network, accounts) {
    if (network === 'development' || network === 'test' || network === 'soliditycoverage' || network == 'otherhost'){
    } else {
        const ether = (n) => web3.utils.toWei(n, 'ether');

        let fast = await deployer.deploy(Fast, 'FAST Token', 'FAST', ether('1000000'), {from: accounts[0]});

        let ts = new Date().getTime();
        let masterchef = await deployer.deploy(MasterChef, fast.address, ts + 30 * 60, {from: accounts[0]});
        await fast.transfer(masterchef.address, web3.utils.toWei('120002', 'ether'), {from: accounts[0]});


        // // deploy contracts
        // let FAST_pair = await deployer.deploy(FAST, 'FAST/BNB', 'FAST', ether('1000000'), {from: accounts[0]});
        // await masterchef.add(ether('20000'), FAST_pair.address, false);
        // await FAST_pair.approve(masterchef.address, ether('100'));
        // await masterchef.deposit(0, ether('100'));
        //
        //
        // let MVP_pair = await deployer.deploy(MVP, 'MVP/BNB', 'MVP', ether('1000000'), {from: accounts[0]});
        // await masterchef.add(ether('7500'), MVP_pair.address, false);
        // await MVP_pair.approve(masterchef.address, ether('100'));
        // await masterchef.deposit(0, ether('100'));
        //
        // let YFT_pair = await deployer.deploy(YFT, 'YFT/BNB', 'YFT', ether('1000000'), {from: accounts[0]});
        // await masterchef.add(ether('7500'), YFT_pair.address, false);
        // await YFT_pair.approve(masterchef.address, ether('100'));
        // await masterchef.deposit(0, ether('100'));
        //
        // let CAKE_pair = await deployer.deploy(CAKE, 'CAKE/BNB', 'CAKE', ether('1000000'), {from: accounts[0]});
        // await masterchef.add(ether('5000'), CAKE_pair.address, false);
        // await CAKE_pair.approve(masterchef.address, ether('100'));
        // await masterchef.deposit(0, ether('100'));
        //
        // let ETH_pair = await deployer.deploy(ETH, 'ETH/BNB', 'ETH', ether('1000000'), {from: accounts[0]});
        // await masterchef.add(ether('5000'), ETH_pair.address, false);
        // await ETH_pair.approve(masterchef.address, ether('100'));
        // await masterchef.deposit(0, ether('100'));
        //
        // let SUSHI_pair = await deployer.deploy(SUSHI, 'SUSHI/BNB', 'SUSHI', ether('1000000'), {from: accounts[0]})
        // await masterchef.add(ether('5000'), SUSHI_pair.address, false);
        // await SUSHI_pair.approve(masterchef.address, ether('100'));
        // await masterchef.deposit(0, ether('100'));
        //
        // let DODO_pair = await deployer.deploy(DODO, 'DODO/BNB', 'DODO', ether('1000000'), {from: accounts[0]});
        // await masterchef.add(ether('5000'), DODO_pair.address, false);
        // await DODO_pair.approve(masterchef.address, ether('100'));
        // await masterchef.deposit(0, ether('100'));
        //
        // let COMP_pair = await deployer.deploy(COMP, 'COMP/BNB', 'COMP', ether('1000000'), {from: accounts[0]});
        // await masterchef.add(ether('5000'), COMP_pair.address, false);
        // await COMP_pair.approve(masterchef.address, ether('100'));
        // await masterchef.deposit(0, ether('100'));
        //
        // let DAI_pair = await deployer.deploy(DAI, 'DAI/BNB', 'DAI', ether('1000000'), {from: accounts[0]});
        // await masterchef.add(ether('5000'), DAI_pair.address, false);
        // await DAI_pair.approve(masterchef.address, ether('100'));
        // await masterchef.deposit(0, ether('100'));
        //
        // let BAND_pair = await deployer.deploy(BAND, 'BAND/BNB', 'BAND', ether('1000000'), {from: accounts[0]});
        // await masterchef.add(ether('5000'), BAND_pair.address, false);
        // await BAND_pair.approve(masterchef.address, ether('100'));
        // await masterchef.deposit(0, ether('100'));
        //
        // let DOT_pair = await deployer.deploy(DOT, 'DOT/BNB', 'DOT', ether('1000000'), {from: accounts[0]});
        // await masterchef.add(ether('5000'), DOT_pair.address, false);
        // await DOT_pair.approve(masterchef.address, ether('100'));
        // await masterchef.deposit(0, ether('100'));
        //
        // let LINK_pair = await deployer.deploy(LINK, 'LINK/BNB', 'LINK', ether('1000000'), {from: accounts[0]});
        // await masterchef.add(ether('5000'), LINK_pair.address, false);
        // await LINK_pair.approve(masterchef.address, ether('100'));
        // await masterchef.deposit(0, ether('100'));
        //
        // let USDT_pair = await deployer.deploy(USDT, 'USDT/BNB', 'USDT', ether('1000000'), {from: accounts[0]});
        // await masterchef.add(ether('5000'), USDT_pair.address, false);
        // await USDT_pair.approve(masterchef.address, ether('100'));
        // await masterchef.deposit(0, ether('100'));
        //
        // let UNI_pair = await deployer.deploy(UNI, 'UNI/BNB', 'UNI', ether('1000000'), {from: accounts[0]});
        // await masterchef.add(ether('5000'), UNI_pair.address, false);
        // await UNI_pair.approve(masterchef.address, ether('100'));
        // await masterchef.deposit(0, ether('100'));
        //
        // let SXP_pair = await deployer.deploy(SXP, 'SXP/BNB', 'SXP', ether('1000000'), {from: accounts[0]});
        // await masterchef.add(ether('5000'), SXP_pair.address, false);
        // await SXP_pair.approve(masterchef.address, ether('100'));
        // await masterchef.deposit(0, ether('100'));
        //
        // let USDC_pair = await deployer.deploy(USDC, 'USDC/BNB', 'USDC', ether('1000000'), {from: accounts[0]});
        // await masterchef.add(ether('5000'), USDC_pair.address, false);
        // await USDC_pair.approve(masterchef.address, ether('100'));
        // await masterchef.deposit(0, ether('100'));
        //
        // let ONEINCH_pair = await deployer.deploy(ONEINCH, 'ONEINCH/BNB', 'ONEINCH', ether('1000000'), {from: accounts[0]});
        // await masterchef.add(ether('5000'), ONEINCH_pair.address, false);
        // await ONEINCH_pair.approve(masterchef.address, ether('100'));
        // await masterchef.deposit(0, ether('100'));
        //
        // let YFI_pair = await deployer.deploy(YFI, 'YFI/BNB', 'YFI', ether('1000000'), {from: accounts[0]});
        // await masterchef.add(ether('5000'), YFI_pair.address, false);
        // await YFI_pair.approve(masterchef.address, ether('100'));
        // await masterchef.deposit(0, ether('100'));
        //
        // let AAVE_pair = await deployer.deploy(AAVE, 'AAVE/BNB', 'AAVE', ether('1000000'), {from: accounts[0]});
        // await masterchef.add(ether('5000'), AAVE_pair.address, false);
        // await AAVE_pair.approve(masterchef.address, ether('100'));
        // await masterchef.deposit(0, ether('100'));
        //
        // let SNX_pair = await deployer.deploy(SNX, 'SNX/BNB', 'SNX', ether('1000000'), {from: accounts[0]});
        // await masterchef.add(ether('5000'), SNX_pair.address, false);
        // await SNX_pair.approve(masterchef.address, ether('100'));
        // await masterchef.deposit(0, ether('100'));


    }
};
