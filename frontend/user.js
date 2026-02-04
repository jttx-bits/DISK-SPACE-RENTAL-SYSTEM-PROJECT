const BASE = "http://localhost:3000";

const rentalsList = document.getElementById("rentalsList");
const plansList = document.getElementById("plansList");

// Load user rentals
document.getElementById("loadRentals").addEventListener("click", async () => {
  rentalsList.innerHTML = "Loading...";
  try {
    const res = await fetch(`${BASE}/user/rentals`);
    const data = await res.json();

    if (data.error) {
      rentalsList.innerHTML = `Error: ${data.error}`;
      return;
    }

    const { rentals, totalHardDiskUsedMB, totalSpaceRentedMB, totalUnusedSpaceMB } = data;

    rentalsList.innerHTML = `<li>Total Used: ${totalHardDiskUsedMB} MB | Total Rented: ${totalSpaceRentedMB} MB | Unused: ${totalUnusedSpaceMB} MB</li>`;

    rentals.forEach(r => {
      const li = document.createElement("li");
      li.textContent = `User: ${r.user}, Space: ${r.spaceMB} MB, Paid: ${r.paid}, Approved: ${r.approved}`;
      rentalsList.appendChild(li);
    });
  } catch (err) {
    rentalsList.innerHTML = `Error: ${err.message}`;
  }
});

// Load plans
document.getElementById("loadPlans").addEventListener("click", async () => {
  plansList.innerHTML = "Loading...";
  try {
    const res = await fetch(`${BASE}/user/plans`);
    const data = await res.json();

    plansList.innerHTML = "";
    data.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `Plan: ${p.name}, Size: ${p.sizeMB} MB, Price: ${p.price} ETH, PlanID: ${p.planId}`;
      plansList.appendChild(li);
    });
  } catch (err) {
    plansList.innerHTML = `Error: ${err.message}`;
  }
});

// Request space
document.getElementById("requestBtn").addEventListener("click", async () => {
  const spaceMB = parseInt(document.getElementById("requestSpaceMB").value);
  if (!spaceMB) return alert("Enter space in MB");

  const res = await fetch(`${BASE}/user/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userIndex: 0, spaceMB })
  });
  const data = await res.json();
  alert(data.message || data.error);
});

// Pay for rental
document.getElementById("payBtn").addEventListener("click", async () => {
  const rentalIndex = parseInt(document.getElementById("payRentalIndex").value);
  if (isNaN(rentalIndex)) return alert("Enter rental index");

  const res = await fetch(`${BASE}/user/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userIndex: 0, rentalIndex })
  });
  const data = await res.json();
  alert(data.message || data.error);
});

// Buy plan
document.getElementById("buyBtn").addEventListener("click", async () => {
  const planId = parseInt(document.getElementById("buyPlanId").value);
  if (isNaN(planId)) return alert("Enter plan ID");

  const res = await fetch(`${BASE}/user/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userIndex: 0, planId })
  });
  const data = await res.json();
  alert(data.message || data.error);
});