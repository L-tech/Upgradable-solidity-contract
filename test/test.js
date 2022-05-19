require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");

describe("Proxy", async () => {
  let owner;
  let proxy, logic;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    const RewardsV1 = await ethers.getContractFactory("RewardsV1");
    reward = await RewardsV1.deploy();
    await reward.deployed();

    const Proxy = await ethers.getContractFactory("Proxy");
    proxy = await Proxy.deploy();
    await proxy.deployed();

    await proxy.setImplementation(reward.address);

    const abi = ["function initialize() public"];
    const proxied = new ethers.Contract(proxy.address, abi, owner);

    await proxied.initialize();
  });

  it("points to an implementation contract", async () => {
    expect(await proxy.callStatic.getImplementation()).to.eq(reward.address);
  });

  it("proxies calls to implementation contract", async () => {
    abi = [
      "function setRewardsPoints(uint256 _points) public",
      "function getRewardsPoints() public view returns (uint256)",
    ];

    const proxied = new ethers.Contract(proxy.address, abi, owner);

    expect(await proxied.getRewardsPoints()).to.eq("0x64");
  });

  it("cannot be initialized twice", async () => {
    abi = ["function initialize() public"];
    const proxied = new ethers.Contract(proxy.address, abi, owner);

    await expect(proxied.initialize()).to.be.revertedWith(
      "already initialized"
    );
  });

  it("allows to change implementations", async () => {
    const RewardsV2 = await ethers.getContractFactory("RewardsV2");
    rewardsv2 = await RewardsV2.deploy();
    await rewardsv2.deployed();

    await proxy.setImplementation(rewardsv2.address);

    abi = [
      "function initialize() public",
      "function setRewardsPoints(uint256 _points) public",
      "function getRewardsPoints() public view returns (uint256)",
    ];

    const proxied = new ethers.Contract(proxy.address, abi, owner);

    await proxied.setRewardsPoints(0x12C);
    expect(await proxied.getRewardsPoints()).to.eq("0x1C2");
  });
});
