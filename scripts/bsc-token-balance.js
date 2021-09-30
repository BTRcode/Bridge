const TokenBsc = artifacts.require('./TokenBsc.sol');

module.exports = async done => {
  const accounts = await web3.eth.getAccounts();
  const tokenBsc = await TokenBsc.deployed();
  let balance = await tokenBsc.balanceOf(accounts[0]);
  console.log(balance.toString());
  balance = await tokenBsc.balanceOf(accounts[1]);
  console.log(balance.toString());
  balance = await tokenBsc.balanceOf(accounts[2]);
  console.log(balance.toString());
  done();
}
