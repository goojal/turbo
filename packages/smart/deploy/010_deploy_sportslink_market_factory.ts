import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { BigNumber } from "ethers";
import { calcShareFactor, NULL_ADDRESS } from "../src";
import { isHttpNetworkConfig, makeSigner } from "../tasks";
import { Cash, Cash__factory, SportsLinkMarketFactory__factory } from "../typechain";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, ethers } = hre;

  if (!isHttpNetworkConfig(hre.network.config)) {
    return; // skip tests and internal deploy
  }

  const signer = await makeSigner(hre);
  const deployer = await signer.getAddress();

  const collateralAddress =
    hre.network.config.deployConfig?.externalAddresses?.usdcToken || (await deployments.get("Collateral")).address;
  const collateral = Cash__factory.connect(collateralAddress, signer);
  const shareFactor = calcShareFactor(await collateral.decimals());

  const feePot = await deployments.get("FeePot");
  const stakerFee = 0;
  const settlementFee = BigNumber.from(10).pow(14).mul(5); // 0.05%
  const protocolFee = 0;

  const owner = NULL_ADDRESS;
  const protocol = NULL_ADDRESS;
  // default to deployer for manual testing
  const linkNode = hre.network.config.deployConfig?.linkNode || owner;

  const resolutionBufferSeconds = 60 * 60 * 2; // 2 hours

  const args: Parameters<SportsLinkMarketFactory__factory["deploy"]> = [
    owner,
    collateral.address,
    shareFactor,
    feePot.address,
    stakerFee,
    settlementFee,
    protocol,
    protocolFee,
    linkNode,
    resolutionBufferSeconds,
  ];

  await deployments.deploy("SportsLinkMarketFactory", {
    from: deployer,
    args,
    log: true,
  });
};

func.tags = ["SportsLinkMarketFactory"];
func.dependencies = ["Tokens", "FeePot"];

export default func;
