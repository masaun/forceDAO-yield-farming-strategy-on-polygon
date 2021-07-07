# ForceDAO Yield Farming Strategy on Polygon
## 【Introduction of the ForceDAO Yield Farming Strategy on Polygon】
- This is a smart contract that deal with a yield farming strategy which use AAVE and Polycat.finance on Polygon.
  - A user create a new Yield Farming Strategy contract via the Yield Farming Strategy Factory contract.
  - A user can earn `double rewards` from the `AAVE Market` and `Polycat.finance` .
    (In terms of the Polycat, this smart contract assume that use the single staking pool of the Polycat.finance in order to earn rewards. By the way, rewards token on Polycat.finance is the `Fish Token` : https://polycat.finance/pools )

&nbsp;

***

## 【Workflow】
- Diagram of workflow: 
  ![diagram_forceDAO-yield-farming-strategy-on-polygon](https://user-images.githubusercontent.com/19357502/124755401-4b6c9e80-df66-11eb-8b4b-50ee74fed01d.jpg)

&nbsp;

***

## 【Remarks】
- Versions
  - Solidity (Solc): v0.6.12
  - Truffle: v5.1.60
  - web3.js: v1.2.9
  - openzeppelin-solidity: v3.4.1
  - ganache-cli: v6.9.1 (ganache-core: 2.10.2)


&nbsp;

***

## 【Setup】
### ① Install modules
- Install npm modules in the root directory
```
npm install
```

<br>

### ② Compile & migrate contracts (on local)
```
npm run migrate:local
```

<br>

### ③ Script for the DEMO of workflow
- 1: Get API-key from Infura
https://infura.io/

- 2: Setup Add-on for Polygon Mumbai in Infura
  - How to setup Add-on for Polygon Mumbai in Infura: https://blog.infura.io/polygon-now-available/

<br>

- 3: Add `.env` to the root directory.
  - Please reference how to write from `.env.example` . (Please write 3 things below into `.env` )
    - MNEMONIC (Mnemonic)  
    - INFURA_KEY (Infura key)  
    - DEPLOYER_ADDRESS (Deployer address)  
      https://github.com/masaun/forceDAO-yield-farming-strategy-on-polygon/blob/main/.env.example

<br>

- 4: In advance, Please check `MATIC token balance` of `executor's (user's) wallet address` .
  - Idealy, MATIC tokens balance is more than `1 MATIC` .
  - Matic fancet: https://faucet.matic.network/ (Please select Mumbai network)

<br>

- 5: Get DAI on Polygon mumbai testnet by using the Fancet on Pods.
    (Please following this article. Especially, part of `"Getting Mumbai USDC, ETH and other faucet tokens"` in this article is explanation about the Fancet: https://blog.pods.finance/guide-connecting-mumbai-testnet-to-your-metamask-87978071aca8 )

<br>

- 6: Execute a script
```
npm run script:YieldFarmingStrategy
```

<br>

### ③ Unit test (on local)
- 1: Start ganache-cli
```
$ ganache-cli -d --fork https://polygon-mainnet.infura.io/v3/{YOUR INFURA KEY}@{BLOCK_NUMBER}
```
(※ `-d` option is the option in order to be able to use same address on Ganache-CLI every time)  
(※ Please stop and re-start if an error of `"Returned error: project ID does not have access to archive state"` is displayed)  

<br>

- 2: Execute test of the smart-contracts
```
npm run test:YieldFarmingStrategy
```
( `truffle test ./test/test-local/YieldFarmingStrategy.test.js --network local` )  

<br>

```
npm run test:MasterChef
```
( `truffle test ./test/test-local/polycat/MasterChef.test.js --network local` )  

<br>

***

## 【References】
- ForceDAO
  - Website: https://www.forcedao.com/
  - GR10 Prize from ForceDAO: Build your own yield farming strategy on Polygon: https://gitcoin.co/issue/ForceDAO/bounties/4/100025917

<br>

- AAVE
  - Deployed-addresses on Polygon Mumbai: https://docs.aave.com/developers/deployed-contracts/matic-polygon-market
  - Liquidity Mining: https://docs.aave.com/developers/guides/liquidity-mining

<br>

- Polycat
  - dApp (Single Token Staking Pool): https://polycat.finance/pools 
  - Smart contract (Github): https://github.com/polycatfi

<br>

- Infura
  - How to setup Add-on for Polygon in Infura: https://blog.infura.io/polygon-now-available/
  - Network address via Infura
    - Polygon Mainnet： `"https://polygon-mainnet.infura.io/YOUR-PROJECT-ID"`
    - Polygon Mumbai： `"https://polygon-mumbai.infura.io/YOUR-PROJECT-ID"`
      https://infura.io/docs/ethereum#section/Choose-a-Network

<br>

- Fancet on Polygon Mumbai
  - Getting Mumbai USDC, ETH and other faucet tokens on Pods  
    https://blog.pods.finance/guide-connecting-mumbai-testnet-to-your-metamask-87978071aca8
