pragma solidity ^0.4.17;
contract Lottery
{
  //msg is global varible magically availbe to us msg.sender means invaotion transtion or call of address
  
    address public manager;
    address[] public players;
    
    function Lottery() public{
     manager=msg.sender;
    }    
    //payable--when someone call this function they might send ether(amount) along
    //require is used for validation
    //msg.value  amount of ether that was sent along
    //.01 ether==10000000000000000
    function enter() public payable {
        require(msg.value> .000000001 ether);
        players.push(msg.sender); 
    }
    //sha3 give sudo high random no(sudo)
    //sha3 and keccak256 same
    //algo create hash want to convert to unit
    function random() private view returns (uint)
    {
    return uint(keccak256(block.difficulty,now,players));
    } 
    function pickWinner() public restricted{
        //only manager pickthe winner want check this acc is manager then only do after lines will execute so we use require

    uint index=random()%players.length;//it will give the 0 to players length    
    players[index].transfer(this.balance); //transfer the ether to address  //balance is amount ether in the contract
    //after one round finishoff make players empty for another lottery round
 //   lastWinner =players[index];
    players = new address[](0);
        
    }
    //function modifier to check validation then only go to the function
    modifier restricted()
    {
        require(msg.sender == manager);
        _;//only rest of the code work
    }
    function getPlayers() public view returns (address[])
    {
        return players;
    }
    
    //refund costs
    // function returnEntries()
    // {
    //         require(msg.sender == manager);
    // }
}
