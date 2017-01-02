// Found here https://gist.github.com/xavierlepretre/88682e871f4ad07be4534ae560692ee6
web3.eth.getTransactionReceiptMined = function (txnHash, interval) {
  var transactionReceiptAsync;
  interval = interval ? interval : 500;
  transactionReceiptAsync = function(txnHash, resolve, reject) {
    try {
      var receipt = web3.eth.getTransactionReceipt(txnHash);
      if (receipt == null) {
        setTimeout(function () {
          transactionReceiptAsync(txnHash, resolve, reject);
        }, interval);
      } else {
        resolve(receipt);
      }
    } catch(e) {
      reject(e);
    }
  };

  return new Promise(function (resolve, reject) {
      transactionReceiptAsync(txnHash, resolve, reject);
  });
};

// Found here https://gist.github.com/xavierlepretre/afab5a6ca65e0c52eaf902b50b807401
var getEventsPromise = function (myFilter, count) {
  return new Promise(function (resolve, reject) {
    count = count ? count : 1;
    var results = [];
    myFilter.watch(function (error, result) {
      if (error) {
        reject(error);
      } else {
        count--;
        results.push(result);
      }
      if (count <= 0) {
        resolve(results);
        myFilter.stopWatching();
      }
    });
  });
};

var expectedExceptionPromise = function (action, gasToUse) {
  return new Promise(function (resolve, reject) {
      try {
        resolve(action());
      } catch(e) {
        reject(e);
      }
    })
    .then(function (txn) {
      return web3.eth.getTransactionReceiptMined(txn);
    })
    .then(function (receipt) {
      // We are in Geth
      assert.equal(receipt.gasUsed, gasToUse, "should have used all the gas");
    })
    .catch(function (e) {
      if ((e + "").indexOf("invalid JUMP") > -1) {
        // We are in TestRPC
      } else {
        throw e;
      }
    });
};

contract('Store', function(accounts) {
        
    it("should not add a product if not admin", function() {
        var store = Store.deployed();

        return expectedExceptionPromise(function() {
                        return store.addProduct.call(1, 9, 10, "shirt",
                        {from: accounts[1], gas:3000000} );    
                }, 3000000);
    });
    
   it("should start with an empty balance", function() {
        var store = Store.deployed();
        
        return store.getBalance.call()
        .then(function (amt){
            console.log("Amount: " + amt.toString());
           assert.equal(amt.valueOf(),0,"should start with an empty balance") 
        });
    }); 
    
   it("should start with empty product list",function(){
      var store = Store.deployed();
       
       return store.getNumProducts.call()
       .then(function(count){
           assert.equal(count.valueOf(),0,"should start with empty product list")
       });
   });
     
    it("after adding a product, the number of products should increment",function(){
        var store = Store.deployed();
        blockNumber = web3.eth.blockNumber + 1;
        return store.addProduct(1, 10, 9, "shirt",{from: accounts[0], gas:3000000})
        .then(function(txn){
            return Promise.all([
               getEventsPromise(store.LogProductAdded(
                {},{fromBlock:blockNumber, toBlock:"latest"})),
                web3.eth.getTransactionReceiptMined(txn)
            ]);            
        })
        .then(function(eventAndreceipt){
            //console.log(eventAndreceipt);
            console.log(eventAndreceipt[0][0].args);
            return store.getNumProducts.call()
        })
        .then(function(numIds){
            console.log("Num of products: "+numIds.toString());
            assert.equal(numIds.valueOf(),1,"should have one product added");
        })
        
   });
  
    //Test for purchasing  
    it("should allow a user to purchase a product", function(){
        
        var store = Store.deployed();        
        return store.getNumProducts.call()
       .then(function(count){
            store.setAdmin(accounts[1],{gas:3000000});
            console.log("Num of products: "+count.toString());
            assert.equal(count.valueOf(),1,"should have product added from prior test");
            return store.buyProduct(1, 1,{from:accounts[2], value: 10, gas:3000000})
       })
        .then(function(txn){
            return Promise.all([
               getEventsPromise(store.LogProductPurchased(
                {},{fromBlock:blockNumber, toBlock:"latest"})),
                web3.eth.getTransactionReceiptMined(txn)
            ]);            
        })
        .then(function(eventAndreceipt){
            //console.log(eventAndreceipt);
            console.log(eventAndreceipt[0][0].args);
            return store.getBalance.call()
        })
        .then(function(balance){
            console.log("Contract balance: "+balance.toString());
            assert.equal(balance.valueOf(),10,"should be the price of 1 product");
            return store.getProductStockCount.call(1)
        })
        .then(function(stockCount){
            console.log("Stock count :",stockCount.toString());
            assert.equal(stockCount.valueOf(),8,"stck count should decrease by 1");
        })
    });
    
});