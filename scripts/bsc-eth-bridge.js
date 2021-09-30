const Web3 = require('web3');
const BridgeBsc = require('../build/contracts/BridgeBsc.json');
const BridgeEth = require('../build/contracts/BridgeEth.json');
// const BridgeBsc = require('../build/contracts/BridgeBsc.json');
const web3Bsc = new Web3(new Web3.providers.WebsocketProvider('wss://data-seed-prebsc-2-s1.binance.org:8545/'));


// const web3Bsc = new Web3(new Web3.providers.WebsocketProvider('wss://data-seed-prebsc-1-s1.binance.org:8545'));
const web3Eth = new Web3('wss://rinkeby.infura.io/ws/v3/f113080e3691458e897d4c7ed9b85f60');
// const web3Bsc = new Web3(new Web3.providers.WebsocketProvider('wss://data-seed-prebsc-2-s1.binance.org:8545'));
const adminPrivKey = 'c3c94afe1621870a2f1d36dc57465a97eabfaad271c2cc82b57ef979c82a5c92';
const { address: admin } = web3Eth.eth.accounts.wallet.add(adminPrivKey);

const bridgeEth = new web3Eth.eth.Contract(
  BridgeEth.abi,
  //BridgeEth.networks['4'].address
  '0x25073Ec2279973E91150e25a08024de4BB7d18C3'
);

const bridgeBsc = new web3Bsc.eth.Contract(
  BridgeBsc.abi,
  //BridgeBsc.networks['97'].address
  '0x9f9411cD26F620eaCc972039902f84792c0E27eB'
);
console.log("started listening");

bridgeBsc.events.Transfer()
.on("connected", function(subscriptionId){
  console.log(subscriptionId);
})
.on('data', async (event) => {
  console.log(event)
  const { from, to, amount, date, nonce, signature } = event.returnValues;
  // console.log(from)
  console.log("bridge started listening");
  const tx = bridgeEth.methods.mint(from, to, amount, nonce, signature);
  const [gasPrice, gasCost] = await Promise.all([
    web3Eth.eth.getGasPrice(),
    tx.estimateGas({from: admin}),
  ]);
  const data = tx.encodeABI();
  const txData = {
    from: admin,
    to: bridgeEth.options.address,
    data,
    gas: gasCost,
    gasPrice
  };
  const receipt = await web3Eth.eth.sendTransaction(txData);
  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(`
    Processed transfer:
    - from ${from} 
    - to ${to} 
    - amount ${amount} tokens
    - date ${date}
    - nonce ${nonce}
  `);
});
