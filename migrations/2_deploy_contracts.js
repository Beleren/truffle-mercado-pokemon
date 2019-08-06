const PokeCoin = artifacts.require("./PokeCoin");
const PokeCentral = artifacts.require("./PokeCentral");
const PokeMarket = artifacts.require("./PokeMarket");

account1Demo = '0x8e6a53dcee9d90f6d18a2d40ff0bd8f382b39bb2';
account2Demo = '0x420cdd15bdf1819af30ba0bb9808d1aaa40a1eb6';
pokeCoinAddress = '';
pokeCentralAddress = '';
module.exports = function(deployer, network, accounts) {
  deployer.deploy(PokeCoin, {gas:2000000}).then(async function(){
      pokecoin = await PokeCoin.deployed();
      pokeCoinAddress = pokecoin.address;
      pokecoin.issueNew(10000, {gas:2000000}).then(function(){
        return pokecoin.transfer(account1Demo, 5000, {from:accounts[0],gas:2000000});
      }).then(function(){
        return pokecoin.transfer(account2Demo, 5000, {from:accounts[0],gas:2000000});
      });


    });
  deployer.deploy(PokeCentral, {gas:6000000}).then(async function(){
    pokecentral = await PokeCentral.deployed();
    pokeCentralAddress = pokecentral.address;
    pokecentral.newPokemon(3,500,40, {from:accounts[0],gas:6000000}).then(function(){
      return pokecentral.transferPokemon(accounts[0], account1Demo, 1,{from:accounts[0],gas:6000000});
    });

    pokecentral.newPokemon(1,535,70, {from:accounts[0],gas:6000000}).then(function(){
      return pokecentral.transferPokemon(accounts[0], account2Demo, 2,{from:accounts[0],gas:6000000});
    });

    pokecentral.newPokemon(4,546,80, {from:accounts[0],gas:6000000}).then(function(){
      return pokecentral.transferPokemon(accounts[0], account2Demo, 3,{from:accounts[0],gas:6000000});
    });

    pokecentral.newPokemon(2,557,90, {from:accounts[0],gas:6000000}).then(function(){
      return pokecentral.transferPokemon(accounts[0], account1Demo, 4,{from:accounts[0],gas:6000000});
    });


  });
  deployer.deploy(PokeMarket, {gas:4000000}).then(async function(){
    pokemarket = await PokeMarket.deployed();
    return pokemarket.updatePokecoinAndPokemarketAddresses(pokeCoinAddress, pokeCentralAddress, {from:accounts[0],gas:4000000}).then(function(){
      return pokecoin.updatePokeMarketAddress(pokemarket.address, {from:accounts[0],gas:4000000}).then(function(){
        return pokecentral.updatePokeMarketAddress(pokemarket.address, {from:accounts[0],gas:4000000});
      });
    });
  });
};
