import axios from "axios";
import { ethers } from "ethers";

declare let window: any;

export async function sendSingleFile(myFiles: any, SendFile: any) {
  if (typeof window.ethereum !== "undefined") {
    let myArray: any[] = [];

    const formData = new FormData();
    formData.append("myFile", myFiles);
    myArray.push(formData);
    console.log(formData, myFiles);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      "0xd8EB6F8C4882Af90FEC4EBA485df8d66Be0DE970" ||
        `${process.env.CREATE_FILE_KEY}`,
      SendFile.abi,
      signer
    );
    console.log(contract);

    try {
      axios
        .post("http://localhost:4000/api/", formData)
        .then(async (data: any) => {
          const filesData = data.data.data;
          console.log(filesData);
          for (let index = 0; index < filesData.length; index++) {
            const fileElement = filesData[index];

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
              "0xd8EB6F8C4882Af90FEC4EBA485df8d66Be0DE970" ||
                `${process.env.CREATE_FILE_KEY}`,
              SendFile.abi,
              signer
            );

            const contractData = await contract.createFiles(
              fileElement.name,
              fileElement.link,
              fileElement.size
            );

            await contractData.wait();
            console.log("data: ", contractData);
          }
        });

      console.log(window.ethereum.selectedAddress);
    } catch (err: unknown) {
      console.log("Error: ", err);
    }
  }
}
