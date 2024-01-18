// import logo from "./logo.svg";
// import "./App.css";
// import React from "react";
// import web3 from './web3';
// import lottery from './lottery';
//
// class App extends React.Component {
//
//   state = {
//     manager : '',
//     players: [],
//     balance:'',
//     value:'',
//     message:''
//   };
//
//
//   async componentDidMount(){
//     const manager = await lottery.methods.manager().call();
//     const players = await lottery.methods.getPlayers().call();
//     const balance = await web3.eth.getBalance(lottery.options.address);
//
//     this.setState({manager, players,balance});
//   }
//
//   onSubmit = async (event) => {
//     event.preventDefault();
//
//     const accounts = await web3.eth.getAccounts();
//
//     this.setState({message : 'waiting on transaction success...'})
//
//     await lottery.methods.enter().send({
//       from : accounts[0],
//       value : web3.utils.toWei(this.state.value,'ether')
//     });
//
//     this.setState({message:'you have been entered!'});
//
//   };
//
//   onClick= async() => {
//     const accounts = await web3.eth.getAccounts();
//
//     this.setState({message : 'waiting on transaction success...'})
//     await lottery.methods.pickWinner().send({
//       from:accounts[0]
//     });
//
//       this.setState({message:'A winner has been picked'});
//
//
//   };
//   render() {
//     // web3.eth.getAccounts().then(console.log);
//     return (
//       <>
//       <h2>Lottery Contract</h2>
//       <p>This contract is managed by {this.state.manager}
//       There are currently {this.state.players.length} people entered competing to win
//       {web3.utils.fromWei(this.state.balance,'ether')} ether!
//
//       </p>
//       <hr/>
//       <form onSubmit={this.onSubmit}>
//       <h4> want to try your luck</h4>
//       <div>
//       <label> Amount to ether to enter</label>
//       <input value={this.state.value} onChange={event => this.setState({value: event.target.value})} />
//       </div>
//       <button> Enter </button>
//       </form>
//       <hr/>
//       <h3> Ready to pick a winner?</h3>
//       <button  onClick={this.onClick}> pick a winner! </button>
//       <hr/>
//       <h1> {this.state.message} </h1>
//       </>
//     );
//   }
// }
// export default App;


import React, { useState, useEffect } from "react";
import web3 from "./web3";
import lottery from "./lottery";


function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);

      setManager(manager);
      setPlayers(players);
      setBalance(balance);
    }

    fetchData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transaction success...");

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });

    setMessage("You have been entered!");
  }

  async function handleClick() {
    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transaction success...");

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage("A winner has been picked!");
  }

  async function currentAccount(){
    const accounts = await web3.eth.getAccounts();
    return accounts == manager ? true : false;
  }

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager}. There are currently{" "}
        {players.length} people entered, competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether!
      </p>

      <hr />
      <form onSubmit={handleSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>
        <button>Enter</button>
      </form>

      <hr />

      <h4>Ready to pick a winner?</h4>
      <button onClick={handleClick}>Pick a winner!</button>

      <hr />

      <h1>{message}</h1>
    </div>
  );
}

export default App;
