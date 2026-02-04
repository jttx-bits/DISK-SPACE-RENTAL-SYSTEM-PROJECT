const express = require("express");
const app = express();
app.use(express.json());

const { initContract } = require("./utils/ethers");

async function startServer() {
  const { diskRentalContract, accounts } = await initContract();

  const userRoutes = require("./routes/user")(diskRentalContract, accounts);
  const adminRoutes = require("./routes/admin")(diskRentalContract, accounts);

  app.use("/user", userRoutes);
  app.use("/admin", adminRoutes);
  app.use(express.static("frontend"));

  app.listen(3000, () => console.log("Server running on http://localhost:3000"));
}

startServer();