const express = require("express");

module.exports = function(diskRentalContract, accounts) {
  const router = express.Router();

  // Approve rental
  router.post("/approve", async (req, res) => {
    try {
      const { adminIndex, rentalIndex } = req.body;
      const tx = await diskRentalContract.connect(accounts[adminIndex]).approveRental(rentalIndex);
      await tx.wait();
      res.json({ message: "Rental approved" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Reject rental
  router.post("/reject", async (req, res) => {
    try {
      const { adminIndex, rentalIndex } = req.body;
      const rentals = await diskRentalContract.getRentals();
      if (rentalIndex >= rentals.length) return res.status(404).json({ error: "Rental not found" });

      // Off-chain reject (as before)
      rentals[rentalIndex].approved = false;
      res.json({ message: "Rental rejected (off-chain)" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // View pending rentals
  router.get("/pending", async (req, res) => {
    try {
      const rentals = await diskRentalContract.getRentals();

      // Fix BigInt serialization
      const pending = rentals
        .map((r, i) => ({
          rentalIndex: i,
          user: r.user,
          spaceMB: r.spaceMB.toString(),
          paid: r.paid.toString(),
          approved: r.approved
        }))
        .filter(r => !r.approved);

      res.json(pending);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // View accepted rentals
  router.get("/accepted", async (req, res) => {
    try {
      const rentals = await diskRentalContract.getRentals();

      const accepted = rentals
        .map((r, i) => ({
          rentalIndex: i,
          user: r.user,
          spaceMB: r.spaceMB.toString(),
          paid: r.paid.toString(),
          approved: r.approved
        }))
        .filter(r => r.approved);

      res.json(accepted);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};