// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.6.12;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


interface IMigratorChef {
    // Perform LP token migration from legacy UniswapV2 to FastSwap.
    // Take the current LP token address and return the new LP token address.
    // Migrator should have full access to the caller's LP token.
    // Return the new LP token address.
    //
    // XXX Migrator must have allowance access to UniswapV2 LP tokens.
    // FastSwap must mint EXACTLY the same amount of FastSwap LP tokens or
    // else something bad will happen. Traditional UniswapV2 does not
    // do that so be careful!
    function migrate(IERC20 token) external returns (IERC20);
}


// MasterChef is the master of Fast. He can make Fast and he is a fair guy.
//
// Note that it's ownable and the owner wields tremendous power. The ownership
// will be transferred to a governance smart contract once FAST is sufficiently
// distributed and the community can show to govern itself.
//
// Have fun reading it. Hopefully it's bug-free. God bless.
contract MasterChef is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    uint256 constant UNIT = 1e18;
    uint256 constant YEAR = 365;

    uint256 private billion = 1e9 * UNIT;
    uint256 private totalFastAvailable = billion.mul(65).div(100);
    uint256 private perYear = YEAR.mul(86400);

    // Info of each user.
    struct UserInfo {
        uint256 amount;     // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
    }

    // Info of each pool.
    struct PoolInfo {
        IERC20 lpToken;           // Address of LP token contract.
        uint256 percentFastTokens;  // Percentage of tokens to be distributed. TODO: remove
//        uint256 amountFastTokens;  // Percentage of tokens to be distributed.
        uint256 lastRewardTime;   // Last time number that FASTs distribution occurs.
        uint256 accFastPerShare;    // Accumulated FASTs per share, times 1e18. See below.
    }

    // The FAST TOKEN!
    IERC20 public fast;
    // The time when FAST mining end.
    uint256 public endTime;
    // The time when FAST mining starts.
    uint256 public startTime;
    // Percentage of tokens to be distributed per year
    uint256 public percentFastTokensYear;
    // The migrator contract. It has a lot of power. Can only be set through governance (owner).
    IMigratorChef public migrator;

    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes LP tokens.
    mapping (uint256 => mapping (address => UserInfo)) public userInfo;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);

    constructor(
        IERC20 _fast,
        uint256 _endTime,
        uint256 _startTime,
        uint256 _percentFastTokensYear
    ) public {
        fast = _fast;
        endTime = _endTime;
        startTime = _startTime;
        percentFastTokensYear = _percentFastTokensYear;
    }

    /**
     * @dev Get pool length.
     */
    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    /**
     * @dev View function to see pending FASTs on frontend.
     * @param _pid pool ID
     * @param _user user address
     */
    function pendingFast(uint256 _pid, address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];

        uint256 accFastPerShare = pool.accFastPerShare;
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));

        if (block.timestamp > pool.lastRewardTime && endTime > pool.lastRewardTime && lpSupply != 0) {
            uint256 time;
            if (block.timestamp <= endTime) {
                time = block.timestamp.sub(pool.lastRewardTime);
            } else {
                time = endTime.sub(pool.lastRewardTime);
            }

            uint256 tokensPerYear = totalFastAvailable.mul(percentFastTokensYear).div(100); // TODO: remove
            uint256 tokensForPool = tokensPerYear.mul(pool.percentFastTokens).div(100); // TODO: remove

            uint256 fastReward = tokensForPool.mul(1e18).div(perYear).mul(time);
            // TODO: replace with pool.amount
            if (fastReward > 0) {
                accFastPerShare = accFastPerShare.add(fastReward.div(lpSupply));
            }
        }

        return user.amount.mul(accFastPerShare).div(1e18).sub(user.rewardDebt);
    }

//    TODO: update pool function
    /**
     * @dev Set new percent Fast tokens in year.
     * @param _percentFastTokensYear new percent for pools
     */
    function setPercentFastTokensYear(uint256 _percentFastTokensYear) public onlyOwner {
        require(block.timestamp <= endTime, "contract stopped work");
        require(_percentFastTokensYear > 0 && _percentFastTokensYear <= 100, "setPercentFastTokensYear: incorrect value");
        percentFastTokensYear = _percentFastTokensYear;
    }

    /**
     * @dev Add a new lp to the pool. Can only be called by the owner.
     * XXX DO NOT add the same LP token more than once. Rewards will be messed up if you do.
     * @param _percentFastTokens percent for pool
     * @param _lpToken token interface
     * @param _withUpdate whether to update information
     */
    function add(uint256 _percentFastTokens, IERC20 _lpToken, bool _withUpdate) public onlyOwner {
        require(block.timestamp <= endTime, "contract stopped work");
        require(_percentFastTokens > 0 && _percentFastTokens <= 100, "add: incorrect value");

        if (_withUpdate) {
            massUpdatePools();
        }

        uint256 lastRewardTime = block.timestamp > startTime ? block.timestamp : startTime;
        poolInfo.push(PoolInfo({
        lpToken: _lpToken,
        percentFastTokens: _percentFastTokens,
        lastRewardTime: lastRewardTime,
        accFastPerShare: 0
        }));
    }

    /**
     * @dev Update the given pool's FAST percent. Can only be called by the owner.
     * @param _pid pool ID
     * @param _percentFastTokens percent for pool
     * @param _withUpdate whether to update information
     */
    function set(uint256 _pid, uint256 _percentFastTokens, bool _withUpdate) public onlyOwner {
        require(block.timestamp <= endTime, "contract stopped work");
        require(_percentFastTokens > 0 && _percentFastTokens <= 100, "set: incorrect value");

        if (_withUpdate) {
            massUpdatePools();
        }

        poolInfo[_pid].percentFastTokens = _percentFastTokens;
    }

    /**
     * @dev Set the migrator contract. Can only be called by the owner.
     * @param _migrator migrator interface
     */
    function setMigrator(IMigratorChef _migrator) public onlyOwner {
        migrator = _migrator;
    }

    /**
     * @dev Migrate lp token to another lp contract. Can be called by anyone. We trust that migrator contract is good.
     * @param _pid pool ID
     */
    function migrate(uint256 _pid) public {
        require(address(migrator) != address(0), "migrate: no migrator");
        PoolInfo storage pool = poolInfo[_pid];
        IERC20 lpToken = pool.lpToken;
        uint256 bal = lpToken.balanceOf(address(this));
        lpToken.safeApprove(address(migrator), bal);
        IERC20 newLpToken = migrator.migrate(lpToken);
        require(bal == newLpToken.balanceOf(address(this)), "migrate: bad");
        pool.lpToken = newLpToken;
    }

    /**
     * @dev Update reward variables for all pools. Be careful of gas spending!
     */
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    /**
     * @dev Update reward variables of the given pool to be up-to-date.
     * @param _pid pool ID
     */
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];

        if (block.timestamp <= pool.lastRewardTime) {
            return;
        }

        if (block.timestamp > endTime) {
            return;
        }

        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0) {
            pool.lastRewardTime = block.timestamp;
            return;
        }

        uint256 time = block.timestamp.sub(pool.lastRewardTime);

        uint256 tokensPerYear = totalFastAvailable.mul(percentFastTokensYear).div(100);
        uint256 tokensForPool = tokensPerYear.mul(pool.percentFastTokens).div(100);

        uint256 fastReward = tokensForPool.div(perYear).mul(time); // TODO: fixed amount
        if (fastReward > 0 ) {
            pool.accFastPerShare = pool.accFastPerShare.add(fastReward.mul(1e18).div(lpSupply));
        }

        pool.lastRewardTime = block.timestamp;
    }

    /**
     * @dev Deposit LP tokens to MasterChef for FAST allocation.
     * @param _pid pool ID
     * @param _amount amount LP tokens
     */
    function deposit(uint256 _pid, uint256 _amount) public {
        require(block.timestamp <= endTime, "contract stopped work");

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        updatePool(_pid);

        if (user.amount > 0) {
            uint256 pending = user.amount.mul(pool.accFastPerShare).div(1e18).sub(user.rewardDebt);
            if (pending > 0) {
                safeFastTransfer(msg.sender, pending);
            }
        }

        if (_amount > 0) {
            pool.lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);
            user.amount = user.amount.add(_amount);
        }

        user.rewardDebt = user.amount.mul(pool.accFastPerShare).div(1e18);
        emit Deposit(msg.sender, _pid, _amount);
    }

    /**
     * @dev Withdraw LP tokens from MasterChef.
     * @param _pid pool ID
     * @param _amount amount LP tokens
     */
    function withdraw(uint256 _pid, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "withdraw: not good");

        updatePool(_pid);

        uint256 pending = user.amount.mul(pool.accFastPerShare).div(1e18).sub(user.rewardDebt);
        if (pending > 0) {
            safeFastTransfer(msg.sender, pending);
        }

        if (_amount > 0) {
            user.amount = user.amount.sub(_amount);
            pool.lpToken.safeTransfer(address(msg.sender), _amount);
        }

        user.rewardDebt = user.amount.mul(pool.accFastPerShare).div(1e18);
        emit Withdraw(msg.sender, _pid, _amount);
    }

    /**
     * @dev Withdraw without caring about rewards. EMERGENCY ONLY.
     * @param _pid pool ID
     */
    function emergencyWithdraw(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        uint256 amount = user.amount;
        user.amount = 0;
        user.rewardDebt = 0;
        pool.lpToken.safeTransfer(address(msg.sender), amount);
        emit EmergencyWithdraw(msg.sender, _pid, amount);
    }

    /**
     * @dev Safe fast transfer function, just in case if rounding error causes pool to not have enough FASTs.
     * @param _to address of the recipient
     * @param _amount amount Fast tokens
     */
    function safeFastTransfer(address _to, uint256 _amount) internal {
        uint256 fastBal = fast.balanceOf(address(this));
        if (_amount > fastBal) {
            fast.transfer(_to, fastBal);
        } else {
            fast.transfer(_to, _amount);
        }
    }
}