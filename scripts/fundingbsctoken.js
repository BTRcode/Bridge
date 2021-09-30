const TokenBsc = artifacts.require('TokenBsc.sol');


module.exports = async done => {
    // if(network === 'ethTestnet') {
    //   await deployer.deploy(TokenEth);
    console.log("started miniting")
    const [recipient, _] = await web3.bsc.getAccounts();
      const tokenBsc = await TokenBsc.deployed();
      await tokenBsc.mint(recipient,web3.utils.toBN("10000000000000000000000000"));
      
    console.log("minted successfully")
    done()
}
