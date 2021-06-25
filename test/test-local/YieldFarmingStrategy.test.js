/// Using local network
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

/// Openzeppelin test-helper
const { time, expectRevert } = require('@openzeppelin/test-helpers')

/// Import deployed-addresses
const contractAddressList = require("../../migrations/addressesList/contractAddress/contractAddress.js")
const tokenAddressList = require("../../migrations/addressesList/tokenAddress/tokenAddress.js")

/// Artifact of smart contracts 
const YieldFarmingStrategy = artifacts.require("YieldFarmingStrategy")
const SaveWrapper = artifacts.require("SaveWrapper")
const SavingsContract = artifacts.require("SavingsContract")
const DAIMockToken = artifacts.require("DAIMockToken")

/// Deployed-addresses
const SAVING_WRAPPER = contractAddressList["Polygon Mainnet"]["mAsset Save Wrapper"]
const NEXUS = contractAddressList["Polygon Mainnet"]["Nexus"]
const MUSD = tokenAddressList["Polygon Mainnet"]["mUSD"]


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
    let saveWrapper
    let savingsContract
    let daiToken

    /// Global variable for each contract addresses
    let YIELD_FARMING_STRATEGY
    let SAVE_WRAPPER
    let SAVINGS_CONTRACT
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
        it("Deploy the DAI Mock Token", async () => {
            daiToken = await DAIMockToken.new({ from: deployer })
            DAI_TOKEN = daiToken.address
        })

        it("Deploy the SavingsContract", async () => {
            const underlying = "0x0f7a5734f208A356AB2e5Cf3d02129c17028F3cf"  /// [Todo]: Replace this test address
            savingsContract = await SavingsContract.new(NEXUS, underlying, { from: deployer })
            SAVINGS_CONTRACT = savingsContract.address
        })

        // it("Deploy the AutonomousDegenVC contract instance", async () => {
        //     autonomousDegenVC = await AutonomousDegenVC.new(LP_DGVC_ETH, UNISWAP_V2_ROUTER_02, UNISWAP_V2_FACTORY, WETH, { from: deployer })
        //     AUTONOMOUS_DEGEN_VC = autonomousDegenVC.address
        // })

        it("Create the SaveWrapper contract instance", async () => {
            saveWrapper = await SaveWrapper.at(SAVING_WRAPPER)
        })

        it("[Log]: Deployer-contract addresses", async () => {
            //console.log('\n=== CURVE_GAUGE ===', CURVE_GAUGE)
        })
    })

    describe("\n Workflow of the AutonomousDegenVC contract", () => {
        it("[Step 1]: Create a ProjectToken", async () => {
            // * @dev 1. Mints an mAsset and then deposits to Save/Savings Vault
            // * @param _mAsset       mAsset address
            // * @param _bAsset       bAsset address
            // * @param _save         Save address
            // * @param _vault        Boosted Savings Vault address (<--This is only deployed on Mainnet)
            // * @param _amount       Amount of bAsset to mint with
            // * @param _minOut       Min amount of mAsset to get back
            // * @param _stake        Add the imAsset to the Boosted Savings Vault?
            // 
            const mAsset = MUSD  /// mUSD
            const save = SAVINGS_CONTRACT
            const vault = "0x26A09Ae0a531495461757610D95a8c680A7aFE8F"   /// [Todo]: Replace this test address
            const bAsset = DAI_TOKEN   /// DAI Mock Token (as a underlying asset) -> [Result]: "Invalid asset."
            const amount = toWei("10")
            const minOut = toWei("0")
            const stake = true

            let txReceipt1 = await daiToken.approve(SAVING_WRAPPER, amount, { from: deployer })
            let txReceipt2 = await saveWrapper.saveViaMint(mAsset, save, vault, bAsset, amount, minOut, stake, { from: deployer })

            // let event = await getEvents(projectTokenFactory, "ProjectTokenCreated")
            // PROJECT_TOKEN = event._projectToken
            // projectToken = await ProjectToken.at(PROJECT_TOKEN)
            // console.log('\n=== PROJECT_TOKEN ===', PROJECT_TOKEN)
        })
    })

})
