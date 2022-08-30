const assert =require('assert');//used to make assession using test some value//inbulit in node js
const ganache = require('ganache-cli');//automatically create accounts to use
const { interfaces } = require('mocha');
const Web3 = require('web3');//constructer of web library
const web3 = new Web3(ganache.provider());//web3 instance in (which network want connect)//now we uses localhost network after we use rinkby networks like that
const { interface,bytecode}=require("../compile.js");
let accounts;
let lottery;
beforeEach(async()=>
{
//Get a list of all accounts 
// web3.eth.getAccounts()//we use one module etherum so eth it is aysnc in nature so promise
// .then(fetchedAccounts =>
//     {
//     console.log(fetchedAccounts);
//     });
//async code 
accounts = await web3.eth.getAccounts();


//Use one the accounts  to deploy the contract
lottery = await new web3.eth.Contract(JSON.parse(interface))//async take more so wait until get back so use "await"//inbox reference is a java scirpt represention of contract//using this intract with object and funs in Inbox solidity contract
.deploy({data: bytecode})// arguments for constrcer
.send({from :accounts[0], gas:'1000000'});//gas value for creating contracts, from first account
});
describe('Lottery Contract',()=>
{
it('deploys a contract',()=>{
  //  console.log(accounts);
    //  console.log(inbox);
    assert.ok(lottery.options.address);//ok method says it is defined value if undefined test will fail
});
it('allows one account to enter',async()=>{
  await lottery.methods.enter().
  send({
    from:accounts[0],
    value: web3.utils.toWei('0.02','ether' )//to specifi the amount in easiset way
  });
  const players = await lottery.methods.getPlayers().call({
    from:accounts[0]
  });
  assert.equal(accounts[0],players[0]);
  assert.equal(1,players.length);
});
it('allows multiple account to enter',async()=>{
  await lottery.methods.enter().
  send({ 
    from:accounts[0],
    value: web3.utils.toWei('0.02','ether' )//to specifi the amount in easiset way
  });
  await lottery.methods.enter().
  send({ 
    from:accounts[1],
    value: web3.utils.toWei('0.02','ether' )//to specifi the amount in easiset way
  });
  await lottery.methods.enter().
  send({ 
    from:accounts[2],
    value: web3.utils.toWei('0.02','ether' )//to specifi the amount in easiset way
  });
  const players = await lottery.methods.getPlayers().call({
    from:accounts[0]
  });
  assert.equal(accounts[0],players[0]);
  assert.equal(accounts[1],players[1]);
  assert.equal(accounts[2],players[2]);
  assert.equal(3,players.length);
});
it('require a minimum of amount of ether to enter',async()=>
{
  try{
      await lottery.methods.enter.send({
      from:accounts[0],
      value:0//in wei
      });
      assert(false);
  }
  catch(err){
  assert(err);//chech defined
  }
});
it('only manager can call pickWinner',async()=>
{
  try{
      await lottery.methods.pickWinner.send({
      from:accounts[1],
      });
      assert(false);
  }
  catch(err){
  assert(err);//chech defined
  }
});
it('sends money to the winner and resets the players array',async()=>{
await lottery.methods.enter().send({
  from :accounts[0],
  value:web3.utils.toWei('2','ether')
});
 const initialBalance = await web3.eth.getBalance(accounts[0]);//getBalance to get the external contract balance
 await lottery.methods.pickWinner().send({
   from :accounts[0]
 }) 
 const finalBalance = await web3.eth.getBalance(accounts[0]);
 const difference = finalBalance- initialBalance;
 console.log(difference);  
 assert(difference>web3.utils.toWei('1.8','ether')); 
});

});
//mocha is a test running framework for javascript and genereal purpose
 //assertion one value code produced another should be equal to that 
// class Car {
//     park()
//     {
//         return 'stopped';
//     }
//     drive()
//     {
//         return 'vroom';
//     }
// }
//mocha functions
// let car;//let means value  changed many times/ 
//before each fun work everybefore it fun excutes
// beforeEach(()=>
// {
//  car=new Car();
// });
 
// describe('Car',()=>
// {
//     it('can park',()=>
//     {
//     assert.equal(car.park(),'stopped');
//     }); 
//     it('can drive',()=>
//     {
//     assert.equal(car.drive(),'vroom');
//     }); 
// });
//truffle-hdwallet-provider@0.0.3  is a wallet provider it will unlock the account when depoly into rinkbey networks(in local network already  acccounts unlocked)