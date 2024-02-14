import {ethers, upgrades} from "hardhat";
import hre  from "hardhat";

async function main () {
    const DAIToken = await ethers.getContractFactory("RarePixels");
    const contractName = "RarePixels";
    const contractSymbol = "RPS";
    const discordId = await DAIToken.deploy(contractName, contractSymbol)
    await discordId.waitForDeployment();
    console.log("discordId deployed to:", discordId.target);
    await new Promise(resolve => setTimeout(resolve, 10000));
    await hre.run("verify:verify", {address: discordId.target});
}
 main()

 

//  npx hardhat verify 0x88ac0393DC7015a64Dc7A72485e566DA054D8D62  --network base-goerli

