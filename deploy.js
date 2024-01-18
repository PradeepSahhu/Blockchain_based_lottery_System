// const HDWalletProvider = require('@truffle/hdwallet-provider');
// const { Web3 } = require('web3');
// const { interface, bytecode } = require('./compile');
//
// const provider = new HDWalletProvider(
//   'remain demise judge trim voice trip hedgehog option cactus resist best invest',
//   'https://sepolia.infura.io/v3/eec34f961eba4772833e2b3907df545c'
//   // remember to change this to your own endpoint!
// );
// const web3 = new Web3(provider);
//
// const deploy = async () => {
//   const accounts = await web3.eth.getAccounts();
//
//   console.log('Attempting to deploy from account', accounts[0]);
//
//   const result = await new web3.eth.Contract(JSON.parse(interface))
//     .deploy({ data: bytecode })
//     .send({ gas: '1000000', from: accounts[0] });
//
//   console.log(interface);
//   console.log("Contract deployed to", result.options.address);
//   // provider.engine.stop();
// };
// deploy();


const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
const { abi, evm } = require("./compile");

const provider = new HDWalletProvider(
  'remain demise judge trim voice trip hedgehog option cactus resist best invest',
  'https://sepolia.infura.io/v3/eec34f961eba4772833e2b3907df545c'
  // remember to change this to your own endpoint!
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ gas: "1000000", from: accounts[0] });

  console.log(JSON.stringify(abi));
  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();
