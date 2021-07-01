const FishToken = artifacts.require("FishToken")

module.exports = async function(deployer) {
    await deployer.deploy(FishToken)
}
