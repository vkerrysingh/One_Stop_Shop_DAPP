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
    
    modifier authRole {
        if (msg.sender == owner || msg.sender == admin) throw;
        _;
    }
    
    //events
    event LogProductAdded(uint id, uint price, uint stock, string name);
    event LogProductPurchased(uint id, uint productAmount, uint pricePaid);
    
    function Store(){
        owner = msg.sender;
        balance = 0;
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
    
    function buyProduct(uint productId, uint productAmount) payable authRole returns (uint price){
                
        if (products[productId].stock >= productAmount ){
            if (msg.value == products[productId].price){
                products[productId].stock = products[productId].stock - productAmount;
                balance = balance + msg.value;   
                if (!owner.send(msg.value))
                    throw;
                LogProductPurchased(productId, productAmount, msg.value);
                return owner.balance;
            }
            else
                throw;
        }
        else
            throw;                        
    }
    
    function getNumProducts() returns (uint productCount){
        return ids.length;
    }
    
    function getProductStockCount(uint productId) returns (uint stockCount){
        return products[productId].stock;
    }
    
    function setAdmin(address adminAddress) returns (bool success){
        admin = adminAddress;
    }
    
    function getBalance() returns (uint){
        return balance;
    }
}