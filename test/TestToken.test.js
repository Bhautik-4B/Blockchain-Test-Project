const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TestToken", function () {
  let TestToken;
  let testToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    TestToken = await ethers.getContractFactory("TestToken");
    [owner, addr1, addr2] = await ethers.getSigners();
    testToken = await TestToken.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await testToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await testToken.balanceOf(owner.address);
      expect(await testToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have correct name and symbol", async function () {
      expect(await testToken.name()).to.equal("Blockchain Test Token");
      expect(await testToken.symbol()).to.equal("BTT");
    });

    it("Should have correct total supply", async function () {
      const totalSupply = await testToken.totalSupply();
      expect(ethers.formatEther(totalSupply)).to.equal("1000000.0");
    });
  });

  describe("Token Info Functions", function () {
    it("Should return correct name", async function () {
      const name = await testToken.name();
      expect(name).to.equal("Blockchain Test Token");
    });

    it("Should return correct symbol", async function () {
      const symbol = await testToken.symbol();
      expect(symbol).to.equal("BTT");
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      await testToken.mint(addr1.address, mintAmount);
      expect(await testToken.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should not allow non-owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      await expect(
        testToken.connect(addr1).mint(addr2.address, mintAmount)
      ).to.be.revertedWithCustomError(testToken, "OwnableUnauthorizedAccount");
    });
  });
}); 