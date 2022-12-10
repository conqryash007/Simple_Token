const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Testing", function () {
  async function deployTokenFixture() {
    const Token = await ethers.getContractFactory("SimpleToken");
    const [owner, addr1, addr2] = await ethers.getSigners();
    const token = await Token.deploy("XToken", "XTK", 18);
    await token.deployed();
    return { token, owner, addr1, addr2 };
  }

  it("Should correctly deploy", async () => {
    const { token, owner } = await loadFixture(deployTokenFixture);
    expect(token.address).to.be.properAddress;
  });

  it("Should return correct names", async () => {
    const { token, owner } = await loadFixture(deployTokenFixture);
    const name = await token.name();
    const symbol = await token.symbol();
    const decimal = await token.decimals();

    expect(name).to.be.equal("XToken");
    expect(symbol).to.be.equal("XTK");
    expect(decimal).to.be.equal(18);
  });

  it("Should set owner as contract deployer", async () => {
    const { token, owner } = await loadFixture(deployTokenFixture);

    const ownerContract = await token.owner();

    expect(owner.address).to.be.equal(ownerContract);
  });

  describe("Transfer check", () => {
    it("Should transfer and update balance", async () => {
      const { token, owner, addr1 } = await loadFixture(deployTokenFixture);

      await token.mint(owner.address, ethers.utils.parseUnits("10", 18));

      const x1 = await token.balanceOf(owner.address);
      const ownerBalance = ethers.utils.formatEther(x1);
      const x2 = await token.balanceOf(addr1.address);
      const user1Balance = ethers.utils.formatEther(x2);

      await token.transfer(addr1.address, ethers.utils.parseEther("5"));

      const x11 = await token.balanceOf(owner.address);
      const ownerBalanceAfter = ethers.utils.formatEther(x11);
      const x22 = await token.balanceOf(addr1.address);
      const user1BalanceAfter = ethers.utils.formatEther(x22);

      console.log(
        ownerBalance,
        ownerBalanceAfter,
        user1Balance,
        user1BalanceAfter
      );
    });

    it("Should should emit event on transfer", async () => {
      const { token, owner, addr1 } = await loadFixture(deployTokenFixture);

      await token.mint(owner.address, ethers.utils.parseUnits("10", 18));

      const x1 = await token.balanceOf(owner.address);
      const ownerBalance = ethers.utils.formatEther(x1);
      const x2 = await token.balanceOf(addr1.address);
      const user1Balance = ethers.utils.formatEther(x2);

      await expect(token.transfer(addr1.address, ethers.utils.parseEther("5")))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, addr1.address, ethers.utils.parseEther("5"));
    });
  });

  describe("Transfer from check", () => {
    it("Should correctly transfer", async () => {
      const { token, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      await token.mint(owner.address, ethers.utils.parseUnits("10", 18));

      await expect(token.approve(addr1.address, ethers.utils.parseEther("5")))
        .to.emit(token, "Approval")
        .withArgs(owner.address, addr1.address, ethers.utils.parseEther("5"));

      await expect(
        token
          .connect(addr1)
          .transferFrom(
            owner.address,
            addr2.address,
            ethers.utils.parseEther("2")
          )
      )
        .to.emit(token, "Transfer")
        .withArgs(owner.address, addr2.address, ethers.utils.parseEther("2"));

      const x1 = await token.balanceOf(owner.address);
      const ownerBalance = ethers.utils.formatEther(x1);
      const x2 = await token.balanceOf(addr1.address);
      const user1Balance = ethers.utils.formatEther(x2);
      const x3 = await token.balanceOf(addr2.address);
      const u2Bal = ethers.utils.formatEther(x3);

      expect(ownerBalance).to.be.equal("8.0");
      expect(user1Balance).to.be.equal("0.0");
      expect(u2Bal).to.be.equal("2.0");
    });
  });
});
