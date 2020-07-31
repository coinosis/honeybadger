const abi = require('../contracts/ProxyEvent.abi.json');
const Web3 = require('web3');
const addresses = require('./addresses.js');

const web3 = new Web3(Web3.givenProvider);
const address = document.getElementById('contract');
const amount = document.getElementById('attendees');
let registeredTotal = [];

window.register = async () => {
  const accounts = await web3.eth.requestAccounts();
  const contract = new web3.eth.Contract(abi, address.value);
  const fee = await contract.methods.fee().call();
  const attendees = await contract.methods.getAttendees().call();
  const registered = [];
  for (let i = 0; i < 50; i++) {
    if (!attendees.includes(web3.utils.toChecksumAddress(addresses[i]))) {
      contract.methods.registerFor(addresses[i])
        .send({from: accounts[0], value: fee});
      registered.push(addresses[i]);
      if (registered.length >= amount.value) break;
    }
  }
  registeredTotal = [...registeredTotal, ...registered];
}

window.vote = async () => {
  const accounts = await web3.eth.requestAccounts();
  const contract = new web3.eth.Contract(abi, address.value);
  const attendees = await contract.methods.getAttendees().call();
  const claps = attendees.map(a =>
    Math.floor(Math.random() * 170 / attendees.length)
  );
  contract.methods.clapFor(registeredTotal[0], attendees, claps)
    .send({from: accounts[0]});
}
