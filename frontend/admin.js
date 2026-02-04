const BASE = "http://localhost:3000";

const pendingList = document.getElementById("pendingList");
const acceptedList = document.getElementById("acceptedList");

// Load pending rentals
document.getElementById("loadPending").addEventListener("click", async () => {
  pendingList.innerHTML = "Loading...";
  try {
    const res = await fetch(`${BASE}/admin/pending`);
    const data = await res.json();
    if (data.error) {
      pendingList.innerHTML = `Error: ${data.error}`;
      return;
    }

    pendingList.innerHTML = "";
    if (data.length === 0) {
      pendingList.innerHTML = "<li>No pending rentals</li>";
      return;
    }

    data.forEach(r => {
      const li = document.createElement("li");
      li.textContent = `Index: ${r.rentalIndex}, User: ${r.user}, Space: ${r.spaceMB} MB, Paid: ${r.paid}`;

      // Approve button
      const approveBtn = document.createElement("button");
      approveBtn.textContent = "Approve";
      approveBtn.onclick = async () => {
        await fetch(`${BASE}/admin/approve`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminIndex: 0, rentalIndex: r.rentalIndex })
        });
        alert("Rental approved!");
        li.remove();
      };
      li.appendChild(approveBtn);

      // Reject button
      const rejectBtn = document.createElement("button");
      rejectBtn.textContent = "Reject";
      rejectBtn.onclick = async () => {
        await fetch(`${BASE}/admin/reject`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminIndex: 0, rentalIndex: r.rentalIndex })
        });
        alert("Rental rejected!");
        li.remove();
      };
      li.appendChild(rejectBtn);

      pendingList.appendChild(li);
    });
  } catch (err) {
    pendingList.innerHTML = `Error: ${err.message}`;
  }
});

// Load accepted rentals
document.getElementById("loadAccepted").addEventListener("click", async () => {
  acceptedList.innerHTML = "Loading...";
  try {
    const res = await fetch(`${BASE}/admin/accepted`);
    const data = await res.json();
    if (data.error) {
      acceptedList.innerHTML = `Error: ${data.error}`;
      return;
    }

    acceptedList.innerHTML = "";
    if (data.length === 0) {
      acceptedList.innerHTML = "<li>No accepted rentals</li>";
      return;
    }

    data.forEach(r => {
      const li = document.createElement("li");
      li.textContent = `Index: ${r.rentalIndex}, User: ${r.user}, Space: ${r.spaceMB} MB, Paid: ${r.paid}, Approved: ${r.approved}`;
      acceptedList.appendChild(li);
    });
  } catch (err) {
    acceptedList.innerHTML = `Error: ${err.message}`;
  }
});