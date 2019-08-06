/*
Copyright (c) 2016 Edilson Osorio Junior - OriginalMy.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

pragma solidity ^0.5.1;
contract tokenRecipient { function receiveApproval(address _from, uint256 _value, address _token, bytes memory _extraData) public; }

contract accessControlled {
    address public owner;
    address public pokeMarketAddress;

    function owned() public{
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) revert();
        /* o caracter "_" é substituído pelo corpo da funcao onde o modifier é utilizado */
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    function updatePokeMarketAddress(address marketAddress) public onlyOwner {
        pokeMarketAddress = marketAddress;
    }

}

contract PokeCoin is accessControlled{
    /* Variaveis publicas */
    string public standard = 'Pokecoin 0.1';
    string public name = 'Pokecoin';
    string public symbol = "pkc";
    uint256 public totalSupply;

    /* Cria array com os balancos */
    mapping (address => uint256) public balanceOf;

    /* Gera um evento publico padrao, que ira notificar os clientes */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /* Inicializa o contrato com o numero inicial de tokens */
    // constructor(uint256 initialSupply) public {
    //     owner = msg.sender;

    //     /* Envia as pokecoins para o criador */
    //     balanceOf[msg.sender] = initialSupply;
    //     /* Ajusta o totalsupply */
    //     totalSupply = initialSupply;

    //     /* Se incluiu os enderecos demo, então divide as pokecoins entre eles */
    //     // if (account1Demo != address(0) && account2Demo != address(0)){
    //     //     transfer(account1Demo, totalSupply/2);
    //     //     transfer(account2Demo, totalSupply/2);
    //     // }
    // }

    /* Transferencia de pokecoins (necessario para Mist fazer a transferencia) */
    function transfer(address _to, uint256 _value) public onlyOwner {
        if (balanceOf[msg.sender] < _value) revert();           // Verifica se o remetente possui pokecoins suficientes
        if (balanceOf[_to] + _value < balanceOf[_to]) revert(); // Checa se nao houve ataque
        balanceOf[msg.sender] -= _value;                     // Subtrai as pokecoins do remetente
        balanceOf[_to] += _value;                            // Adiciona pokecoins para o destinatario
        emit Transfer(msg.sender, _to, _value);                   // Notifica os clientes que estiverem nonitorando
    }

    /* Emite novas pokecoins para o owner distribuí-las */
    function issueNew(uint256 newSupply) public onlyOwner{
        balanceOf[msg.sender] += newSupply;
        totalSupply += newSupply;
    }

    /* Exclui pokecoins do endereço do owner */
    function vanishCoins(uint256 qtdCoinsToDelete) public onlyOwner{
        if (balanceOf[msg.sender] < qtdCoinsToDelete) revert();    // Verifica se o owner possui pokecoins suficientes para exclusao
        balanceOf[msg.sender] -= qtdCoinsToDelete;
        totalSupply -= qtdCoinsToDelete;
    }

    /* Funcao para os contratos poderem transferir pokecoins */
    function transferFrom(address _from, address _to, uint256 _value) public  returns (bool success) {
        if (msg.sender != owner && msg.sender != pokeMarketAddress) revert();  // Somente da acesso ao owner e ao mercado pokemon para executar essa funcao

        if (balanceOf[_from] < _value) revert();                 // Verifica se o remetente possui pokecoins suficientes
        if (balanceOf[_to] + _value < balanceOf[_to]) revert();  // Checa se nao houve ataque
        balanceOf[_from] -= _value;                          // Subtrai as pokecoins do remetente
        balanceOf[_to] += _value;                            // Adiciona pokecoins para o destinatario
        emit Transfer(_from, _to, _value);                       // Notifica os clientes que estiverem nonitorando
        return true;
    }

    /* Uma funcao sem nome '()' eh chamada todas as vezes que forem enviados ethers para ela */
    function () external {
        revert();     // Nao permite o recebimento de ether
    }
}
