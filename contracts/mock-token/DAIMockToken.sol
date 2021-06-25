// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DAIMockToken is ERC20 {
    constructor() public ERC20("DAI Mock Token", "DAI") {
        uint256 initialSupply = 1e8 * 1e18;  /// 1 milion
        _mint(msg.sender, initialSupply);
    }
}
