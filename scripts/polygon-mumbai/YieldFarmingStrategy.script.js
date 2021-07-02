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
const ILendingPool = artifacts.require("ILendingPool")

/// Deployed-addresses on Polygon Mumbai
const LENDING_POOL_ADDRESSES_PROVIDER = contractAddressList["Polygon Mumbai"]["AAVE"]["LendingPoolAddressesProvider"]
const LENDING_POOL = contractAddressList["Polygon Mumbai"]["AAVE"]["LendingPool"]
const DAI_TOKEN = tokenAddressList["Polygon Mumbai"]["ERC20"]["DAI"]

/// Deployed-addresses on Polygon Mumbai ([Todo]: Finally, it will be replaced with contractAddressList/tokenAddressList)
const YIELD_FARMING_STRATEGY = YieldFarmingStrategy.address
const FISH_TOKEN = FishToken.address
const MASTER_CHEF = MasterChef.address
// const YIELD_FARMING_STRATEGY = contractAddressList["Polygon Mumbai"]["YieldFarmingStrategy"]["YieldFarmingStrategy"]
// const FISH_TOKEN = tokenAddressList["Polygon Mumbai"]["Polycat"]["FishToken"]
// const MASTER_CHEF = contractAddressList["Polygon Mumbai"]["Polycat"]["MasterChef"]

/// Global contract instance
let yieldFarmingStrategy
let daiToken
let fishToken
let masterChef
let lendingPool

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

    console.log("\n------------- Workflow -------------")
    await lendToAave()
    await collateralizeForAave()
    await borrowFromAave()
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
    console.log("Create the LendingPool contract instance")
    lendingPool = await ILendingPool.at(LENDING_POOL)

    console.log("Create the DAI token contract instance")
    daiToken = await IERC20.at(DAI_TOKEN)

    console.log("Create the Fish Token contract instance")
    fishToken = await FishToken.at(FISH_TOKEN)

    console.log("Create the MasterChef contract")
    masterChef = await MasterChef.at(MASTER_CHEF)

    console.log("Create the YieldFarmingStrategy contract instance")
    yieldFarmingStrategy = await YieldFarmingStrategy.at(YIELD_FARMING_STRATEGY)

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


///-------------------------------------
/// Workflow
///-------------------------------------
async function lendToAave() {
    const asset = DAI_TOKEN         /// @notice - address of the underlying asset
    const amount = toWei("10")      /// 10 DAI
    // const onBehalfOf = deployer  /// @notice - address whom will receive the aTokens. 
    // const referralCode = 0       /// @notice - Use 0 for no referral.

    /// [Test]: Using lendingPool.deposit() directly
    // let txReceipt1 = await daiToken.approve(LENDING_POOL, amount, { from: deployer })
    // let txReceipt2 = await lendingPool.deposit(asset, amount, onBehalfOf, referralCode, { from: deployer })
    // console.log('=== txReceipt2 (deposit method) ===', txReceipt2)

    /// [Actual code]: Using yieldFarmingStrategy.lendToAave()
    let txReceipt1 = await daiToken.approve(YIELD_FARMING_STRATEGY, amount, { from: deployer })
    let txReceipt2 = await yieldFarmingStrategy.lendToAave(asset, amount, { from: deployer })
    console.log('=== txReceipt2 (lendToAave method) ===', txReceipt2)
}

async function collateralizeForAave() {
    const asset = DAI_TOKEN         /// @notice - address of the underlying asset
    const useAsCollateral = true    /// @notice - "true" if the asset should be used as collateral
    /// [Test]: Using lendingPool.setUserUseReserveAsCollateral() directly
    //let txReceipt = await lendingPool.setUserUseReserveAsCollateral(asset, useAsCollateral, { from: deployer })

    /// [Actual code]: Using yieldFarmingStrategy.collateralToAave()
    let txReceipt = await yieldFarmingStrategy.collateralToAave(asset, { from: deployer })
    console.log('=== txReceipt (setUserUseReserveAsCollateral method) ===', txReceipt)
}

async function borrowFromAave() {
    const asset = DAI_TOKEN         /// @notice - address of the underlying asset
    const amount = toWei("5")       /// 5 DAI (Note: It's possible to borrow DAI until 60% of total collateralized-asset. In this case, 10 DAI is already collateralized. Therefore, It's possible to borrow until 6 DAI)
    const interestRateMode = 2      /// @notice - the type of borrow debt. Stable: 1, Variable: 2
    const referralCode = 0
    const onBehalfOf = deployer

    /// [Test]: Using lendingPool.borrow() directly
    //let txReceipt = await lendingPool.borrow(asset, amount, interestRateMode, referralCode, onBehalfOf, { from: deployer })
    //console.log('=== txReceipt (borrow method) ===', txReceipt)

    /// [Actual code]: Using yieldFarmingStrategy.borrowFromAave()
    let txReceipt = await yieldFarmingStrategy.borrowFromAave(asset, amount, interestRateMode, { from: deployer })
    console.log('=== txReceipt (borrowFromAave method) ===', txReceipt)
}
