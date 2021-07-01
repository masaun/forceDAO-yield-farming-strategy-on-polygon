require('dotenv').config()

/// Import deployed-addresses
const contractAddressList = require("./addressesList/contractAddress/contractAddress.js")
const tokenAddressList = require("./addressesList/tokenAddress/tokenAddress.js")

const MasterChef = artifacts.require("MasterChef")
const FishToken = artifacts.require("FishToken")

const FISH_TOKEN = FishToken.address
//const FISH_TOKEN = tokenAddressList["Polygon Mumbai"]["Polycat"]["FishToken"]

const startBlock = 1
const devAddress = process.env.DEV_ADDRESS
const feeAddress = process.env.FEE_ADDRESS
const vaultAddress = process.env.VAULT_ADDRESS


module.exports = async function(deployer) {
    await deployer.deploy(MasterChef, FISH_TOKEN, startBlock, devAddress, feeAddress, vaultAddress)

    let masterChef = await MasterChef.deployed()
    let MASTER_CHEF = masterChef.address

    /// Transfer ownership of the FishToken to the MasterChef contract
    let fishToken  = await FishToken.at(FISH_TOKEN)
    let txReceipt = await fishToken.transferOwnership(MASTER_CHEF)
}
