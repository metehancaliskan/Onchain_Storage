import React from "react";
import BuyGb from "../artifacts/contracts/BuyGb.sol/BuyGb.json";
import { Spinner } from "react-bootstrap";
import { ethers } from "ethers";

declare let window: any;

interface State {
  CurrenRole: any[];
  day: number;
  month: number;
  year: number;
  loading: any;
}

const reactComponent = React.Component;

export class BuyStorageClass extends reactComponent<{}, State> {
  constructor(props: any) {
    super(props);

    this.buyGold = this.buyGold.bind(this);
    this.buyPreminum = this.buyPreminum.bind(this);
    this.buyRole = this.buyRole.bind(this);
    this.main = this.main.bind(this);

    this.state = {
      CurrenRole: [],
      day: 0,
      month: 0,
      year: 0,
      loading: false,
    };
  }

  async main() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        "0x68056f2B4272feeC2EBc2e8C693d574751F066D9",
        BuyGb.abi,
        provider
      );
      try {
        let noting;
        const data = await contract.currentRole();
        console.log(data)
        let dataArray: any[] = [];

        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          const elementYear = Number(element.year) 
          const elementMount = Number(element.month) 
          const elementDay = Number(element.day) 
          console.log(elementYear, elementMount, elementDay);

          if (
            element.userAddress.toLowerCase() ===
            window.ethereum.selectedAddress 
          ) {
            console.log("File Added");
            dataArray.push(element);
          }
        }

        this.setState({ CurrenRole: dataArray });
        const userRole = this.state.CurrenRole;
        console.log(this.state.CurrenRole);
        this.setState({ loading: true })
      } catch (error: unknown) {
        console.error(error);
      }
    }
  }

  async buyRole(ContractValue: any, role: string, price: string) {
    if (typeof window.ethereum !== "undefined") {
      try {
        let dataArray: any[] = [];

        console.log(dataArray);

        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const day = today.getDate();

        this.setState({
          day: day,
          month: month,
          year: year,
        });

        const options = {value: ethers.utils.parseEther(price)}

        const data = await ContractValue(
          day,
          month,
          year,
          options
        );

        console.log(data);


        const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/");
        const signer = new ethers.Wallet("b5b2fdb43e55b54987e77087a7ad369c04faca76ffca3c7542aa93068bbf3bca", provider);

        const contract = new ethers.Contract(
          "0x68056f2B4272feeC2EBc2e8C693d574751F066D9",
          BuyGb.abi,
          signer
        );

        const SendMonyData = await contract.SendMony(
          "0xd059070414F079C51FAd87470B62e394613Cff7b",
        );

        console.log(SendMonyData);
        console.log(dataArray);

        alert(role + "Buyed");
        window.location.href = "/profile";
      } catch (error) {
        console.error(error);
      }
    }
  }

  async componentDidMount() {
    this.main();
  }

  async buyGold(e: any) {
    e.preventDefault();
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x68056f2B4272feeC2EBc2e8C693d574751F066D9",
        BuyGb.abi,
        signer 
      );
      this.buyRole(contract.buyGold, "gold", "0.003");
    }
  }

  async buyPreminum(e: any) {
    e.preventDefault();
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x68056f2B4272feeC2EBc2e8C693d574751F066D9",
        BuyGb.abi,
        signer 
      );
      this.buyRole(contract.buyPreminum, "preminum", "0.005");
    }
  }

  render() {
    return (
      <>
        <h1>Buy Storage</h1>
        <div className="container">
          <div className="row col-md-6">
            <div className="left">
              <h1>Buy Gold</h1>
              <h2>20 MATIC</h2>
              <button onClick={this.buyGold}>Buy Now</button>
            </div>
            <div className="right">
              <h1>Buy Preminum</h1>
              <h2>40 MATIC</h2>
              <button onClick={this.buyPreminum}>Buy Now</button>
            </div>
          </div>
        </div>
        {this.state.loading ? (this.main) : (
          <div style={{  
                width: "50px",
                height: "50px",
                position: "absolute",
                top: "50%",
                left: "50%",
                margin: "-25px 0 0 -25px", }} >
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
        </div>
        )}
      </>
    );
  }
}
