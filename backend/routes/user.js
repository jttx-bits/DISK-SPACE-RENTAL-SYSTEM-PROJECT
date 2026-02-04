const express = require("express");
const plans = require("../utils/plans");

module.exports = function(diskRentalContract, accounts) {
  const router = express.Router();

  // User requests disk space
  router.post("/request", async (req, res) => {
    try {
      const { userIndex, spaceMB } = req.body;
      const tx = await diskRentalContract.connect(accounts[userIndex]).requestRental(spaceMB);
      await tx.wait();
      res.json({ message: "Rental requested" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // User marks payment
  router.post("/pay", async (req, res) => {
    try {
      const { userIndex, rentalIndex } = req.body;
      const tx = await diskRentalContract.connect(accounts[userIndex]).markPaid(rentalIndex);
      await tx.wait();
      res.json({ message: "Payment marked" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // List all rentals (dashboard)
  router.get("/rentals", async (req, res) => {
    try {
      const rentals = await diskRentalContract.getRentals();

      // Compute dashboard stats
      let totalUsed = 0;
      let totalRented = 0;

      rentals.forEach(r => {
        totalRented += parseInt(r.spaceMB);
        if (r.approved) totalUsed += parseInt(r.spaceMB);
      });

      const dashboard = {
        rentals,
        totalHardDiskUsedMB: totalUsed,
        totalSpaceRentedMB: totalRented,
        totalUnusedSpaceMB: totalRented - totalUsed
      };

      res.json(dashboard);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // List available plans
  router.get("/plans", async (req, res) => {
    res.json(plans);
  });

  // Buy a plan
  router.post("/buy", async (req, res) => {
    try {
      const { userIndex, planId } = req.body;
      const plan = plans.find(p => p.planId === planId);
      if (!plan) return res.status(404).json({ error: "Plan not found" });

      const tx = await diskRentalContract.connect(accounts[userIndex]).requestRental(plan.sizeMB);
      await tx.wait();
      res.json({ message: `Plan '${plan.name}' purchased` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};