const HDWalletProvider= require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

//HDWalletProvider it synmatiously specify which account to unlock 
const provider=new HDWalletProvider(
    'virus guard flee puzzle wild output describe raccoon script merge bitter ecology',
    'https://goerli.infura.io/v3/730eec436ea24c709ed6ea431286bb00'//(rinkby infura api)
);
//web3 gives all deploy contract and send money bcz unlock the account
const web3 = new Web3(provider);

const deploy = async ()=>{
const accounts = await web3.eth.getAccounts();
console.log('Attempting to deploy from account',accounts[0]);
const result= await new web3.eth.Contract(JSON.parse(interface))
.deploy({data : bytecode})//we dont pass anything to constructer so no agruments
.send({from :accounts[0],gas:'1000000'});
console.log(interface);
console.log('Contract d eployed to',result.options.address);
};
deploy();
