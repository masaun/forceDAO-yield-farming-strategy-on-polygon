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
const MasterChef = artifacts.require("MasterChef")
const FishToken = artifacts.require("FishToken")
const IERC20 = artifacts.require("IERC20")

/// Deployed-addresses on Polygon Mumbai
const YIELD_FARMING_STRATEGY = contractAddressList["Polygon Mumbai"]["YieldFarmingStrategy"]["YieldFarmingStrategy"]
const LENDING_POOL_ADDRESSES_PROVIDER = contractAddressList["Polygon Mumbai"]["AAVE"]["LendingPoolAddressesProvider"]
const DAI_TOKEN = tokenAddressList["Polygon Mumbai"]["ERC20"]["DAI"]
const FISH_TOKEN = tokenAddressList["Polygon Mumbai"]["Polycat"]["FishToken"]
const MASTER_CHEF = contractAddressList["Polygon Mumbai"]["Polycat"]["MasterChef"]

/// Global contract instance
let yieldFarmingStrategy
let daiToken
let fishToken
let masterChef

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
    console.log("Create the DAI token contract instance")
    daiToken = await IERC20.at(DAI_TOKEN)

    // console.log("Create the Fish Token contract instance")
    // fishToken = await FishToken.at(FISH_TOKEN)

    // console.log("Create the MasterChef contract")
    // masterChef = await MasterChef.at(MASTER_CHEF)

    // console.log("Create the YieldFarmingStrategy contract instance")
    // yieldFarmingStrategy = await YieldFarmingStrategy.at(YIELD_FARMING_STRATEGY)


    // console.log("Deploy the Fish Token")
    // fishToken = await FishToken.new({ from: deployer })
    // FISH_TOKEN = fishToken.address

    // console.log("Deploy the MasterChef contract")
    // const startBlock = 1
    // const devAddress = process.env.DEV_ADDRESS
    // const feeAddress = process.env.FEE_ADDRESS
    // const vaultAddress = process.env.VAULT_ADDRESS
    // masterChef = await MasterChef.new(FISH_TOKEN, startBlock, devAddress, feeAddress, vaultAddress, { from: deployer })
    // MASTER_CHEF = masterChef.address

    // console.log("Transfer ownership of the FishToken to the MasterChef contract")
    // let txReceipt = await fishToken.transferOwnership(MASTER_CHEF, { from: deployer })

    // console.log("Deploy the YieldFarmingStrategy contract instance")
    // yieldFarmingStrategy = await YieldFarmingStrategy.new(LENDING_POOL_ADDRESSES_PROVIDER, MASTER_CHEF, DAI_TOKEN, { from: deployer })
    // YIELD_FARMING_STRATEGY = yieldFarmingStrategy.address

    /// [Log]: Deployer-contract addresses
    console.log('\n=== FISH_TOKEN ===', FISH_TOKEN)
    console.log('\n=== DAI_TOKEN ===', DAI_TOKEN)
    console.log('\n=== MASTER_CHEF ===', MASTER_CHEF)
    console.log('\n=== LENDING_POOL_ADDRESSES_PROVIDER ===', LENDING_POOL_ADDRESSES_PROVIDER)            
    console.log('\n=== YIELD_FARMING_STRATEGY ===', YIELD_FARMING_STRATEGY) 
}
