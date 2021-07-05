// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { YieldFarmingStrategyCommons } from "./commons/yield-farming-strategy/YieldFarmingStrategyCommons.sol";

// Open Zeppelin
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";

// AAVE
import { ILendingPool } from './aave-v2/interfaces/ILendingPool.sol';
import { ILendingPoolAddressesProvider } from './aave-v2/interfaces/ILendingPoolAddressesProvider.sol';

// Polycat.finanace
import { MasterChef } from "./polycat/Farm/MasterChef.sol";

/**
 * @title YieldFarmingStrategy contract
 */
contract YieldFarmingStrategy is YieldFarmingStrategyCommons {
    using SafeMath for uint256;

    ILendingPoolAddressesProvider public provider;
    ILendingPool public lendingPool;
    MasterChef public masterChef;

    address LENDING_POOL;
    address MASTER_CHEF;

    address STRATEGY_OWNER;

    constructor(ILendingPoolAddressesProvider _provider, MasterChef _masterChef, address _strategyOwner) public {
        provider = _provider;
        lendingPool = ILendingPool(provider.getLendingPool());
        masterChef = _masterChef;

        LENDING_POOL = provider.getLendingPool();
        MASTER_CHEF = address(masterChef);

        STRATEGY_OWNER = _strategyOwner;
    }

    /**
     * @notice - Modify that check whether a caller is a strategy owner or not
     */
    modifier onlyStrategyOwner() {
        require(msg.sender == STRATEGY_OWNER, "YieldFarmingStrategy: Caller must be a strategy owner");
        _;
    }

    /**
     * @notice - Lend ERC20 token into the AAVE Lending Market
     */
    function lendToAave(address asset, uint256 amount) public onlyStrategyOwner returns (bool) {
        IERC20(asset).transferFrom(msg.sender, address(this), amount);

        // Input variables
        //address asset = DAI_ADDRESS;
        //uint256 amount = 1000 * 1e18;
        address onBehalfOf = address(this);
        uint16 referralCode = 0;

        // Approve LendingPool contract to move your DAI
        IERC20(asset).approve(LENDING_POOL, amount);

        // Deposit 10 DAI
        lendingPool.deposit(asset, amount, onBehalfOf, referralCode);

        // Save the record of lending to the AAVE market
        _saveRecordOfLendingToAaveMarket(msg.sender, asset, amount);
    }

    /**
     * @notice - Allows depositors to enable/disable a specific deposited asset as collateral
     * @param asset - The address of the underlying asset deposited
     */
    function collateralToAave(address asset) public onlyStrategyOwner returns (bool) {
        bool useAsCollateral = true; // [Note]: `true` if the user wants to use the deposit as collateral, `false` otherwise
        lendingPool.setUserUseReserveAsCollateral(asset, useAsCollateral);
    }

    /**
     * @notice - Borrow ERC20 token from the AAVE Borrowing Market
     */
    function borrowFromAave(
        address asset,
        uint256 amount,
        uint256 interestRateMode
    ) public onlyStrategyOwner returns (bool) {
        //address daiAddress = address(0x6B175474E89094C44Da98b954EedeAC495271d0F); // mainnet DAI
        //uint256 amount = 1000 * 1e18;
        //uint interestRateMode       /// @notice - the type of borrow debt. Stable: 1, Variable: 2
        uint16 referralCode = 0;
        address onBehalfOf = address(this);

        /// Check whether borrowing amount is higher than 60% of amount lended or not
        UserForAaveMarket memory userForAaveMarket = getUserForAaveMarket(asset, msg.sender);
        uint _borrowingAmount = userForAaveMarket.borrowingAmount;
        uint borrowingLimitAmount = userForAaveMarket.lendingAmount.mul(60).div(100);  /// [Note]: A user can borrow until 60% of amount lended
        require(_borrowingAmount <= borrowingLimitAmount, "YieldFarmingStrategy: Borrowing amount must be smaller than 60% of amount lended");

        /// Borrow method call
        lendingPool.borrow(asset, amount, interestRateMode, referralCode, onBehalfOf);

        // Save the record of borrowing to the AAVE market
        _saveRecordOfBorrowingFromAaveMarket(msg.sender, asset, amount);
    }

    /**
     * @notice - Deposit ERC20 tokens into the Polycat Pool
     */ 
    function depositToPolycatPool(address asset, uint256 poolId, uint256 stakeAmount, address referrer) public onlyStrategyOwner returns (bool) {
        // Approve the MasterChef contract to move your DAI
        IERC20(asset).approve(MASTER_CHEF, stakeAmount);

        // Deposit into the MasterChef contract of Polycat.finance
        masterChef.deposit(poolId, stakeAmount, referrer);

        // Save the record of borrowing to the AAVE market
        _saveRecordOfDepositingToPolycatPool(msg.sender, poolId, stakeAmount);
    }


    ///--------------------------------------------------
    /// Save records of lending, borrowing, depositing 
    ///--------------------------------------------------
    function _saveRecordOfLendingToAaveMarket(address lender, address asset, uint256 amount) internal returns (bool) {
        UserForAaveMarket storage userForAaveMarket = userForAaveMarkets[asset][lender];
        userForAaveMarket.lendingAmount = userForAaveMarket.lendingAmount.add(amount);
    }

    function _saveRecordOfBorrowingFromAaveMarket(address borrower, address asset, uint256 amount) internal returns (bool) {
        UserForAaveMarket storage userForAaveMarket = userForAaveMarkets[asset][borrower];
        userForAaveMarket.borrowingAmount = userForAaveMarket.borrowingAmount.add(amount);
    }

    function _saveRecordOfDepositingToPolycatPool(address depositor, uint256 poolId, uint256 stakeAmount) internal returns (bool) {
        UserForPolycatPool storage userForPolycatPool = userForPolycatPools[poolId][depositor];
        userForPolycatPool.depositingAmount = userForPolycatPool.depositingAmount.add(stakeAmount);
    }


    ///--------------------------------------------------
    /// Getter methods
    ///--------------------------------------------------
    function getUserForAaveMarket(address asset, address user) public view returns (UserForAaveMarket memory _userForAaveMarket) {
        UserForAaveMarket memory userForAaveMarket = userForAaveMarkets[asset][user];
        return userForAaveMarket;
    }

    function getUserForPolycatPool(uint poolId, address user) public view returns (UserForPolycatPool memory _userForPolycatPool) {
        UserForPolycatPool memory userForPolycatPool = userForPolycatPools[poolId][user];
        return userForPolycatPool;
    }
}
