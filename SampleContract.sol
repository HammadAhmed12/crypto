// SimpleStorage.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract SimpleStorage {
    uint256 public value;

    function setValue(uint256 _value) public {
        value = _value;
    }
}