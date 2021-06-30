require('dotenv').config()
//const Tx = require('ethereumjs-tx').Transaction

/// Web3 instance
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider(`https://polygon-mumbai.infura.io/v3/${ process.env.INFURA_KEY }`)
const web3 = new Web3(provider)

/// web3.js related methods
const { toWei, fromWei, getEvents, getCurrentBlock, getCurrentTimestamp } = require('../web3js-helper/web3jsHelper')

/// Import deployed-addresses
const contractAddressList = require("../../migrations/addressesList/contractAddress/contractAddress.js")
const tokenAddressList = require("../../migrations/addressesList/tokenAddress/tokenAddress.js")

/// Artifact of smart contracts 
const YieldFarmingStrategy = artifacts.require("YieldFarmingStrategy")
const DAIMockToken = artifacts.require("DAIMockToken")

/// Deployed-addresses on Polygon Mumbai
const LENDING_POOL_ADDRESSES_PROVIDER = contractAddressList["Polygon Mumbai"]["AAVE"]["LendingPoolAddressesProvider"]
//const LP_TOKEN = tokenAddressList["Polygon Mumbai"]["AAVE"][""]

/// Variable to assign a YieldFarmingStrategy contract address
let YIELD_FARMING_STRATEGY

/// Global contract instance
let yieldFarmingStrategy

/// Acccounts
let deployer


/***
 * @dev - Execution COMMAND: $ npm run script:YieldFarmingStrategy
 *        ($ truffle exec ./scripts/polygon-mumbai/YieldFarmingStrategy.script.js --network polygon_testnet) 
 **/


///-----------------------------------------------
/// Execute all methods
///-----------------------------------------------

/// [Note]: For truffle exec (Remarks: Need to use module.exports)
module.exports = function(callback) {
    main().then(() => callback()).catch(err => callback(err))
};

async function main() {
    console.log("\n------------- Set wallet addresses -------------")
    await setWalletAddress()

    console.log("\n------------- Deploy smart contracts on Polygon mumbai testnet -------------")
    await DeploySmartContracts()
}


///-----------------------------------------------
/// Methods
///-----------------------------------------------
async function setWalletAddress() {
    console.log("Wallet address should be assigned into deployer")
    deployer = process.env.DEPLOYER_ADDRESS
    //deployer = process.env.EXECUTOR_ADDRESS

    /// [Log]
    console.log('=== deployer ===', deployer)
}

async function DeploySmartContracts() {
    console.log("Deploy the YieldFarmingStrategyToken contract instance")
    // YieldFarmingStrategyToken = await YieldFarmingStrategyToken.new({ from: deployer })
    // //YieldFarmingStrategyToken = await YieldFarmingStrategyToken.at(YieldFarmingStrategy_TOKEN)
    // YieldFarmingStrategy_TOKEN = YieldFarmingStrategyToken.address


    // /// Logs (each deployed-contract addresses)
    // console.log('=== REWARD_TOKEN ===', REWARD_TOKEN)
    // console.log('=== LP_TOKEN ===', LP_TOKEN)    
    // console.log('=== YieldFarmingStrategy ===', YieldFarmingStrategy)
}
