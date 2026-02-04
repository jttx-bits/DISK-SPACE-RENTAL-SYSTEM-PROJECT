const API_BASE = "http://localhost:3000";

async function requestSpace() {
  const userIndex = parseInt(document.getElementById("userIndex").value);
  const spaceMB = parseInt(document.getElementById("requestSpace").value);

  const res = await fetch(`${API_BASE}/user/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userIndex, spaceMB })
  });
  const data = await res.json();
  alert(JSON.stringify(data));
  loadDashboard();
}

// Load available plans
async function loadPlans() {
  const res = await fetch(`${API_BASE}/user/plans`);
  const plans = await res.json();
  const select = document.getElementById("planSelect");
  select.innerHTML = "";
  plans.forEach(p => {
    const option = document.createElement("option");
    option.value = p.planId;
    option.text = `${p.name} - ${p.sizeMB}MB - $${p.price}`;
    select.add(option);
  });
}

// Buy a plan
async function buyPlan() {
  const userIndex = parseInt(document.getElementById("userIndex").value);
  const planId = parseInt(document.getElementById("planSelect").value);

  const res = await fetch(`${API_BASE}/user/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userIndex, planId })
  });
  const data = await res.json();
  alert(JSON.stringify(data));
  loadDashboard();
}

// Mark payment
async function payRental() {
  const userIndex = parseInt(document.getElementById("userIndex").value);
  const rentalIndex = prompt("Enter Rental Index to pay:");
  const res = await fetch(`${API_BASE}/user/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userIndex, rentalIndex: parseInt(rentalIndex) })
  });
  const data = await res.json();
  alert(JSON.stringify(data));
  loadDashboard();
}

// Load dashboard
async function loadDashboard() {
  const res = await fetch(`${API_BASE}/user/rentals`);
  const dashboard = await res.json();

  let html = `<h3>Dashboard</h3>
  <p>Total Hard Disk Used: ${dashboard.totalHardDiskUsedMB} MB</p>
  <p>Total Space Rented: ${dashboard.totalSpaceRentedMB} MB</p>
  <p>Total Unused Space: ${dashboard.totalUnusedSpaceMB} MB</p>
  <h4>All Rentals:</h4>`;

  dashboard.rentals.forEach((r, i) => {
    html += `<div class="rental">[${i}] ${r.spaceMB}MB - Approved: ${r.approved} - Paid: ${r.paid}</div>`;
  });

  document.getElementById("dashboard").innerHTML = html;
}

// Admin functions
async function loadPending() {
  const res = await fetch(`${API_BASE}/admin/pending`);
  const rentals = await res.json();
  let html = "";
  rentals.forEach(r => {
    html += `<div class="rental">
      [${r.rentalIndex}] ${r.spaceMB}MB - User: ${r.user} 
      <button onclick="approveRental(${r.rentalIndex})">Approve</button>
    </div>`;
  });
  document.getElementById("pending").innerHTML = html;
}

async function loadAccepted() {
  const res = await fetch(`${API_BASE}/admin/accepted`);
  const rentals = await res.json();
  let html = rentals.map(r => `[${r.rentalIndex}] ${r.spaceMB}MB - User: ${r.user}`).join("<br>");
  document.getElementById("accepted").innerHTML = html;
}

async function approveRental(rentalIndex) {
  const adminIndex = parseInt(document.getElementById("adminIndex").value);
  const res = await fetch(`${API_BASE}/admin/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminIndex, rentalIndex })
  });
  const data = await res.json();
  alert(JSON.stringify(data));
  loadPending();
  loadDashboard();
}

// Initial load
loadPlans();
loadDashboard();
loadPending();
loadAccepted();