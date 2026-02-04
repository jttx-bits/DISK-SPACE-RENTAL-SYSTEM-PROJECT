// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DiskRental {
    address public admin;

    struct Rental {
        uint256 spaceMB;
        address user;
        bool approved;
        bool paid;
    }

    Rental[] public rentals;

    constructor() {
        admin = msg.sender;
    }

    // User requests disk space
    function requestRental(uint256 spaceMB) external {
        rentals.push(Rental(spaceMB, msg.sender, false, false));
    }

    // Admin approves rental
    function approveRental(uint256 index) external {
        require(msg.sender == admin, "Only admin");
        rentals[index].approved = true;
    }

    // User marks payment
    function markPaid(uint256 index) external {
        require(rentals[index].user == msg.sender, "Only renter");
        rentals[index].paid = true;
    }

    function getRentals() external view returns (Rental[] memory) {
        return rentals;
    }
}