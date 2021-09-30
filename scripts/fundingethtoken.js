const TokenEth = artifacts.require('TokenEth.sol');


module.exports = async done => {
    // if(network === 'ethTestnet') {
    //   await deployer.deploy(TokenEth);
    console.log("started miniting")
    const [recipient, _] = await web3.eth.getAccounts();
      const tokenEth = await TokenEth.deployed();
      await tokenEth.mint(recipient,web3.utils.toBN("10000000000000000000000000"));
      
    console.log("minted successfully")
    done()
}