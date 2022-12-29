// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract GeceyeBirak {
    uint256 totalMesajs;
    uint256 private seed; // to randomize winner

    event NewMesaj(address indexed from, uint256 timestamp, string message);

    struct Mesaj {
        address mesajer;
        string message;
        uint256 timestamp;
    }

    Mesaj[] mesajs;

    mapping(address => uint256) public lastMesajedAt;

    constructor() payable {
        console.log("contract constructor working...");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function mesaj(string memory _message) public {
        require(lastMesajedAt[msg.sender] + 23 hours < block.timestamp, 
            "Please wait 23 hours before submitting a new message");
        lastMesajedAt[msg.sender] = block.timestamp;

        totalMesajs++;
        console.log("%s mesaj birakti: %s", msg.sender, _message);

        mesajs.push(Mesaj(msg.sender, _message, block.timestamp));

        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %d", seed);

        if (seed <= 5) {
            console.log("%s won!", msg.sender);

            /*
             * The same code we had before to send the prize.
             */
            uint256 prizeAmount = 0.00001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewMesaj(msg.sender, block.timestamp, _message);

    }

    function getAllMesajs() public view returns (Mesaj[] memory) {
        return mesajs;
    }

    function getTotalMesajs() public view returns (uint256) {
        console.log("Toplam %d tane mesaj var!", totalMesajs);
        return totalMesajs;
    }
}