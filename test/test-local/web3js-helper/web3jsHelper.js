/// Using local network
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

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

async function getCurrentBlock() {
    const currentBlock = await web3.eth.getBlockNumber()
    return currentBlock
}

async function getCurrentTimestamp() {
    const currentBlock = await web3.eth.getBlockNumber()
    const currentTimestamp = await web3.eth.getBlock(currentBlock).timestamp

    return currentTimestamp
}

/// Export methods
module.exports = { toWei, fromWei, getEvents, getCurrentBlock, getCurrentTimestamp }
