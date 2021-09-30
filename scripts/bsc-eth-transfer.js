const BridgeBsc = artifacts.require('./BridgeBsc.sol');

const privKey = 'c3c94afe1621870a2f1d36dc57465a97eabfaad271c2cc82b57ef979c82a5c92';

module.exports = async done => {
  const nonce = 47; //Need to increment this for each new transfer
  const accounts = await web3.eth.getAccounts();
  //console.log(accounts)
  const bridgeBsc = await BridgeBsc.deployed();
  console.log(bridgeBsc.address)
  // console.log(bridgeEth.methods)
  const amount = web3.utils.toBN("1000000000000000000");
  //const recipient="0x9030cb08740424Ba5963d3fb31bbbE805830e330";
  const message = web3.utils.soliditySha3(
    {t: 'address', v: accounts[0]},
    {t: 'address', v: accounts[0]},
    {t: 'uint256', v: amount},
    {t: 'uint256', v: nonce},
  ).toString('hex');
  console.log(message);
  // console.log(web3)
  const { signature } = web3.eth.accounts.sign(
    message, 
    privKey
  ); 
  console.log(signature);
  console.log("started burning")
  await bridgeBsc.burn(accounts[0], amount, nonce, signature);
                            // .on('transactionhash',function(hash){console.log("hash"+hash)});
  done();
}