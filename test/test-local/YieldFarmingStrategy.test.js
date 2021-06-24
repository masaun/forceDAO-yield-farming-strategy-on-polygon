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
const ISavingsContractV2 = artifacts.require("ISavingsContractV2")

/// Deployed-addresses
const SAVINGS_CONTRACT_V2 = contractAddressList["Polygon Mainnet"]["SavingsContractV2"]

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
    let autonomousDegenVC

    /// Global variable for each contract addresses
    let AUTONOMOUS_DEGEN_VC


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
        // it("Deploy the AutonomousDegenVC contract instance", async () => {
        //     autonomousDegenVC = await AutonomousDegenVC.new(LP_DGVC_ETH, UNISWAP_V2_ROUTER_02, UNISWAP_V2_FACTORY, WETH, { from: deployer })
        //     AUTONOMOUS_DEGEN_VC = autonomousDegenVC.address
        // })

        it("Create the ICurveGauge contract instance", async () => {
            curveGauge = await ICurveGauge.at(CURVE_GAUGE)
        })

        it("[Log]: Deployer-contract addresses", async () => {
            console.log('\n=== CURVE_GAUGE ===', CURVE_GAUGE)
        })
    })

    describe("\n Workflow of the AutonomousDegenVC contract", () => {
        it("[Step 1]: Create a ProjectToken", async () => {
            const name = "Test Project Token"
            const symbol = "TPT"
            const initialSupply = toWei("100000000") 
            // let txReceipt = await projectTokenFactory.createProjectToken(name, symbol, initialSupply, { from: deployer })

            // let event = await getEvents(projectTokenFactory, "ProjectTokenCreated")
            // PROJECT_TOKEN = event._projectToken
            // projectToken = await ProjectToken.at(PROJECT_TOKEN)
            // console.log('\n=== PROJECT_TOKEN ===', PROJECT_TOKEN)
        })
    })

})
