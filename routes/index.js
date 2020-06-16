var express = require("express");
var router = express.Router();
const Web3 = require("web3");
const ABI = require("./ServerTest.abi.json");
const tx = require("ethereumjs-tx").Transaction;

const contractAddress = "0xb948a74E560664015D5d6FbA5D43581Faa65d024";

/* GET home page. */

router.get("/", async function (req, res, next) {
  console.log(tx);
  const web3 = new Web3(
    new Web3.providers.HttpProvider("http://localhost:7545/")
  );
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);

  //Getting the account adress that will sign the transactions

  const account = "0x17D6c668ed8964172143D4e65cbc0dede5E067cC";
  const privateKey = Buffer.from(
    "f7b1f67362c1bbd53d5a74ff4ce703cde6fdba57714345fda1f6232a3f3cf778",
    "hex"
  );
  const newAddress = "0xeEC09743464be8e37Ca13e52a9E4730A035603c6";

  const ServerTest = new web3.eth.Contract(ABI, contractAddress);
  const _data = ServerTest.methods.setOwner(newAddress).encodeABI();

  const acc = accounts[0];
  const _nonce = await web3.eth.getTransactionCount(acc);

  const rawTx = {
    nonce: _nonce,
    gasPrice: "0x20000000000",
    gasLimit: "0x27511",
    to: contractAddress,
    data: _data,
  };

  var receipt = new tx(rawTx);
  receipt.sign(privateKey);

  var serializedTx = receipt.serialize();

  var _receipt = await web3.eth.sendSignedTransaction(
    "0x" + serializedTx.toString("hex")
  );
  console.log("Receipt: ", _receipt);

  res.render("index", { title: "Ethereum Server Signed Transactions ", result: JSON.stringify(_receipt) });
});

module.exports = router;
