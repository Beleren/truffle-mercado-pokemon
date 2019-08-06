const PokeCoin = artifacts.require("./PokeCoin");
const PokeCentral = artifacts.require("./PokeCentral");
const PokeMarket = artifacts.require("./PokeMarket");

account1Demo = '0x564449533d62177f1cfd847e6219633744867d42';
account2Demo = '0x8d87d8bc7c7d09966808d153c270e5b4a65f057e';
pokeCoinAddress = '';
pokeCentralAddress = '';
module.exports = function(deployer) {
  deployer.deploy(PokeCoin, {gas:2000000}).then(function(){
      pokecoin = PokeCoin.deployed();
      pokeCoinAddress = pokecoin.address;
      pokecoin.issueNew(10000, {gas:2000000}).then(function(){
        return pokecoin.transfer(account1Demo, 5000, {from:web3.eth.accounts[0],gas:2000000});
      }).then(function(){
        return pokecoin.transfer(account2Demo, 5000, {from:web3.eth.accounts[0],gas:2000000});
      });


    });
  deployer.deploy(PokeCentral, {gas:6000000}).then(function(){
    pokecentral = PokeCentral.deployed();
    pokeCentralAddress = pokecentral.address;
    pokecentral.newPokemon(3,500,40, {from:web3.eth.accounts[0],gas:6000000}).then(function(){
      return pokecentral.transferPokemon(web3.eth.accounts[0], account1Demo, 1,{from:web3.eth.accounts[0],gas:6000000});
    });

    pokecentral.newPokemon(1,535,70, {from:web3.eth.accounts[0],gas:6000000}).then(function(){
      return pokecentral.transferPokemon(web3.eth.accounts[0], account2Demo, 2,{from:web3.eth.accounts[0],gas:6000000});
    });

    pokecentral.newPokemon(4,546,80, {from:web3.eth.accounts[0],gas:6000000}).then(function(){
      return pokecentral.transferPokemon(web3.eth.accounts[0], account2Demo, 3,{from:web3.eth.accounts[0],gas:6000000});
    });

    pokecentral.newPokemon(2,557,90, {from:web3.eth.accounts[0],gas:6000000}).then(function(){
      return pokecentral.transferPokemon(web3.eth.accounts[0], account1Demo, 4,{from:web3.eth.accounts[0],gas:6000000});
    });


  });
  deployer.deploy(PokeMarket, {gas:4000000}).then(function(){
    pokemarket = PokeMarket.deployed();
    return pokemarket.updatePokecoinAndPokemarketAddresses(pokeCoinAddress, pokeCentralAddress, {from:web3.eth.accounts[0],gas:4000000}).then(function(){
      return pokecoin.updatePokeMarketAddress(pokemarket.address, {from:web3.eth.accounts[0],gas:4000000}).then(function(){
        return pokecentral.updatePokeMarketAddress(pokemarket.address, {from:web3.eth.accounts[0],gas:4000000});
      });
    });
  });
};
