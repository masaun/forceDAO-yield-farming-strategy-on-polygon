/// Using local network
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

/// Openzeppelin test-helper
const { time, expectRevert } = require('@openzeppelin/test-helpers')

/// Import deployed-addresses
const contractAddressList = require("../../../migrations/addressesList/contractAddress/contractAddress.js")
const tokenAddressList = require("../../../migrations/addressesList/tokenAddress/tokenAddress.js")

/// Artifact of smart contracts 
const MasterChef = artifacts.require("MasterChef")
const FishToken = artifacts.require("FishToken")
const DAIMockToken = artifacts.require("DAIMockToken")

/// Deployed-addresses


/**
 * @notice - This is the test of MasterChef.sol
 * @notice - [Execution command]: $ truffle test ./test/test-local/MasterChef.test.js --network local
 */
contract("MasterChef", function(accounts) {
    /// Acccounts
    let deployer = accounts[0]
    let user1 = accounts[1]
    let user2 = accounts[2]
    let user3 = accounts[3]

    /// Global contract instance
    let masterChef
    let fishToken
    let daiToken

    /// Global variable for each contract addresses
    let MASTER_CHEF
    let FISH_TOKEN
    let DAI_TOKEN


    function toWei(amount) {
        return web3.utils.toWei(`${ amount }`, 'ether')
    }

    function fromWei(amount) {
        return web3.utils.fromWei(`${ amount }`, 'ether')
    }

    async function getEvents(contractInstance, eventName) {
        const _latestBlock = await time.latestBlock()
        const LATEST_BLOCK = Number(String(_latestBlock))

        /// [Note]: Retrieve an event log of eventName (via web3.js v1.0.0)
        let events = await contractInstance.getPastEvents(eventName, {
            filter: {},
            fromBlock: LATEST_BLOCK,  /// [Note]: The latest block on Mainnet
            //fromBlock: 0,
            toBlock: 'latest'
        })
        //console.log(`\n=== [Event log]: ${ eventName } ===`, events[0].returnValues)
        return events[0].returnValues
    } 

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
            //const fish
            const startBlock = 1
            const devAddress = user1    /// [Todo]: Replace with eligible address
            const feeAddress = user2    /// [Todo]: Replace with eligible address
            const vaultAddress = user3  /// [Todo]: Replace with eligible address

            masterChef = await MasterChef.new(FISH_TOKEN, startBlock, devAddress, feeAddress, vaultAddress, { from: deployer })
            MASTER_CHEF = masterChef.address
        })

        it("[Log]: Deployer-contract addresses", async () => {
            console.log('\n=== FISH_TOKEN ===', FISH_TOKEN)
            console.log('\n=== DAI_TOKEN ===', DAI_TOKEN)
            console.log('\n=== MASTER_CHEF ===', MASTER_CHEF)
        })
    })

    describe("\n Preparation in advance", () => {
        it("Mint 1000 Fish Tokens to user1", async () => {
            const to = user1
            const amount = toWei("1000")  /// 1000 $FISH
            let txReceipt = fishToken.mint(to, amount, { from: deployer })
        })
    })

    describe("\n Workflow of the MasterChef contract", () => {

        it("deposit()", async () => {
            /// [Todo]:
        })

    })

})
