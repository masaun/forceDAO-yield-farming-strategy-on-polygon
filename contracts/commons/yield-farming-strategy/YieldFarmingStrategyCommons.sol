// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";


/**
 * @title YieldFarmingStrategy contract
 */
contract YieldFarmingStrategyCommons {

    ///--------------------
    /// Storage types
    ///--------------------

    mapping (address => UserForAave) public userForAaves;  /// User address -> UserForAave struct
    mapping (address => UserForPolycat) public userForPolycats;  /// Pool ID -> User address -> User struct


    ///--------------------
    /// Structs
    ///--------------------

    struct UserForAave {
        uint lendIntoAaveAmount;
        uint borrowFromAaveAmount;
    }

    struct UserForPolycat {
        uint lendIntoPolycatAmount;
    }

}
