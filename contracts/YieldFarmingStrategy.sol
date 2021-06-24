// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// AAVE
import { ILendingPool } from './aave-v2/interfaces/ILendingPool.sol';
import { ILendingPoolAddressesProvider } from './aave-v2/interfaces/ILendingPoolAddressesProvider.sol';

// mStable
import { SaveWrapper } from "./mstable/savings/peripheral/SaveWrapper.sol";

/**
 * @title YieldFarmingStrategy contract
 */
contract YieldFarmingStrategy {

    IERC20 public dai;
    ILendingPoolAddressesProvider public provider;
    ILendingPool public lendingPool;
    SaveWrapper public saveWrapper;

    address DAI_ADDRESS;

    constructor(ILendingPoolAddressesProvider _provider, ILendingPool _lendingPool, SaveWrapper _saveWrapper, IERC20 _dai) public {
        dai = _dai;
        provider = _provider;
        lendingPool = ILendingPool(provider.getLendingPool());
        saveWrapper = _saveWrapper;

        DAI_ADDRESS = address(dai);
    }

    /**
     * @notice - Lend ERC20 token into the AAVE Lending Market
     */
    function lendToAave(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) public returns (bool) {
        // Input variables
        //address asset = DAI_ADDRESS;
        //uint256 amount = 1000 * 1e18;
        //address onBehalfOf = msg.sender;
        //uint16 referralCode = 0;

        // Approve LendingPool contract to move your DAI
        dai.approve(provider.getLendingPoolCollateralManager(), amount);

        // Deposit 1000 DAI
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
     * @notice - Save ERC20 token into the mStable Vault
     * @dev 1. Mints an mAsset and then deposits to Save/Savings Vault
     * @param _mAsset       mAsset address
     * @param _bAsset       bAsset address
     * @param _save         Save address
     * @param _vault        Boosted Savings Vault address
     * @param _amount       Amount of bAsset to mint with
     * @param _minOut       Min amount of mAsset to get back
     * @param _stake        Add the imAsset to the Boosted Savings Vault?
     */ 
    function saveIntoMStable(
        address _mAsset,
        address _save,
        address _vault,
        address _bAsset,
        uint256 _amount,
        uint256 _minOut,
        bool _stake
    ) public returns (bool) {
        saveWrapper.saveViaMint(_mAsset,
                                _save,
                                _vault,
                                _bAsset,
                                _amount,
                                _minOut,
                                _stake);
    }

}
