/// Using local network
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

/// Openzeppelin test-helper
const { time, constants, expectRevert, expectEvent } = require('@openzeppelin/test-helpers')

/// web3.js related methods
const { toWei, fromWei, getEvents, getCurrentBlock, getCurrentTimestamp } = require('./web3js-helper/web3jsHelper')

/// Import deployed-addresses
const contractAddressList = require("../../migrations/addressesList/contractAddress/contractAddress.js")
const tokenAddressList = require("../../migrations/addressesList/tokenAddress/tokenAddress.js")

/// Artifact of smart contracts 
const YieldFarmingStrategy = artifacts.require("YieldFarmingStrategy")
const MasterChef = artifacts.require("MasterChef")
const FishToken = artifacts.require("FishToken")
const DAIMockToken = artifacts.require("DAIMockToken")

/// Deployed-addresses
const LENDING_POOL_ADDRESSES_PROVIDER = contractAddressList["Polygon Mumbai"]["AAVE"]["LendingPoolAddressesProvider"]
//let LP_TOKEN = tokenAddressList["Polygon Mumbai"]["AAVE"][""]


/**
 * @notice - This is the test of YieldFarmingStrategy.sol
 * @notice - [Execution command]: $ truffle test ./test/test-local/YieldFarmingStrategy.test.js --network local
 */
contract("YieldFarmingStrategy", function(accounts) {
    /// Acccounts
    let deployer = accounts[0]
    let admin = accounts[0]
    let user1 = accounts[1]
    let user2 = accounts[2]
    let user3 = accounts[3]
    let devAddress = accounts[4]
    let feeAddress = accounts[5]
    let vaultAddress = accounts[6]

    /// Global contract instance
    let yieldFarmingStrategy
    let masterChef
    let fishToken
    let daiToken

    /// Global variable for each contract addresses
    let YIELD_FARMING_STRATEGY
    let MASTER_CHEF
    let FISH_TOKEN
    let DAI_TOKEN

    describe("\n Accounts", () => {
        it("Show accounts (wallet addresses) list that are used for this test", async () => {
            console.log('=== deployer ===', deployer)
            console.log('=== user1 ===', user1)
            console.log('=== user2 ===', user2)
            console.log('=== user3 ===', user3)
        })
    })

    describe("\n Setup smart-contracts", () => {
        it("Deploy the Fish Token", async () => {
            fishToken = await FishToken.new({ from: deployer })
            FISH_TOKEN = fishToken.address
        })

        it("Deploy the DAI Mock Token", async () => {
            daiToken = await DAIMockToken.new({ from: deployer })
            DAI_TOKEN = daiToken.address
        })

        it("Deploy the MasterChef contract", async () => {
            const startBlock = 1
            masterChef = await MasterChef.new(FISH_TOKEN, startBlock, devAddress, feeAddress, vaultAddress, { from: deployer })
            MASTER_CHEF = masterChef.address
        })

        it("Transfer ownership of the FishToken to the MasterChef contract", async () => {
            let txReceipt = await fishToken.transferOwnership(MASTER_CHEF, { from: deployer })
        })

        it("Deploy the YieldFarmingStrategy contract instance", async () => {
            yieldFarmingStrategy = await YieldFarmingStrategy.new(LENDING_POOL_ADDRESSES_PROVIDER, MASTER_CHEF, DAI_TOKEN, { from: deployer })
            YIELD_FARMING_STRATEGY = yieldFarmingStrategy.address
        })

        it("[Log]: Deployer-contract addresses", async () => {
            console.log('\n=== FISH_TOKEN ===', FISH_TOKEN)
            console.log('\n=== DAI_TOKEN ===', DAI_TOKEN)
            console.log('\n=== MASTER_CHEF ===', MASTER_CHEF)
            console.log('\n=== LENDING_POOL_ADDRESSES_PROVIDER ===', LENDING_POOL_ADDRESSES_PROVIDER)            
            console.log('\n=== YIELD_FARMING_STRATEGY ===', YIELD_FARMING_STRATEGY)            
        })
    })

    describe("\n Workflow of the YieldFarmingStrategy contract", () => {

        // it("depositSavings() in the SavingsContract.sol", async () => {
        //     const underlying = toWei("10")
        //     let txReceipt1 = await daiToken.approve(SAVINGS_CONTRACT, underlying, { from: deployer })
        //     //let txReceipt2 = await savingsContract.depositSavings(underlying, user1, { from: deployer })
        // })

    })

})
