const Web3 = require('web3');
const BridgeEth = require('../build/contracts/BridgeEth.json');
const BridgeBsc = require('../build/contracts/BridgeBsc.json');

const web3Eth = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/f113080e3691458e897d4c7ed9b85f60'));
const web3Bsc = new Web3('https://data-seed-prebsc-2-s1.binance.org:8545');
const adminPrivKey = 'c3c94afe1621870a2f1d36dc57465a97eabfaad271c2cc82b57ef979c82a5c92';
const { address: admin } = web3Bsc.eth.accounts.wallet.add(adminPrivKey);

const bridgeEth = new web3Eth.eth.Contract(
  BridgeEth.abi,
  // BridgeEth.networks['4'].address
  '0x25073Ec2279973E91150e25a08024de4BB7d18C3'
);

const bridgeBsc = new web3Bsc.eth.Contract(
  BridgeBsc.abi,
  // BridgeBsc.networks['97'].address
  '0x9f9411cD26F620eaCc972039902f84792c0E27eB'
);

bridgeEth.events.Transfer(
)
.on('data', async event => {
  const { from, to, amount, date, nonce, signature } = event.returnValues;
  console.log("bridge started listening");
  const tx = bridgeBsc.methods.mint(from, to, amount, nonce, signature);
  const [gasPrice, gasCost] = await Promise.all([
    web3Bsc.eth.getGasPrice(),
    tx.estimateGas({from: admin}),
  ]);
  const data = tx.encodeABI();
  const txData = {
    from: admin,
    to: bridgeBsc.options.address,
    data,
    gas: gasCost,
    gasPrice
  };
  const receipt = await web3Bsc.eth.sendTransaction(txData);
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
