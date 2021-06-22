# ForceDAO - Build your own yield farming strategy on Polygon
## 【Introduction of the ForceDAO - Automate a DeFi Yield Farming Strategy on Polygon and AAVE】
- This is a smart contract that 

&nbsp;

***

## 【Workflow】
- Diagram of workflow: https://gitcoin.co/issue/ForceDAO/bounties/5/100025916


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

### ③ Test (on local)
- 1: Start ganache-cli
```
$ ganache-cli -d --fork https://polygon-mainnet.infura.io/v3/{YOUR INFURA KEY}@{BLOCK_NUMBER}
```
(※ `-d` option is the option in order to be able to use same address on Ganache-CLI every time)  
(※ Please stop and re-start if an error of `"Returned error: project ID does not have access to archive state"` is displayed)  

<br>

- 2: Execute test of the smart-contracts
```
npm run test:Something
```
( `truffle test ./test/test-local/Something.test.js --network local` )  


<br>

***

## 【References】
- ForceDAO


- Prize in GR10 
 https://gitcoin.co/issue/ForceDAO/bounties/4/100025917

