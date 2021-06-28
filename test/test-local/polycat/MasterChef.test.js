/// Using local network
const Web3 = require('web3')
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

/// Zero address
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"


/**
 * @notice - This is the test of MasterChef.sol
 * @notice - [Execution command]: $ truffle test ./test/test-local/MasterChef.test.js --network local
 * @notice - [Note]: When you execute this test, you need to execute "ganache-cli -d" in advance
 */
contract("MasterChef", function(accounts) {
    /// Acccounts
    let deployer = accounts[0]
    let admin = accounts[0]
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

        it("Transfer ownership of the FishToken to the MasterChef contract", async () => {
            let txReceipt = await fishToken.transferOwnership(MASTER_CHEF, { from: deployer })
        })

        it("[Log]: Deployer-contract addresses", async () => {
            console.log('\n=== FISH_TOKEN ===', FISH_TOKEN)
            console.log('\n=== DAI_TOKEN ===', DAI_TOKEN)
            console.log('\n=== MASTER_CHEF ===', MASTER_CHEF)
        })
    })

    describe("\n Preparation in advance", () => {
        it("Transfer 1000 DAI from deployer to 3 users (user1, user2, user3)", async () => {
            const amount = toWei("1000")  /// 1000 $DAI
            let txReceipt1 = await daiToken.transfer(user1, amount, { from: deployer })
            let txReceipt2 = await daiToken.transfer(user2, amount, { from: deployer })
            let txReceipt3 = await daiToken.transfer(user3, amount, { from: deployer })
        })
    })

    describe("\n Workflow of the MasterChef contract", () => {

        ///---------------------------------------------------
        /// @notice - Reference from my "NFT-yield-farming" repo
        ///           ( https://github.com/masaun/NFT-yield-farming/blob/ethereum_master_20210217/test/test-local/NFTYieldFarming.test.js )
        ///---------------------------------------------------

        it("add() - Add a new ERC20 Token (DAI) Pool as a target", async () => {
            const allocPoint = "100"
            const lpToken = DAI_TOKEN   /// [Note]: Using ERC20 Token (DAI) as a single staking pool
            const depositFeeBP = 4      /// [Note]: Deposit Fee == 4%
            let txReceipt = await masterChef.add(allocPoint, lpToken, depositFeeBP, { from: deployer })
        })

        it("deposit() - User1 stake 10 DAI at block 310", async () => {
            /// [Note]: Block to mint the FishToken start from block 300.
            /// User1 stake (deposit) 10 DAI tokens at block 310.
            await time.advanceBlockTo("309")

            const poolId = 0
            const stakeAmount = toWei('10')  /// 10 DAI
            const referrer = ZERO_ADDRESS

            let txReceipt1 = await daiToken.approve(MASTER_CHEF, stakeAmount, { from: user1 })
            let txReceipt2 = await masterChef.deposit(poolId, stakeAmount, referrer, { from: user1 })
        })

        it("deposit() - User2 stake 20 DAI at block 314", async () => {
            /// [Note]: Block to mint the FishToken start from block 300.
            /// User2 stake (deposit) 20 DAI at block 314.
            await time.advanceBlockTo("313")

            const poolId = 0
            const stakeAmount = toWei('20')  /// 20 DAI
            const referrer = ZERO_ADDRESS

            let txReceipt1 = await daiToken.approve(MASTER_CHEF, stakeAmount, { from: user2 })
            let txReceipt2 = await masterChef.deposit(poolId, stakeAmount, referrer, { from: user2 })
        })

        it("deposit() - User3 stake 30 DAI at block 318", async () => {
            /// [Note]: Block to mint the FishToken start from block 300.
            /// User3 stake (deposit) 30 DAI at block 318
            await time.advanceBlockTo("317")

            const poolId = 0
            const stakeAmount = toWei('30')  /// 30 DAI
            const referrer = ZERO_ADDRESS

            let txReceipt1 = await daiToken.approve(MASTER_CHEF, stakeAmount, { from: user3 })
            let txReceipt2 = await masterChef.deposit(poolId, stakeAmount, referrer, { from: user3 })
        })

        it("deposit() - User1 stake more 10 DAI at block 320", async () => {
            /// [Note]: Block to mint the FishToken start from block 300.
            /// User1 stake (deposit) 10 more DAI at block 320.
            await time.advanceBlockTo("319")

            const poolId = 0
            const stakeAmount = toWei('10')  /// 10 DAI
            const referrer = ZERO_ADDRESS

            let txReceipt1 = await daiToken.approve(MASTER_CHEF, stakeAmount, { from: user1 })
            let txReceipt2 = await masterChef.deposit(poolId, stakeAmount, referrer, { from: user1 })
        })


        it("Current block should be at block 321", async () => {
            let currentBlock = await time.latestBlock()
            console.log('=== currentBlock ===', String(currentBlock))

            assert.equal(
                currentBlock,
                "321",
                "Current block should be 321"
            )
        })

        it("Total Supply of the FishToken should be 11000 (at block 321)", async () => {
            ///  At this point (At block 321): 
            ///      TotalSupply of FishToken: 1000 * (321 - 310) = 11000
            ///      User1 should have: 4*1000 + 4*1/3*1000 + 2*1/6*1000 = 5666
            ///      NFTYieldFarming contract should have the remaining: 10000 - 5666 = 4334
            let totalSupplyOfFishToken = await fishToken.totalSupply()
            console.log('=== totalSupplyOfFishToken ===', String(totalSupplyOfFishToken))
            assert.equal(
                Math.round(web3.utils.fromWei(totalSupplyOfFishToken, 'ether')),
                11000,  /// [Note]: This is amount value rounded.
                "Total supply of the Governance tokens (at block 321) should be 11000"
            )
        })

        it("FishToken balance of user1 should be 5667 (at block 321)", async () => {
            let fishTokenBalanceOfUser1 = await fishToken.balanceOf(user1, { from: user1 })
            console.log('=== FishToken balance of user1 ===', String(fishTokenBalanceOfUser1))
            assert.equal(
                Math.round(web3.utils.fromWei(fishTokenBalanceOfUser1, 'ether')),
                5667,  /// [Note]: This is amount value rounded.
                "FishToken balance of user1 should be 5667 (at block 321)"
            )
        })

        it("FishToken balance of user2, user3, admin (at block 321)", async () => {
            let fishTokenBalanceOfUser2 = await fishToken.balanceOf(user2, { from: user2 })
            console.log('=== FishToken balance of user2 ===', String(fishTokenBalanceOfUser2))

            let fishTokenBalanceOfUser3 = await fishToken.balanceOf(user3, { from: user3 })
            console.log('=== FishToken balance of user3 ===', String(fishTokenBalanceOfUser3))

            let fishTokenBalanceOfAdmin = await fishToken.balanceOf(admin, { from: user3 })
            console.log('=== FishToken balance of admin ===', String(fishTokenBalanceOfAdmin))
        })

        it("FishToken balance of the NFTYieldFarming contract should be 4333 (at block 321)", async () => {
            let fishTokenBalance = await fishToken.balanceOf(MASTER_CHEF, { from: user1 })
            console.log('=== FishToken balance of the NFTYieldFarming contract ===', String(fishTokenBalance))
            assert.equal(
                Math.round(web3.utils.fromWei(fishTokenBalance, 'ether')),
                4333,  /// [Note]: This is amount value rounded.
                "FishToken balance of the NFTYieldFarming contract should be 4333 (at block 321)"
            )
        })

        it("Un-stake and withdraw 10 DAI and receive 5952 FishToken as rewards (at block 322)", async () => {
            /// [Note]: Total DAI amount staked of user1 is 20 DAI tokens at block 321.
            /// [Note]: Therefore, maximum withdraw amount for user1 is 20 DAI
            const poolId = 0
            const unStakeAmount = toWei('10')  /// 10 DAI
            let txReceipt = await masterChef.withdraw(poolId, unStakeAmount, { from: user1 })
        
            let fishTokenBalanceOfUser1 = await fishToken.balanceOf(user1, { from: user1 })
            console.log('=== FishToken balance of user1 ===', String(fishTokenBalanceOfUser1))
        })


    })

})
