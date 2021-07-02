// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// AAVE
import { ILendingPool } from './aave-v2/interfaces/ILendingPool.sol';
import { ILendingPoolAddressesProvider } from './aave-v2/interfaces/ILendingPoolAddressesProvider.sol';

// Polycat.finanace
import { MasterChef } from "./polycat/Farm/MasterChef.sol";

/**
 * @title YieldFarmingStrategy contract
 */
contract YieldFarmingStrategy {

    IERC20 public dai;
    ILendingPoolAddressesProvider public provider;
    ILendingPool public lendingPool;
    MasterChef public masterChef;

    address DAI_ADDRESS;

    constructor(ILendingPoolAddressesProvider _provider, MasterChef _masterChef, IERC20 _dai) public {
        dai = _dai;
        provider = _provider;
        lendingPool = ILendingPool(provider.getLendingPool());
        masterChef = _masterChef;

        DAI_ADDRESS = address(dai);
    }

    /**
     * @notice - Lend ERC20 token into the AAVE Lending Market
     */
    function lendToAave(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) public returns (bool) {
        dai.transferFrom(msg.sender, address(this), amount);

        // Input variables
        //address asset = DAI_ADDRESS;
        //uint256 amount = 1000 * 1e18;
        //address onBehalfOf = msg.sender;
        //uint16 referralCode = 0;

        // Approve LendingPool contract to move your DAI
        dai.approve(provider.getLendingPoolCollateralManager(), amount);

        // Deposit 10 DAI
        lendingPool.deposit(asset, amount, onBehalfOf, referralCode);
    }

    /**
     * @notice - Allows depositors to enable/disable a specific deposited asset as collateral
     * @param asset - The address of the underlying asset deposited
     */
    function collateralToAave(address asset) public returns (bool) {
        bool useAsCollateral = true; // [Note]: `true` if the user wants to use the deposit as collateral, `false` otherwise
        lendingPool.setUserUseReserveAsCollateral(asset, useAsCollateral);
    }

    /**
     * @notice - Borrow ERC20 token from the AAVE Borrowing Market
     */
    function borrowFromAave(
        address asset,
        uint256 amount,
        uint256 interestRateMode,
        uint16 referralCode,
        address onBehalfOf
    ) public returns (bool) {
        //address daiAddress = address(0x6B175474E89094C44Da98b954EedeAC495271d0F); // mainnet DAI
        //uint256 amount = 1000 * 1e18;

        /// 1 is stable rate, 2 is variable rate
        //uint256 variableRate = 2;
        //uint256 referral = 0;

        /// Borrow method call
        lendingPool.borrow(asset, amount, interestRateMode, referralCode, onBehalfOf);
    }

    /**
     * @notice - Lend (Deposit) ERC20 tokens into the Polycat Pool
     */ 
    function lendIntoPolycatPool() public returns (bool) {
        // [Todo]:
    }

}
