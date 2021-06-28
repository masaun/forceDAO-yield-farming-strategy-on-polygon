/// Using local network
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

/// Openzeppelin test-helper
const { time, constants, expectRevert, expectEvent } = require('@openzeppelin/test-helpers')

/// Import deployed-addresses
const contractAddressList = require("../../migrations/addressesList/contractAddress/contractAddress.js")
const tokenAddressList = require("../../migrations/addressesList/tokenAddress/tokenAddress.js")

/// Artifact of smart contracts 
const YieldFarmingStrategy = artifacts.require("YieldFarmingStrategy")
const DAIMockToken = artifacts.require("DAIMockToken")

/// Deployed-addresses
//const SAVING_WRAPPER = contractAddressList["Polygon Mainnet"]["mAsset Save Wrapper"]


/**
 * @notice - This is the test of YieldFarmingStrategy.sol
 * @notice - [Execution command]: $ truffle test ./test/test-local/YieldFarmingStrategy.test.js --network local
 */
contract("YieldFarmingStrategy", function(accounts) {
    /// Acccounts
    let deployer = accounts[0]
    let user1 = accounts[1]
    let user2 = accounts[2]
    let user3 = accounts[3]

    /// Global contract instance
    let yieldFarmingStrategy
    let daiToken

    /// Global variable for each contract addresses
    let YIELD_FARMING_STRATEGY
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
        it("Deploy the DAI Mock Token", async () => {
            daiToken = await DAIMockToken.new({ from: deployer })
            DAI_TOKEN = daiToken.address
        })

        it("Deploy the YieldFarmingStrategy contract instance", async () => {
            yieldFarmingStrategy = await YieldFarmingStrategy.new({ from: deployer })
            YIELD_FARMING_STRATEGY = yieldFarmingStrategy.address
        })

        it("[Log]: Deployer-contract addresses", async () => {
            //console.log('\n=== CURVE_GAUGE ===', CURVE_GAUGE)
        })
    })

    describe("\n Workflow of the YieldFarmingStrategy contract", () => {

        it("depositSavings() in the SavingsContract.sol", async () => {
            const underlying = toWei("10")
            let txReceipt1 = await daiToken.approve(SAVINGS_CONTRACT, underlying, { from: deployer })
            //let txReceipt2 = await savingsContract.depositSavings(underlying, user1, { from: deployer })
        })

    })

})
