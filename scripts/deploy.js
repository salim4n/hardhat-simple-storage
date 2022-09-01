//imports
const  {ethers, run, network} = require("hardhat");

/**
 * go to 9h12 to the course on youtube
 */


//async main function
async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log(`Deployed contract to : ${simpleStorage.address}`);
  //what happens when we deploy to our hardhat nerwork?
  if(network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }

  const currentValue = await simpleStorage.retrieve()
  console.log(`Current value is : ${currentValue}`);

  //Update the current value
  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Updated value is : ${updatedValue}`);
}

async function verify(contractAddress, args) {
  console.log("Verifying contract...");
  try{
    await run("verify", {
      address : contractAddress,
      constructorArguments : args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified !");
    } else {
      console.log(e);
    }
  }
}


//call main
main()
.then(()=>process.exit(0))
.catch((error)=> {
  console.error(error);
  process.exit(1);
});