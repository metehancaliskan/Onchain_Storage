import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import fileUpload, { UploadedFile } from "express-fileupload";
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import compression from "compression";
import morgan from "morgan";
import { create } from "ipfs-http-client";
import crypto, { createHmac } from "node:crypto";
import SendFile from "./artifacts/contracts/SendFile.sol/SendFile.json";
import { Contract, providers } from "ethers";
import jwt from "jsonwebtoken";

const app = express();
const port = 4000;

dotenv.config();

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.use(hpp());
app.use(morgan("dev"));
app.use(cors());

app.post("/sendMultipleFile/", async (req: Request, res: Response) => {
  const fileData = req?.files?.myFile as any | UploadedFile[];
  console.log("filedata line 27 " + fileData);

  let myArray: any[] = [];

  for (let index = 0; index < fileData.length; index++) {
    const element = fileData[index];
    console.log(element);

    const projectId = `${process.env.PROJECT_ID}`;
    const projectSecret = `${process.env.PROJECT_SECRET}`;
    const auth =
      "Basic " +
      Buffer.from(projectId + ":" + projectSecret).toString("base64");

    const ipfs = await create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth,
      },
    });

    const file = await ipfs.add(element.data);
    const newFile = `ipfs/${file.cid}?filename=${element.name}`;

    const cipher = crypto.createCipher("aes192", `${process.env.SECRETKEY}`);
    var encrypted = cipher.update(newFile, "utf8", "hex");
    encrypted += cipher.final("hex");
    console.log(encrypted);

    let myObj: any = {
      link: encrypted,
      name: element.name,
      size: file.size,
    };

    myArray.push(myObj);
    console.log("New File Upload Ipfs Link is " + newFile);
  }

  res.status(201).json({
    status: "success",
    data: myArray,
  });
});

app.post("/sendSingleFile/", async (req: Request, res: Response) => {
  const fileData = req?.files?.myFile as any | UploadedFile[];
  console.log("filedata line 27 " + fileData);

  let myArray: any[] = [];

  const projectId = `${process.env.PROJECT_ID}`;
  const projectSecret = `${process.env.PROJECT_SECRET}`;
  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

  const ipfs = await create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });

  const file = await ipfs.add(fileData.data);
  const newFile = `ipfs/${file.cid}?filename=${fileData.name}`;

  const cipher = crypto.createCipher("aes192", `${process.env.SECRETKEY}`);
  var encrypted = cipher.update(newFile, "utf8", "hex");
  encrypted += cipher.final("hex");
  console.log(encrypted);

  let myObj: any = {
    link: encrypted,
    name: fileData.name,
    size: file.size,
  };

  myArray.push(myObj);
  console.log("New File Upload Ipfs Link is " + newFile);

  res.status(201).json({
    status: "success",
    data: myArray,
  });
});

app.post("/getFiles/", async (req: Request, res: Response) => {
  let myArray: any[] = [];
  console.log(process.env.PROVIDER);

  const provider = new providers.JsonRpcProvider(`${process.env.PROVIDER}`);

  const contract = new Contract(
    `${process.env.CREATE_FILE_KEY}`,
    SendFile.abi,
    provider
  );

  const data = await contract.getFiles();

  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    const publicKey = req.body.publicKey;

    if (element[0].toLowerCase() === publicKey) {
      const decipher = crypto.createDecipher(
        "aes192",
        `${process.env.SECRETKEY}`
      );
      var encrypted = element[4];
      var decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");
      console.log(decrypted);

      const newArray: any[] = [
        element[0],
        element[1],
        element[2],
        element[3],
        "https://ipfs.io/" + decrypted,
      ];

      myArray.push(newArray);
    }
  }

  console.log(myArray);

  res.status(201).json({
    status: "success",
    data: myArray,
  });
});

app.post("/login/", async (req: Request, res: Response) => {
  try {
    const token: string = jwt.sign(
      { userPulicKey: req.body.userPulicKey },
      `${process.env.TOKEN_KEY}`
    );
    console.log(token);

    function setCookie(name: string, val: string) {
      const date = new Date();
      const value = val;

      // Set it expire in 7 days
      date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    }

    setCookie("token", token);

    res.status(201).json({
      status: "success",
      data: token,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/importAccount/", async (req: Request, res: Response) => {
  try {
    const decoded = jwt.verify(req.body.token, `${process.env.TOKEN_KEY}`);
    console.log(decoded);

    if (typeof req.body.token === "undefined") {
      req.body.token = "";
    }

    res.status(201).json({
      status: "success",
      data: decoded,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
