const main = async () => {
    const gbContractFactory = await hre.ethers.getContractFactory("GeceyeBirak");
    const gbContract = await gbContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.15"),
      });
    await gbContract.deployed();
    console.log("Contract deployed to:", gbContract.address);

    let contractBalance = await hre.ethers.provider.getBalance(
        gbContract.address
      );
    console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    let mesajTxn = await gbContract.mesaj("a message");
    await mesajTxn.wait();

    contractBalance = await hre.ethers.provider.getBalance(gbContract.address);
    console.log(
      "Contract balance:",
      hre.ethers.utils.formatEther(contractBalance)
    );
  
    let allMesajs = await gbContract.getAllMesajs();
    console.log(allMesajs);

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