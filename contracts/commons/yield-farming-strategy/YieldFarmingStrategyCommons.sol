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

    mapping (address => mapping (address => UserForAaveMarket)) public userForAaveMarkets;     /// Asset (ERC20) address -> User address -> UserForAave struct
    mapping (uint => mapping (address => UserForPolycatPool)) public userForPolycatPools;  /// Pool ID -> User address -> User struct


    ///--------------------
    /// Structs
    ///--------------------

    struct UserForAaveMarket {
        uint lendingAmount;
        uint borrowingAmount;
    }

    struct UserForPolycatPool {
        uint depositingAmount;
    }

}
