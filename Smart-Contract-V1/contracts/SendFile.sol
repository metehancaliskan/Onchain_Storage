//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "hardhat/console.sol";

contract SendFile {
  struct File {
    address userAddress;
    string fileSize;
    uint256 fileCount;
    string fileName;
    string fileLink;
  }

  struct FileInput {
    string fileSize;
    string fileName;
    string fileLink;
  }

  File[] public files;

  modifier user() {
    _;
  }

  function getFiles() public view returns (File[] memory) {
    return files;
  }

  function createFiles(
    string memory _FileName,
    string memory _FileLink,
    string memory _FileSize
  ) public {
    File memory file;

    file.userAddress = msg.sender;
    file.fileName = _FileName;
    file.fileLink = _FileLink;
    file.fileCount = files.length;
    file.fileSize = _FileSize;

    files.push(file);
  }

  function deleteFile(address _UserAddress, uint256 index) public user {
    require(files[index].userAddress == _UserAddress);

    files[index] = files[files.length - 1];
    files.pop();
  }
}
