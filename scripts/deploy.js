// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy


  const Proxy = await ethers.getContractFactory("Proxy");
  proxy = await Proxy.deploy();
  await proxy.deployed();

  console.log("Proxy deployed to:", proxy.address);

  const RewardsV1 = await ethers.getContractFactory("RewardsV1");
  reward = await RewardsV1.deploy();
  await reward.deployed();

  console.log("RewardsV1 deployed to:", reward.address);

  const RewardsV2 = await ethers.getContractFactory("RewardsV2");
  rewardsv2 = await RewardsV2.deploy();
  await rewardsv2.deployed();

  console.log("RewardsV2 deployed to:", rewardsv2.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
