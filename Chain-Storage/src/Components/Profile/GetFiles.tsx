import React, { ComponentLifecycle } from "react";
import SendFile from "../../artifacts/contracts/SendFile.sol/SendFile.json";
import BuyGb from "../../artifacts/contracts/BuyGb.sol/BuyGb.json";
import { ethers } from "ethers";
import { Table, Card, Button, Row, Spinner } from "react-bootstrap";
import { Web3Storage, File } from "web3.storage";
import { Link } from "react-router-dom";
import { SendFiles } from "./SendFile";
import {
  MdOutlineContentCopy,
  MdOutlineDeleteOutline,
  MdOutlineImage,
  MdOutlineCode,
  MdPictureAsPdf,
  MdVideocam,
  MdMusicVideo,
  MdOutlineFilePresent,
  MdOutlineDownload,
} from "react-icons/md";
import "../Profile/GetFiles.css";
import axios from "axios";
import fileDownload from "js-file-download";
// import { Link } from "react-router-dom";

declare let window: any;

interface State {
  UserFiles: any[];
  LastUploads: any[];
  CurrenRole: any[] | any;
  myFile: any;
  totalStorage: any;
  totalFileSize: any;
  loading: any;
}

interface Component<P = {}, S = {}> extends ComponentLifecycle<P, S> {}

const sizeArray: any[] = [];

export class GetFiles extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);

    this.fileChangedHandler = this.fileChangedHandler.bind(this);
    this.DeleteFiles = this.DeleteFiles.bind(this);
    this.ShareingFiles = this.ShareingFiles.bind(this);
    this.UpgradeLink = this.UpgradeLink.bind(this);
    this.main = this.main.bind(this);
    this.GetUserRole = this.GetUserRole.bind(this);
    this.downloadFiles = this.downloadFiles.bind(this);

    this.state = {
      UserFiles: [],
      LastUploads: [],
      CurrenRole: [],
      myFile: null,
      totalStorage: "",
      totalFileSize: "",
      loading: false,
    };
  }

  public fileChangedHandler(e: any) {
    this.setState({ myFile: e.target.files[0] });
  }

  async GetUserRole() {
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
        console.log(data);
        let dataArray: any[] = [];

        for (let index = 0; index < data.length; index++) {
          const element = data[index];

          if (
            element.userAddress.toLowerCase() ===
            window.ethereum.selectedAddress
          ) {
            console.log("File Added");
            dataArray.push(element);
          }
        }
        const arr = dataArray.slice(-1).pop();

        this.setState({ CurrenRole: arr });
        const userRole = this.state.CurrenRole;
        console.log(this.state.CurrenRole);
      } catch (error: unknown) {
        console.error(error);
      }
    }
  }

  async main() {
    if (typeof window.ethereum !== "undefined") {
      const dataArray: any[] = [];
      this.GetUserRole();
      try {
        const userData = {
          publicKey: window.ethereum.selectedAddress,
        };

        axios.post("http://localhost:4000/getFiles/", userData).then((data) => {
          console.log(data.data.data);

          const myData = data.data.data;
          for (let index = 0; index < myData.length; index++) {
            const element = myData[index];
            console.log(element);

            const setFileFormats = (fileType: string) => {
              const varName = element[3].endsWith(fileType);
              return varName;
            };

            let fileImage;
            if (setFileFormats("png") === true) {
              fileImage = <MdOutlineImage />;
            } else if (setFileFormats("pdf") === true) {
              fileImage = <MdPictureAsPdf />;
            } else if (setFileFormats("mp.4") === true) {
              fileImage = <MdVideocam />;
            } else if (setFileFormats("mp.3" || "waw") === true) {
              fileImage = <MdMusicVideo />;
            } else if (setFileFormats("json") === true) {
              fileImage = <MdOutlineCode />;
            } else {
              fileImage = <MdOutlineFilePresent />;
            }
            const fileImageArray = [fileImage];
            console.log(fileImageArray);

            const contactElement = fileImageArray.concat(element);
            console.log(fileImage);
            dataArray.push(contactElement);
            console.log(dataArray);
          }

          dataArray.reverse();
          this.setState({ UserFiles: dataArray });

          const lastFourUploads = this.state.UserFiles.slice(0, 4);
          const sliceUploads = lastFourUploads;
          this.setState({ LastUploads: sliceUploads });
        });

        this.state.UserFiles.forEach((element) => {
          console.log(element.fileSize);
          const sizeNumber = Number(element[2]);
          sizeArray.push(sizeNumber);
        });

        this.setState({ loading: true });
      } catch (err: unknown) {
        console.log("Error: ", err);
      }
    }
  }

  async componentDidMount() {
    console.log(window.ethereum._state.accounts.length);
    this.main();
  }

  async DeleteFiles(fileCount: any) {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.CREATE_FILE_KEY ||
          "0xd8EB6F8C4882Af90FEC4EBA485df8d66Be0DE970",
        SendFile.abi,
        signer
      );
      console.log(contract);
      const data = await contract.deleteFile(
        window.ethereum.selectedAddress,
        fileCount
      );
      console.log(data);
    }
  }

  async ShareingFiles() {}

  async UpgradeLink() {
    if (this.state.CurrenRole.role === "preminum") {
      return <Link to="/profile/buyStorage"> Upgrade Account</Link>;
    } else {
      return <Link to="/profile/buyStorage"> Upgrade Account</Link>;
    }
    return <Link to="/profile/buyStorage"> Upgrade Account</Link>;
  }

  async downloadFiles(url: string, filename: any) {
    axios
      .get(url, {
        responseType: "blob",
      })
      .then((res: any) => {
        fileDownload(res.data, filename);
      });
  }

  render(): React.ReactNode {
    let LastFileCheck;
    let UserRole;
    let UserMaxGb;
    if (this.state.LastUploads.length === 0) {
      LastFileCheck = "";
    } else {
      LastFileCheck = "Last Upload";
    }
    if (typeof this.state.CurrenRole === "undefined") {
      UserRole = "standart";
      UserMaxGb = "5000";
    } else if (this.state.CurrenRole[1] === "gold") {
      UserRole = "gold";
      UserMaxGb = "50000";
    } else if (this.state.CurrenRole[1] === "preminum") {
      UserRole = "preminum";
      UserMaxGb = "1000000";
    }
    return (
      <>
        <div className="get-files-container">
          <div className="row w-100" style={{ margin: "0 auto" }}>
            <div className="col-md-3">
              <h5>
                {this.state.totalFileSize} / {UserMaxGb} Mb
              </h5>
              <h1>Role: {UserRole}</h1>
              <button className="link-button">
                <Link className="link" to="/profile/buyStorage">
                  {" "}
                  Upgrade Account
                </Link>
              </button>
              <SendFiles />
            </div>
            <div className="col-md-9">
              <Row>
                <h2>{LastFileCheck}</h2>
                {this.state.LastUploads.map((data: any) => (
                  <div className="col-md-3 mb-4">
                    <Card
                      className="get-files-card"
                      style={{ width: "10rem", height: "10rem" }}
                    >
                      <div style={{ width: "10rem", margin: "0 auto" }}>
                        {data[0]}
                      </div>
                      <Card.Body>
                        <Card.Title>{data[4].slice(0, 20)}</Card.Title>
                        <Card.Text>{data[2]} Mb</Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </Row>
              <Table>
                <thead className="color">
                  <tr>
                    <th>Name</th>
                    <th></th>
                    <th>FileSize</th>
                  </tr>
                </thead>
                {this.state.UserFiles.map((data: any) => (
                  <tbody className="color">
                    <tr className="table-collum">
                      <td>{data[0]}</td>
                      <td>{data[4].slice(0, 20)}</td>
                      <td>{data[2]}</td>
                      <td>
                        <MdOutlineContentCopy
                          onClick={() => {
                            navigator.clipboard.writeText(data[5]);
                          }}
                        />{" "}
                      </td>
                      <td>
                        <MdOutlineDeleteOutline
                          onClick={() => this.DeleteFiles(data[3]._hex)}
                        />{" "}
                      </td>
                      <td>
                        <MdOutlineDownload
                          onClick={() => this.downloadFiles(data[5], data[4])}
                        />
                      </td>
                    </tr>
                  </tbody>
                ))}
              </Table>
            </div>
          </div>
        </div>
        {this.state.loading ? (
          this.main
        ) : (
          <div
            style={{
              width: "50px",
              height: "50px",
              position: "absolute",
              top: "50%",
              left: "50%",
              margin: "-25px 0 0 -25px",
            }}
          >
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
      </>
    );
  }
}
