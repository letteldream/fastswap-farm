const {expectRevert, time} = require('@openzeppelin/test-helpers');
const {assert} = require('chai');
const MasterChef = artifacts.require('MasterChef');
const MockERC20 = artifacts.require('MockERC20');

contract('MasterChef', ([alice, bob, carol, minter, migrator]) => {
    beforeEach(async () => {
        this.fast = await MockERC20.new('Fast', 'Fast', web3.utils.toWei('1000000000', 'ether'), {from: minter});
    });

    it('should set correct state variables', async () => {
        const timestamp = await time.latest();
        const endTimestamp = timestamp.add(time.duration.days(3));
        this.chef = await MasterChef.new(this.fast.address, endTimestamp, timestamp, 25, {from: alice});

        const fast = await this.chef.fast();
        const percentFastTokensYear = await this.chef.percentFastTokensYear();
        assert.equal(fast.valueOf(), this.fast.address);
        assert.equal(percentFastTokensYear.valueOf(), 25);
    });

    it('should correct change variables', async () => {
        const timestamp = await time.latest();
        const endTimestamp = timestamp.add(time.duration.days(3));
        this.chef = await MasterChef.new(this.fast.address, endTimestamp, timestamp, 25, {from: alice});

        let percentFastTokensYear = await this.chef.percentFastTokensYear();
        assert.equal(percentFastTokensYear.valueOf(), 25);

        await expectRevert(this.chef.setPercentFastTokensYear(142), 'setPercentFastTokensYear: incorrect value');
        await this.chef.setPercentFastTokensYear(42);
        await this.chef.setMigrator(migrator)

        const newMigrator = await this.chef.migrator();
        percentFastTokensYear = await this.chef.percentFastTokensYear();
        assert.equal(newMigrator.valueOf(), migrator);
        assert.equal(percentFastTokensYear.valueOf(), 42);
    });

    it('should correct stoping contract', async () => {
        const timestamp = await time.latest();
        const endTimestamp = timestamp.add(time.duration.days(1));
        this.chef = await MasterChef.new(this.fast.address, endTimestamp, timestamp, 25, {from: alice});

        await time.increase(time.duration.days(2));

        await expectRevert(this.chef.add(42, this.fast.address, false), 'contract stopped work');
        await expectRevert(this.chef.setPercentFastTokensYear(42), 'contract stopped work');
        await expectRevert(this.chef.set(0, 42, false), 'contract stopped work');
        await expectRevert(this.chef.deposit(0, 42), 'contract stopped work');
    });

    context('With ERC/LP token added to the field', () => {
        beforeEach(async () => {
            this.lp = await MockERC20.new('LPToken', 'LP', web3.utils.toWei('10000000000', 'ether'), {from: minter});
            await this.lp.transfer(alice, web3.utils.toWei('1000', 'ether'), {from: minter});
            await this.lp.transfer(bob, web3.utils.toWei('1000', 'ether'), {from: minter});
            await this.lp.transfer(carol, web3.utils.toWei('1000', 'ether'), {from: minter});

            this.lp2 = await MockERC20.new('LPToken2', 'LP2', web3.utils.toWei('10000000000', 'ether'), {from: minter});
            await this.lp2.transfer(alice, web3.utils.toWei('1000', 'ether'), {from: minter});
            await this.lp2.transfer(bob, web3.utils.toWei('1000', 'ether'), {from: minter});
            await this.lp2.transfer(carol, web3.utils.toWei('1000', 'ether'), {from: minter});
        });

        it('should return correct poolLength', async () => {
            const timestamp = await time.latest();
            const endTimestamp = timestamp.add(time.duration.days(90));
            this.chef = await MasterChef.new(this.fast.address, endTimestamp, timestamp, 25, {from: alice});
            this.fast.transfer(this.chef.address, web3.utils.toWei('1000000000', 'ether'), {from: minter});

            await expectRevert(this.chef.add(120, this.lp.address, true), 'add: incorrect value');
            await this.chef.add(20, this.lp.address, true);
            assert.equal(await this.chef.poolLength(), 1);

            await this.chef.add(20, this.lp2.address, false);
            assert.equal(await this.chef.poolLength(), 2);
        });

        it('should allow emergency withdraw', async () => {
            const timestamp = await time.latest();
            const endTimestamp = timestamp.add(time.duration.days(90));
            this.chef = await MasterChef.new(this.fast.address, endTimestamp, timestamp, 25, {from: alice});
            this.fast.transfer(this.chef.address, web3.utils.toWei('1000000000', 'ether'), {from: minter});

            await this.chef.add(20, this.lp.address, true);

            await this.lp.approve(this.chef.address, web3.utils.toWei('1000', 'ether'), {from: bob});
            await this.chef.deposit(0, web3.utils.toWei('100', 'ether'), {from: bob});
            assert.equal(await this.lp.balanceOf(bob), web3.utils.toWei('900', 'ether'));

            await this.chef.emergencyWithdraw(0, {from: bob});
            assert.equal(await this.lp.balanceOf(bob), web3.utils.toWei('1000', 'ether'));
        });

        it('should return correct values pendingFast for 1 user', async () => {
            const timestamp = await time.latest();
            const endTimestamp = timestamp.add(time.duration.days(3));
            this.chef = await MasterChef.new(this.fast.address, endTimestamp, timestamp, 25, {from: alice});
            // To last for 3 days
            this.fast.transfer(this.chef.address, web3.utils.toWei('200000', 'ether'), {from: minter});

            await this.chef.add(20, this.lp.address, false);
            await this.lp.approve(this.chef.address, web3.utils.toWei('1000', 'ether'), {from: bob});
            await this.chef.deposit(0, web3.utils.toWei('100', 'ether'), {from: bob});
            assert.equal(await this.chef.pendingFast(0, bob), 0);

            await time.increase(time.duration.days(1));
            let pendingFast = await this.chef.pendingFast(0, bob);
            console.log("110, pendingFast: ", pendingFast.toString())
            assert(pendingFast > web3.utils.toWei('89041', 'ether'));
            assert(pendingFast < web3.utils.toWei('89043', 'ether'));

            await time.increase(time.duration.days(1));
            pendingFast = await this.chef.pendingFast(0, bob);
            assert(pendingFast > web3.utils.toWei('178082', 'ether'));
            assert(pendingFast < web3.utils.toWei('178084', 'ether'));

            await time.increase(time.duration.days(1));
            pendingFast = await this.chef.pendingFast(0, bob);
            assert(pendingFast > web3.utils.toWei('267121', 'ether'));
            assert(pendingFast < web3.utils.toWei('267124', 'ether'));

            await time.increase(time.duration.days(1));
            pendingFast = await this.chef.pendingFast(0, bob);
            assert(pendingFast > web3.utils.toWei('267122', 'ether'));
            assert(pendingFast < web3.utils.toWei('267124', 'ether'));
        });

        it('should return correct values Fast balanceOf for 1 user', async () => {
            const timestamp = await time.latest();
            const endTimestamp = timestamp.add(time.duration.days(90));
            this.chef = await MasterChef.new(this.fast.address, endTimestamp, timestamp, 25, {from: alice});
            // To last for 3 days
            this.fast.transfer(this.chef.address, web3.utils.toWei('200000', 'ether'), {from: minter});

            await this.chef.add(20, this.lp.address, true);
            await this.lp.approve(this.chef.address, web3.utils.toWei('1000', 'ether'), {from: bob});
            await this.chef.deposit(0, web3.utils.toWei('100', 'ether'), {from: bob});

            await this.chef.deposit(0, 0, {from: bob});
            let balanceOf = await this.fast.balanceOf(bob);
            assert(balanceOf >= web3.utils.toWei('0', 'ether'));
            assert(balanceOf < web3.utils.toWei('2', 'ether'));

            await time.increase(time.duration.days(1));
            await this.chef.deposit(0, 0, {from: bob});
            balanceOf = await this.fast.balanceOf(bob);
            assert(balanceOf > web3.utils.toWei('89041', 'ether'));
            assert(balanceOf < web3.utils.toWei('89043', 'ether'));

            await time.increase(time.duration.days(1));
            await this.chef.deposit(0, 0, {from: bob});
            balanceOf = await this.fast.balanceOf(bob);
            assert(balanceOf > web3.utils.toWei('178082', 'ether'));
            assert(balanceOf < web3.utils.toWei('178084', 'ether'));

            // Distributed all tokens
            await time.increase(time.duration.days(1));
            await this.chef.deposit(0, 0, {from: bob});
            assert.equal(await this.fast.balanceOf(bob), web3.utils.toWei('200000', 'ether'));
        });

        it('should return correct values Fast balanceOf for 1 user. Change percent pool', async () => {
            const timestamp = await time.latest();
            const endTimestamp = timestamp.add(time.duration.days(90));
            this.chef = await MasterChef.new(this.fast.address, endTimestamp, timestamp, 25, {from: alice});
            this.fast.transfer(this.chef.address, web3.utils.toWei('300000', 'ether'), {from: minter});

            await this.chef.add(20, this.lp.address, false);
            await this.lp.approve(this.chef.address, web3.utils.toWei('1000', 'ether'), {from: bob});
            await this.chef.deposit(0, web3.utils.toWei('100', 'ether'), {from: bob});

            // Change percent pool
            await expectRevert(this.chef.set(0, 125, false), 'set: incorrect value');
            await this.chef.set(0, 25, false);

            await time.increase(time.duration.days(1));
            await this.chef.deposit(0, 0, {from: bob});
            let balanceOf = await this.fast.balanceOf(bob);
            assert(balanceOf > web3.utils.toWei('111301', 'ether'));
            assert(balanceOf < web3.utils.toWei('111303', 'ether'));

            // Change percent pool
            await this.chef.set(0, 20, true);

            await time.increase(time.duration.days(1));
            await this.chef.withdraw(0, 0, {from: bob});
            balanceOf = await this.fast.balanceOf(bob);
            assert(balanceOf > web3.utils.toWei('200342', 'ether'));
            assert(balanceOf < web3.utils.toWei('200346', 'ether'));
        });

        it('should return correct values Fast balanceOf for 2 user', async () => {
            const timestamp = await time.latest();
            const endTimestamp = timestamp.add(time.duration.days(90));
            this.chef = await MasterChef.new(this.fast.address, endTimestamp, timestamp, 25, {from: alice});
            // To last for 3 days
            this.fast.transfer(this.chef.address, web3.utils.toWei('200000', 'ether'), {from: minter});
            await this.chef.add(20, this.lp.address, true);

            await this.lp.approve(this.chef.address, web3.utils.toWei('1000', 'ether'), {from: bob});
            await this.chef.deposit(0, web3.utils.toWei('100', 'ether'), {from: bob});

            await this.lp.approve(this.chef.address, web3.utils.toWei('1000', 'ether'), {from: carol});
            await this.chef.deposit(0, web3.utils.toWei('100', 'ether'), {from: carol});

            await time.increase(time.duration.days(1));
            await this.chef.deposit(0, 0, {from: bob});
            await this.chef.deposit(0, 0, {from: carol});
            let balanceOf = await this.fast.balanceOf(bob);
            assert(balanceOf > web3.utils.toWei('44520', 'ether'));
            assert(balanceOf < web3.utils.toWei('44522', 'ether'));

            balanceOf = await this.fast.balanceOf(carol);
            assert(balanceOf > web3.utils.toWei('44520', 'ether'));
            assert(balanceOf < web3.utils.toWei('44522', 'ether'));
        });

        it('should return correct values Fast balanceOf for 2 user on different days', async () => {
            const timestamp = await time.latest();
            const endTimestamp = timestamp.add(time.duration.days(90));
            this.chef = await MasterChef.new(this.fast.address, endTimestamp, timestamp, 25, {from: alice});
            // To last for 3 days
            this.fast.transfer(this.chef.address, web3.utils.toWei('200000', 'ether'), {from: minter});
            await this.chef.add(20, this.lp.address, false);

            await this.lp.approve(this.chef.address, web3.utils.toWei('1000', 'ether'), {from: bob});
            await this.chef.deposit(0, web3.utils.toWei('100', 'ether'), {from: bob});

            await time.increase(time.duration.days(1));
            await this.chef.deposit(0, 0, {from: bob});
            let balanceOf = await this.fast.balanceOf(bob);
            assert(balanceOf > web3.utils.toWei('89041', 'ether'));
            assert(balanceOf < web3.utils.toWei('89043', 'ether'));

            await this.lp.approve(this.chef.address, web3.utils.toWei('1000', 'ether'), {from: carol});
            await this.chef.deposit(0, web3.utils.toWei('100', 'ether'), {from: carol});

            await time.increase(time.duration.days(1));
            await this.chef.deposit(0, 0, {from: bob});
            await this.chef.deposit(0, 0, {from: carol});
            balanceOf = await this.fast.balanceOf(bob);
            assert(balanceOf > web3.utils.toWei('133561', 'ether'));
            assert(balanceOf < web3.utils.toWei('133563', 'ether'));

            balanceOf = await this.fast.balanceOf(carol);
            assert(balanceOf > web3.utils.toWei('44520', 'ether'));
            assert(balanceOf < web3.utils.toWei('44522', 'ether'));
        });

        it('should return correct values Fast balanceOf for 2 user on different days. Recount at the end', async () => {
            const timestamp = await time.latest();
            const endTimestamp = timestamp.add(time.duration.days(90));
            this.chef = await MasterChef.new(this.fast.address, endTimestamp, timestamp, 25, {from: alice});
            // To last for 3 days
            this.fast.transfer(this.chef.address, web3.utils.toWei('200000', 'ether'), {from: minter});
            await this.chef.add(20, this.lp.address, true);

            await this.lp.approve(this.chef.address, web3.utils.toWei('1000', 'ether'), {from: bob});
            await this.chef.deposit(0, web3.utils.toWei('100', 'ether'), {from: bob});

            await time.increase(time.duration.days(1));
            const pendingFast = await this.chef.pendingFast(0, bob);
            assert(pendingFast > web3.utils.toWei('89041', 'ether'));
            assert(pendingFast < web3.utils.toWei('89043', 'ether'));

            await this.lp.approve(this.chef.address, web3.utils.toWei('1000', 'ether'), {from: carol});
            await this.chef.deposit(0, web3.utils.toWei('100', 'ether'), {from: carol});

            await time.increase(time.duration.days(1));
            await this.chef.deposit(0, 0, {from: bob});
            await this.chef.deposit(0, 0, {from: carol});
            let balanceOf = await this.fast.balanceOf(bob);
            assert(balanceOf > web3.utils.toWei('133561', 'ether'));
            assert(balanceOf < web3.utils.toWei('133563', 'ether'));

            balanceOf = await this.fast.balanceOf(carol);
            assert(balanceOf > web3.utils.toWei('44520', 'ether'));
            assert(balanceOf < web3.utils.toWei('44522', 'ether'));
        });

        it('should return correct values Fast and LP balanceOf for 1 user', async () => {
            const timestamp = await time.latest();
            const endTimestamp = timestamp.add(time.duration.days(90));
            this.chef = await MasterChef.new(this.fast.address, endTimestamp, timestamp, 25, {from: alice});
            // To last for 3 days
            this.fast.transfer(this.chef.address, web3.utils.toWei('200000', 'ether'), {from: minter});

            await this.chef.add(20, this.lp.address, false);
            await this.lp.approve(this.chef.address, web3.utils.toWei('1000', 'ether'), {from: bob});

            await this.chef.withdraw(0, 0, {from: bob});
            assert.equal(await this.fast.balanceOf(bob), 0);

            await this.chef.deposit(0, web3.utils.toWei('100', 'ether'), {from: bob});

            await time.increase(time.duration.days(1));
            // Trying to shoot more than necessary
            await expectRevert(this.chef.withdraw(0, web3.utils.toWei('200', 'ether'), {from: carol}), 'withdraw: not good');
            await this.chef.withdraw(0, web3.utils.toWei('100', 'ether'), {from: bob});
            let balanceOf = await this.fast.balanceOf(bob);
            assert(balanceOf > web3.utils.toWei('89041', 'ether'));
            assert(balanceOf < web3.utils.toWei('89044', 'ether'));

            assert.equal(await this.lp.balanceOf(bob), web3.utils.toWei('1000', 'ether'));
        });
    });
});
