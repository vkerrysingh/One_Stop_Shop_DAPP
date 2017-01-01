var storeApp = angular.module("storeApp",[]);

controllers = {};
controllers.ProductController = function($scope, productFactory){
    $scope.numProducts = 0;
    init();
    
    function init(){
        $scope.numProducts = productFactory.getNumProducts();
    };
};

storeApp.controller(controllers);

storeApp.factory('productFactory',function(){
			
    var factory = {};
    factory.getNumProducts = function(){
        
        var store = Store.deployed();
        return store.getNumIds.call();       
    };

    return factory;
})