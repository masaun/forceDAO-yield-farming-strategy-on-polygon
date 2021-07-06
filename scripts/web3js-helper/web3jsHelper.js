/// Web3 instance
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider(`https://polygon-mumbai.infura.io/v3/${ process.env.INFURA_KEY }`)
const web3 = new Web3(provider)

function toWei(amount) {
    return web3.utils.toWei(`${ amount }`, 'ether')
}

function fromWei(amount) {
    return web3.utils.fromWei(`${ amount }`, 'ether')
}

async function getEvents(contractInstance, eventName) {
    const _latestBlock = await getCurrentBlock()
    const LATEST_BLOCK = Number(String(_latestBlock))

    /// [Note]: Retrieve an event log of eventName (via web3.js v1.0.0)
    let events = await contractInstance.getPastEvents(eventName, {
        filter: {},
        fromBlock: LATEST_BLOCK - 10,  /// [Note]: Check emittied-events from 10 block ago (The latest block - 10)
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
