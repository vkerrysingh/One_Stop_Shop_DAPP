pragma solidity ^0.4.6;
import "Admin.sol";

contract Store is Admin {
    
    struct Product{
        uint price;
        uint stock; //amount in stock
        string name;
    }
    
    mapping(uint => Product) public products;
    uint[] public ids;
    address owner;
    
    uint private balance; //holds the value of the contract
    uint private ownersWallet; //holds what was withdrawn from the contract(balance).
    
    //modifer owner check
    modifier fromOwner {
        if (msg.sender != owner) throw;
        _;
    }
    
    //events
    event LogProductAdded(uint id, uint price, uint stock, string name);
    
    function Store(){
        owner = msg.sender;
        balance = 0;
    }
    
    function getNumProducts() returns (uint productCount){
        return ids.length;
    }
    
    
    function addProduct(uint id, uint price, uint stock, string name) fromAdmin returns (bool successful){
        products[id] = Product({
            price: price,
            stock: stock,
            name: name
        });
        ids.push(id);
        LogProductAdded(id, price, stock, name );
        return true;
    }
    
    function buyProduct(uint productId, uint amount) returns (bool successful){
        if (msg.sender != owner || msg.sender != admin)
        {
            if (products[id].stock >= amount )
            {
                products[id].stock = products[id].stock - amount;
                balance = balance + products[id].price;                
            }
        }
        else
            throw;        
    }
    
    function getBalance() returns (uint){
        return balance;
    }
}