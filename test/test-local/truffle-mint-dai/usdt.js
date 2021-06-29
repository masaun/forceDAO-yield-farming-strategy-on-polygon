const { BN, ether, balance } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { asyncForEach } = require('./utils');

// Artifacts
const ForceSend = artifacts.require('ForceSend');

// ABI
const erc20ABI = require('./abi/erc20');

// usdtAddress must be unlocked using --unlock 0xdAC17F958D2ee523a2206206994597C13D831ec7
const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';  // USDT address on Mainnet
const usdtContract = new web3.eth.Contract(erc20ABI, usdtAddress);

// Utils
const getUsdtBalance = async account => {
  return usdtContract.methods.balanceOf(account).call();
};

contract('Truffle Mint USDT', async accounts => {
  it('should send ether to the USDT contract', async () => {
    // Send 1 eth to usdtAddress to have gas to mint.
    // Uses ForceSend contract, otherwise just sending
    // a normal tx will revert.
    const forceSend = await ForceSend.new();
    await forceSend.go(usdtAddress, { value: ether('1') });
    const ethBalance = await balance.current(usdtAddress);
    expect(new BN(ethBalance)).to.be.bignumber.least(new BN(ether('1')));
  });

  it('should mint 100 USDT for our first 5 generated accounts', async () => {
    // Get 100 USDT for first 5 accounts
    await asyncForEach(accounts.slice(0, 5), async account => {
      // usdtAddress is passed to ganache-cli with flag `--unlock`
      // so we can use the `mint` method.
      await usdtContract.methods
        .mint(account, ether('100').toString())
        .send({ from: usdtAddress });
      const usdtBalance = await getUSDTBalance(account);
      expect(new BN(usdtBalance)).to.be.bignumber.least(ether('100'));
    });
  });

  it('USDT balance', async () => {
      const UsdtBalance = await getUsdtBalance(accounts[0])
      console.log('=== USDT balance of accounts[0] ===', web3.utils.fromWei(UsdtBalance, 'ether'))
  })  
});
