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
    
    modifier notFromAuthUser {
        if (msg.sender == owner || msg.sender == admin) throw;
        _;
    }
    
    //events
    event LogProductAdded(uint id, uint price, uint stock, string name);
    event LogProductPurchased(uint id, uint productAmount, uint pricePaid);
    
    function Store(){
        owner = msg.sender;        
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
    
    //Check that sender is not an owner or an admin
    function buyProduct(uint productId, uint productAmount) payable notFromAuthUser returns (bool successful) {
        if (products[productId].stock >= productAmount ){
            if (msg.value == (products[productId].price * productAmount)) {
                products[productId].stock -= productAmount;                                
                LogProductPurchased(productId, productAmount, msg.value);
                return true;
            }
            else
                throw;
        }
        else
            throw;                        
    }
    
    function withdrawFromContract(uint amount) payable returns (bool successful){
        if (amount >= this.balance){            
            if(!owner.send(this.balance - amount))
                throw;
        }
        else
            throw;
    }
    
    function getProductCount() returns (uint productCount){
        return ids.length;
    }
    
    function getProductStockCount(uint productId) returns (uint stockCount){
        return products[productId].stock;
    }
    
    function setAdmin(address adminAddress) private returns (bool success){
        admin = adminAddress;
        return true;
    }
    
    function getBalance() constant returns (uint){
        return this.balance;
    }
    
    
}