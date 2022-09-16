"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const hpp_1 = __importDefault(require("hpp"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const ipfs_http_client_1 = require("ipfs-http-client");
const node_crypto_1 = __importDefault(require("node:crypto"));
const SendFile_json_1 = __importDefault(require("./artifacts/contracts/SendFile.sol/SendFile.json"));
const ethers_1 = require("ethers");
const app = (0, express_1.default)();
const port = 4000;
dotenv_1.default.config();
app.use((0, express_fileupload_1.default)({
    createParentPath: true,
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, hpp_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.post("/sendMultipleFile/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const fileData = (_a = req === null || req === void 0 ? void 0 : req.files) === null || _a === void 0 ? void 0 : _a.myFile;
    console.log("filedata line 27 " + fileData);
    let myArray = [];
    for (let index = 0; index < fileData.length; index++) {
        const element = fileData[index];
        console.log(element);
        const projectId = `${process.env.PROJECT_ID}`;
        const projectSecret = `${process.env.PROJECT_SECRET}`;
        const auth = "Basic " +
            Buffer.from(projectId + ":" + projectSecret).toString("base64");
        const ipfs = yield (0, ipfs_http_client_1.create)({
            host: "ipfs.infura.io",
            port: 5001,
            protocol: "https",
            headers: {
                authorization: auth,
            },
        });
        const file = yield ipfs.add(element.data);
        const newFile = `ipfs/${file.cid}?filename=${element.name}`;
        const cipher = node_crypto_1.default.createCipher("aes192", `${process.env.SECRETKEY}`);
        var encrypted = cipher.update(newFile, "utf8", "hex");
        encrypted += cipher.final("hex");
        console.log(encrypted);
        let myObj = {
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
}));
app.post("/sendSingleFile/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const fileData = (_b = req === null || req === void 0 ? void 0 : req.files) === null || _b === void 0 ? void 0 : _b.myFile;
    console.log("filedata line 27 " + fileData);
    let myArray = [];
    const projectId = `${process.env.PROJECT_ID}`;
    const projectSecret = `${process.env.PROJECT_SECRET}`;
    const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
    const ipfs = yield (0, ipfs_http_client_1.create)({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
        headers: {
            authorization: auth,
        },
    });
    const file = yield ipfs.add(fileData.data);
    const newFile = `ipfs/${file.cid}?filename=${fileData.name}`;
    const cipher = node_crypto_1.default.createCipher("aes192", `${process.env.SECRETKEY}`);
    var encrypted = cipher.update(newFile, "utf8", "hex");
    encrypted += cipher.final("hex");
    console.log(encrypted);
    let myObj = {
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
}));
app.post("/getFiles/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let myArray = [];
    console.log(process.env.PROVIDER);
    const provider = new ethers_1.providers.JsonRpcProvider(`${process.env.PROVIDER}`);
    const contract = new ethers_1.Contract(`${process.env.CREATE_FILE_KEY}`, SendFile_json_1.default.abi, provider);
    const data = yield contract.getFiles();
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const publicKey = req.body.publicKey;
        console.log(element[0], publicKey);
        if (element[0].toLowerCase() === publicKey) {
            const decipher = node_crypto_1.default.createDecipher("aes192", `${process.env.SECRETKEY}`);
            var encrypted = element[4];
            var decrypted = decipher.update(encrypted, "hex", "utf8");
            decrypted += decipher.final("utf8");
            console.log(decrypted);
            const newArray = [
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
}));
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
