const { BN, ether, balance } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { asyncForEach } = require('./utils');

// Artifacts
const ForceSend = artifacts.require('ForceSend');

// ABI
const erc20ABI = require('./abi/usdc-abi');

// usdcAddress must be unlocked using --unlock 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
const usdcAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';  // USDC address on Mainnet
const usdcContract = new web3.eth.Contract(erc20ABI, usdcAddress);

// Utils
const getUsdcBalance = async account => {
  return usdcContract.methods.balanceOf(account).call();
};

contract('Truffle Mint USDC', async accounts => {
  it('should send ether to the USDC contract', async () => {
    // Send 1 eth to usdcAddress to have gas to mint.
    // Uses ForceSend contract, otherwise just sending
    // a normal tx will revert.
    const forceSend = await ForceSend.new();
    await forceSend.go(usdcAddress, { value: ether('1') });
    const ethBalance = await balance.current(usdcAddress);
    expect(new BN(ethBalance)).to.be.bignumber.least(new BN(ether('1')));
  });

  it('should mint 100 USDC for our first 5 generated accounts', async () => {
    // Get 100 USDC for first 5 accounts
    await asyncForEach(accounts.slice(0, 5), async account => {
      // usdcAddress is passed to ganache-cli with flag `--unlock`
      // so we can use the `mint` method.
      await usdcContract.methods
        .mint(account, ether('100').toString())
        .send({ from: usdcAddress });
      const usdcBalance = await getUsdcBalance(account);
      expect(new BN(usdcBalance)).to.be.bignumber.least(ether('100'));
    });
  });

  it('USDC balance', async () => {
      const UsdcBalance = await getUsdcBalance(accounts[0])
      console.log('=== USDC balance of accounts[0] ===', web3.utils.fromWei(UsdcBalance, 'ether'))
  })  
});
