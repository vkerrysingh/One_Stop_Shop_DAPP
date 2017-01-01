pragma solidity ^0.4.6;

contract Admin {
    address public admin;
    
    function Admin(){
        admin = msg.sender;
    }
    
    modifier fromAdmin {
        if (msg.sender != admin) throw;
        _;
    }
}