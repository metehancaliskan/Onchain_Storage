//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "hardhat/console.sol";

contract BuyGb {
  struct UserRole {
    address userAddress;
    string role;
    int256 day;
    int256 month;
    int256 year;
  }

  UserRole[] public userRoles;

  function currentRole() public view returns (UserRole[] memory) {
    return userRoles;
  }

  function buyGold(
    int256 _day,
    int256 _month,
    int256 _year
  ) public payable {
    require(msg.value == 3000000000000000 wei);
    
    UserRole memory userRole;

    userRole.userAddress = msg.sender;
    userRole.role = "gold";
    userRole.day = _day;
    userRole.month = _month;
    userRole.year = _year;

    userRoles.push(userRole);
  }

  function buyPreminum(
    int256 _day,
    int256 _month,
    int256 _year
  ) public payable {
    require(msg.value == 5000000000000000 wei);

    UserRole memory userRole;

    userRole.userAddress = msg.sender;
    userRole.role = "preminum";
    userRole.day = _day;
    userRole.month = _month;
    userRole.year = _year;

    userRoles.push(userRole);
  }

  function SendMony(address payable _to) external {
    _to.transfer(address(this).balance);
  }

}
