const abi = require('../contracts/ProxyEvent.abi.json');
const Web3 = require('web3');

const web3 = new Web3(Web3.givenProvider);
const proxyInfo = document.getElementById('proxyInfo');
const contractField = document.getElementById('contractField');
const attendeesField = document.getElementById('attendeesField');

window.connect = async () => {
  const accounts = await web3.eth.requestAccounts();
  proxyInfo.innerHTML = accounts[0];
}

window.registerFor = async () => {
  if (!proxyInfo.innerHTML) {
    alert('connect first');
    return;
  }
  const contract = new web3.eth.Contract(abi, contractField.value);
  const accounts = await web3.eth.requestAccounts();
  const fee = await contract.methods.fee().call();
  const attendees = await contract.methods.getAttendees().call();
  const registered = [];
  const newAttendees = attendeesField.value.split('\n');
  for (let i = 0; i < newAttendees.length; i++) {
    const newAttendee = web3.utils.toChecksumAddress(newAttendees[i]);
    if (!attendees.includes(newAttendee)) {
      contract.methods.registerFor(newAttendee)
        .send({from: proxyInfo.innerHTML, value: fee});
    }
  }
}

window.clapFor = async () => {
  if (!proxyInfo.innerHTML) {
    alert('connect first');
    return;
  }
  const contract = new web3.eth.Contract(abi, contractField.value);
  const attendees = await contract.methods.getAttendees().call();
  const clappers = attendeesField.value.split('\n');
  for (const clapper of clappers) {
    const claps = attendees.map(a =>
      Math.floor(Math.random() * 170 / attendees.length)
    );
    contract.methods.clapFor(clapper, attendees, claps)
      .send({from: proxyInfo.innerHTML});
  }
}
