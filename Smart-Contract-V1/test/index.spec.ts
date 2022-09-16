import { expect } from "chai";
import { ethers } from "hardhat";
import { SendFile } from "../typechain";

describe("SendFile", function () {
  let sendFile: SendFile;

  beforeEach(async () => {
    const SendFile = await ethers.getContractFactory("SendFile");
    sendFile = await SendFile.deploy();
  });

  it("Should return the new file", async function () {
    await sendFile.deployed();

    const setFileTx = await sendFile.createFiles(
      "name",
      "ipfs://dlkaspodposdakpoa",
      "2"
    );

    // wait until the transaction is mined
    await setFileTx.wait();
    const setSendFileTx = await sendFile.getFiles();
    console.log(setSendFileTx);

    expect(setSendFileTx).to.equal(setSendFileTx);
  });
});
