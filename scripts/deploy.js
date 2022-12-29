const main = async () => {
    
    const gbContractFactory = await hre.ethers.getContractFactory("GeceyeBirak");
    const gbContract = await gbContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1"),
      });
    
    await gbContract.deployed();
  
    console.log("GeceyeBirak address: ", gbContract.address);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();