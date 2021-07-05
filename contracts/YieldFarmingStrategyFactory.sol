// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { YieldFarmingStrategy } from "./YieldFarmingStrategy.sol";

// Open Zeppelin
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";

// AAVE
import { ILendingPool } from './aave-v2/interfaces/ILendingPool.sol';
import { ILendingPoolAddressesProvider } from './aave-v2/interfaces/ILendingPoolAddressesProvider.sol';

// Polycat.finanace
import { MasterChef } from "./polycat/Farm/MasterChef.sol";

/**
 * @title YieldFarmingStrategyFactory contract
 */
contract YieldFarmingStrategyFactory {

    address[] yieldFarmingStrategies;

    ILendingPoolAddressesProvider public provider;
    MasterChef public masterChef;

    constructor(ILendingPoolAddressesProvider _provider, MasterChef _masterChef) public {
        provider = _provider;
        masterChef = _masterChef;
    }

    /**
     * @notice - Create a new YieldFarmingStrategy contract
     */
    function createNewYieldFarmingStrategy() public returns (bool) {
        YieldFarmingStrategy yieldFarmingStrategy = new YieldFarmingStrategy(provider, masterChef);
        yieldFarmingStrategies.push(address(yieldFarmingStrategy));
    }
}
