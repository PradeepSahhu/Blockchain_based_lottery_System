const ganache = require('ganache');
const { Web3 } = require('web3');
// updated imports added for convenience

const { interface, bytecode } = require('../compile');
const assert = require('assert');

const web3 = new Web3(ganache.provider());

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' });
});

console.log("The accounts are : ", accounts);

describe('Lottery contract', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });


  it('allows one account to enter', async()=>{
    await lottery.methods.enter().send({
      from:accounts[0],
      value: web3.utils.toWei('0.02','ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from:accounts[0]
    });

    assert.equal(accounts[0],players[0]);
    assert.equal(1,players.length);
  });


  it('allows multiple account to enter', async()=>{
    await lottery.methods.enter().send({
      from:accounts[0],
      value: web3.utils.toWei('0.02','ether')
    });
    await lottery.methods.enter().send({
      from:accounts[1],
      value: web3.utils.toWei('0.02','ether')
    });
    await lottery.methods.enter().send({
      from:accounts[2],
      value: web3.utils.toWei('0.02','ether')
    });


    const players = await lottery.methods.getPlayers().call({
      from:accounts[0]
    });

    assert.equal(accounts[0],players[0]);
    assert.equal(accounts[1],players[1]);
    assert.equal(accounts[2],players[2]);
    assert.equal(3,players.length);
  });


  it('requires a min amount of ether to enter', async() =>{

    try{
      await lottery.methods.enter().send({
        from:accounts[0],
        value:0
      });
      assert(false);
    }catch(err){

      assert(err);
    }

  });


  it('only manager can call pickWinnter',async()=>{
    try{
      await lottery.methods.pickWinnter().send({
        from:accounts[1]
      });
      assert(false);
    }catch(err){
      assert(err); // it will fail , to check if it is failing, if it fails it passes the test.
    }
  });

  it('sends money to the winner  & resets the array', async()=>{
    await lottery.methods.enter().send({
      from:accounts[0],
      value: web3.utils.toWei('2','ether')
    });


    const initialBalance = await web3.eth.getBalance(accounts[0]);

    await lottery.methods.pickWinner().send({from:accounts[0]});

    const finalBalance = await web3.eth.getBalance(accounts[0]);

    const difference = finalBalance - initialBalance;
    // console.log(finalBalance- initialBalance);
    assert(difference > web3.utils.toWei('1.8','ether'));
  });

});
