async function getHealth() {
  // Define the servers
  const serverNames = [
    "SkynetPro",
    "eu-nl-101",
    "eu-pol-101",
    "eu-pol-102",
    "us-va-101",
    "us-tx-101",
    "us-tx-102",
    "SkynetFree",
    "eu-lv-101",
    "eu-lv-102",
    "eu-lv-103",
    "eu-nl-102",
    "eu-nl-103",
    "eu-nl-104",
    "SiaSky",
    "as-hk-1",
    "as-sp-1",
    "as-sp-2",
    "eu-fin-1",
    "eu-fin-2",
    "eu-fin-3",
    "eu-fin-4",
    "eu-fin-5",
    "eu-fin-6",
    "eu-fin-7",
    "eu-fin-8",
    "eu-fin-9",
    "eu-fin-10",
    "eu-fin-11",
    "eu-fin-12",
    "eu-fin-13",
    "eu-fin-14",
    "eu-fin-15",
    "eu-ger-1",
    "eu-ger-2",
    "eu-ger-3",
    "eu-ger-4",
    "eu-ger-5",
    "eu-ger-6",
    "eu-ger-7",
    "eu-ger-8",
    "eu-ger-9",
    "eu-ger-10",
    "eu-ger-11",
    "eu-ger-12",
    "eu-pol-1",
    "eu-pol-2",
    "eu-pol-3",
    "eu-pol-4",
    "eu-pol-5",
    "us-ny-1",
    "us-ny-2",
    "us-pa-1",
    "us-pa-2",
    "us-va-1",
    "us-va-2",
    "us-va-3",
    "us-va-4",
    "us-va-5",
    "us-va-6",
    "us-la-1",
    "us-la-2",
    "us-la-3",
    "us-or-1",
    "us-or-2",
    "Dev Servers",
    "siasky.xyz",
    "dev1",
    "dev2",
    "dev3",
    "crap",
  ];

  // Fill out the table with no data.
  for (let i = 0; i < serverNames.length; i++) {
    var table = document.getElementById("serverStats");
    var row = table.insertRow(i + 1);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = serverNames[i];
    // Stop here for Zone Rows
    if (
      serverNames[i].includes("Skynet") ||
      serverNames[i].includes("SiaSky") ||
      serverNames[i].includes("Dev Servers")
    ) {
      cell1.style.display = "inline-block";
      cell1.style.width = "100px";
      cell1.style.border = "none";
      continue;
    }
    row.insertCell(1);
    row.insertCell(2);
  }

  var table = document.getElementById("serverStats");

  // Grab Skylink Health.
  for (let i = 0; i < serverNames.length; i++) {
    // Skip Non-Server Rows
    let isProRow = serverNames[i].includes("SkynetPro");
    let isFreeRow = serverNames[i].includes("SkynetFree");
    let isSiaSkyRow = serverNames[i].includes("SiaSky");
    let isDevServersRow = serverNames[i].includes("Dev Servers");
    if (isProRow || isFreeRow || isSiaSkyRow || isDevServersRow) {
      continue;
    }
    // Define helper for dev servers
    let isDevServer = serverNames[i].includes("dev");
    let isXYZServer = serverNames[i].includes("xyz");
    let isCrapServer = serverNames[i].includes("crap");

    // Prod servers and crap server use siasky.net
    let domain = serverNames[i] + ".siasky.net";
    // Update Domain
    if (isDevServer) {
      domain = serverNames[i] + ".siasky.dev";
    } else if (i < 7) {
      domain = serverNames[i] + ".skynetpro.net";
    } else if (i < 14) {
      domain = serverNames[i] + ".skynetfree.net";
    } else if (isXYZServer) {
      domain = "siasky.xyz";
    }
    let skylink = document.getElementById("skylink").value;
    url = "https://" + domain + "/skynet/health/skylink/" + skylink;

    // Fetch results
    fetch(url)
      .then((res) => {
        return res;
      })
      .then((res) => res.json())
      .then((res) => {
        var row = table.rows[i + 1];
        var baseSectorCell = row.cells[1];
        var fanoutCell = row.cells[2];

        if (res.basesectorredundancy) {
          baseSectorCell.innerHTML = res.basesectorredundancy;
          if (res.basesectorredundancy >= 10) {
            baseSectorCell.style.color = "green";
          } else if (res.basesectorredundancy < 5) {
            baseSectorCell.style.color = "orange";
          } else if (res.basesectorredundancy < 2) {
            baseSectorCell.style.color = "red";
          }
        }
        if (res.fanoutredundancy) {
          fanoutCell.innerHTML = res.fanoutredundancy;
        }

        return res;
      })
      .catch((err) => {
        console.log(`Error fetching health for '${serverNames[i]}'`, err);

        var row = table.rows[i + 1];
        var activeCell = row.cells[1];

        // Set the active cell.
        activeCell.innerHTML = "Unresponsive";
        activeCell.style.color = "red";
      });
  }
}
