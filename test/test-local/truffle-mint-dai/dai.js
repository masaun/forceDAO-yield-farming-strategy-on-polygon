const { BN, ether, balance } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { asyncForEach } = require('./utils');

// Artifacts
const ForceSend = artifacts.require('ForceSend');

// ABI
const erc20ABI = require('./abi/erc20');

// daiAddress must be unlocked using --unlock 0x6b175474e89094c44da98b954eedeac495271d0f
const daiAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';  // DAI address on Mainnet
const daiContract = new web3.eth.Contract(erc20ABI, daiAddress);

// Utils
const getDaiBalance = async account => {
  return daiContract.methods.balanceOf(account).call();
};

contract('Truffle Mint DAI', async accounts => {
  it('should send ether to the DAI contract', async () => {
    // Send 1 eth to daiAddress to have gas to mint.
    // Uses ForceSend contract, otherwise just sending
    // a normal tx will revert.
    const forceSend = await ForceSend.new();
    await forceSend.go(daiAddress, { value: ether('1') });
    const ethBalance = await balance.current(daiAddress);
    expect(new BN(ethBalance)).to.be.bignumber.least(new BN(ether('1')));
  });

  it('should mint 100 DAI for our first 5 generated accounts', async () => {
    // Get 100 DAI for first 5 accounts
    await asyncForEach(accounts.slice(0, 5), async account => {
      // daiAddress is passed to ganache-cli with flag `--unlock`
      // so we can use the `mint` method.
      await daiContract.methods
        .mint(account, ether('100').toString())
        .send({ from: daiAddress });
      const daiBalance = await getDaiBalance(account);
      expect(new BN(daiBalance)).to.be.bignumber.least(ether('100'));
    });
  });

  it('DAI balance', async () => {
      const DaiBalance = await getDaiBalance(accounts[0])
      console.log('=== DAI balance of accounts[0] ===', web3.utils.fromWei(DaiBalance, 'ether'))
  })  
});
