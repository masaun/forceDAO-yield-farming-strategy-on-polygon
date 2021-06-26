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

        ///---------------------------------------------------
        /// @notice - Reference from my "NFT-yield-farming" repo
        ///           ( https://github.com/masaun/NFT-yield-farming/blob/ethereum_master_20210217/test/test-local/NFTYieldFarming.test.js )
        ///---------------------------------------------------

        it("Add a new NFT Pool as a target", async () => {
            const _nftToken = NFT_TOKEN  /// NFT token as a target to stake
            const _lpToken = LP_TOKEN    /// LP token to be staked
            const _allocPoint = "100"
            const _withUpdate = true    
            let txReceipt = await nftYieldFarming.addNFTPool(_nftToken, _lpToken, _allocPoint, _withUpdate, { from: deployer })
        })

        it("User1 stake 10 LP tokens at block 310", async () => {
            /// [Note]: Block to mint the GovernanceToken start from block 300.
            /// User1 stake (deposit) 10 LP tokens at block 310.
            await time.advanceBlockTo("309")

            const _nftPoolId = 0
            //const _stakeAmount = "10"  /// 10 LP Token
            const _stakeAmount = web3.utils.toWei('10', 'ether')  /// 10 LP Token

            let txReceipt1 = await lpToken.approve(NFT_YIELD_FARMING, _stakeAmount, { from: user1 })
            let txReceipt2 = await nftYieldFarming.deposit(_nftPoolId, _stakeAmount, { from: user1 })
        })

        it("User2 stake 20 LP tokens at block 314", async () => {
            /// [Note]: Block to mint the GovernanceToken start from block 300.
            /// User2 stake (deposit) 20 LP tokens at block 314.
            await time.advanceBlockTo("313")

            const _nftPoolId = 0
            //const _stakeAmount = "20"  /// 20 LP Token
            const _stakeAmount = web3.utils.toWei('20', 'ether')  /// 20 LP Token

            let txReceipt1 = await lpToken.approve(NFT_YIELD_FARMING, _stakeAmount, { from: user2 })
            let txReceipt2 = await nftYieldFarming.deposit(_nftPoolId, _stakeAmount, { from: user2 })
        })

        it("User3 stake 30 LP tokens at block 318", async () => {
            /// [Note]: Block to mint the GovernanceToken start from block 300.
            /// User3 stake (deposit) 30 LPs at block 318
            await time.advanceBlockTo("317")

            const _nftPoolId = 0
            //const _stakeAmount = "30"  /// 30 LP Token
            const _stakeAmount = web3.utils.toWei('30', 'ether')  /// 30 LP Token

            let txReceipt1 = await lpToken.approve(NFT_YIELD_FARMING, _stakeAmount, { from: user3 })
            let txReceipt2 = await nftYieldFarming.deposit(_nftPoolId, _stakeAmount, { from: user3 })
        })

        it("User1 stake more 10 LP tokens at block 320", async () => {
            /// [Note]: Block to mint the GovernanceToken start from block 300.
            /// User1 stake (deposit) 10 more LP tokens at block 320.
            await time.advanceBlockTo("319")

            const _nftPoolId = 0
            //const _stakeAmount = "10"  /// 10 LP Token
            const _stakeAmount = web3.utils.toWei('10', 'ether')  /// 10 LP Token

            let txReceipt1 = await lpToken.approve(NFT_YIELD_FARMING, _stakeAmount, { from: user1 })
            let txReceipt2 = await nftYieldFarming.deposit(_nftPoolId, _stakeAmount, { from: user1 })
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

        it("Total Supply of the GovernanceToken should be 11000 (at block 321)", async () => {
            ///  At this point (At block 321): 
            ///      TotalSupply of GovernanceToken: 1000 * (321 - 310) = 11000
            ///      User1 should have: 4*1000 + 4*1/3*1000 + 2*1/6*1000 = 5666
            ///      NFTYieldFarming contract should have the remaining: 10000 - 5666 = 4334
            let totalSupplyOfGovernanceToken = await governanceToken.totalSupply()
            console.log('=== totalSupplyOfGovernanceToken ===', String(totalSupplyOfGovernanceToken))
            assert.equal(
                Math.round(web3.utils.fromWei(totalSupplyOfGovernanceToken, 'ether')),
                11000,  /// [Note]: This is amount value rounded.
                "Total supply of the Governance tokens (at block 321) should be 11000"
            )
        })

        it("GovernanceToken balance of user1 should be 5667 (at block 321)", async () => {
            let governanceTokenBalanceOfUser1 = await governanceToken.balanceOf(user1, { from: user1 })
            console.log('=== GovernanceToken balance of user1 ===', String(governanceTokenBalanceOfUser1))
            assert.equal(
                Math.round(web3.utils.fromWei(governanceTokenBalanceOfUser1, 'ether')),
                5667,  /// [Note]: This is amount value rounded.
                "GovernanceToken balance of user1 should be 5667 (at block 321)"
            )
        })

        it("GovernanceToken balance of user2, user3, admin (at block 321)", async () => {
            let governanceTokenBalanceOfUser2 = await governanceToken.balanceOf(user2, { from: user2 })
            console.log('=== GovernanceToken balance of user2 ===', String(governanceTokenBalanceOfUser2))

            let governanceTokenBalanceOfUser3 = await governanceToken.balanceOf(user3, { from: user3 })
            console.log('=== GovernanceToken balance of user3 ===', String(governanceTokenBalanceOfUser3))

            let governanceTokenBalanceOfAdmin = await governanceToken.balanceOf(admin, { from: user3 })
            console.log('=== GovernanceToken balance of admin ===', String(governanceTokenBalanceOfAdmin))
        })

        it("GovernanceToken balance of the NFTYieldFarming contract should be 4333 (at block 321)", async () => {
            let governanceTokenBalance = await governanceToken.balanceOf(NFT_YIELD_FARMING, { from: user1 })
            console.log('=== GovernanceToken balance of the NFTYieldFarming contract ===', String(governanceTokenBalance))
            assert.equal(
                Math.round(web3.utils.fromWei(governanceTokenBalance, 'ether')),
                4333,  /// [Note]: This is amount value rounded.
                "GovernanceToken balance of the NFTYieldFarming contract should be 4333 (at block 321)"
            )
        })

        it("Un-stake and withdraw 10 LP tokens and receive 5952 GovernanceToken as rewards (at block 322)", async () => {
            /// [Note]: Total LPs amount staked of user1 is 20 LP tokens at block 321.
            /// [Note]: Therefore, maximum withdraw amount for user1 is 20 LPs
            const _nftPoolId = 0
            //const _unStakeAmount = "10"  /// 10 LP Token 
            const _unStakeAmount = web3.utils.toWei('10', 'ether')  /// 10 LP Token
            let txReceipt = await nftYieldFarming.withdraw(_nftPoolId, _unStakeAmount, { from: user1 })
        
            let governanceTokenBalanceOfUser1 = await governanceToken.balanceOf(user1, { from: user1 })
            console.log('=== GovernanceToken balance of user1 ===', String(governanceTokenBalanceOfUser1))
        })


    })

})
