    // Define the servers
    const serverNames = [
        'Totals',
        'Asia Zone',
        'as-hk-1',
        'as-sp-1',
        'as-sp-2',
        'EU Zone',
        'eu-fin-1',
        'eu-fin-2',
        'eu-fin-3',
        'eu-fin-4',
        'eu-fin-5',
        'eu-fin-6',
        'eu-fin-7',
        'eu-fin-8',
        'eu-fin-9',
        'eu-fin-10',
        'eu-ger-1',
        'eu-ger-2',
        'eu-ger-3',
        'eu-ger-4',
        'eu-ger-5',
        'eu-ger-6',
        'eu-ger-7',
        'eu-ger-8',
        'eu-ger-9',
        'eu-ger-10',
        'eu-ger-11',
        'eu-ger-12',
        'eu-pol-1',
        'eu-pol-2',
        'eu-pol-3',
        'eu-pol-4',
        'eu-pol-5',
        'US East Zone',
        'us-ny-1',
        'us-ny-2',
        'us-pa-1',
        'us-pa-2',
        'us-va-1',
        'us-va-2',
        'us-va-3',
        'us-va-4',
        'us-va-5',
        'us-va-6',
        'US West Zone',
        'us-la-1',
        'us-la-2',
        'us-la-3',
        'us-or-1',
        'us-or-2',
        'Dev Servers',
        'siasky.xyz',
        'dev1',
        'dev2',
        'dev3',
        'crap'
    ];

    // Define Total Servers
    //
    // Minus 11, 6 title rows and 5 dev servers
    let totalServers = serverNames.length - 11

    // Fill out the table with no data.
    for (let i = 0; i < serverNames.length; i++) {
        var table = document.getElementById('serverStats');
        var row = table.insertRow(i + 1);
        var cell1 = row.insertCell(0);
        cell1.innerHTML = serverNames[i];
        // Stop here for Zone Rows
        if (serverNames[i].includes("Zone") || serverNames[i].includes("Dev Servers")) {
            cell1.style.display = "inline-block";
            cell1.style.width = "100px";
            cell1.style.border = "none";
            continue;
        }
        row.insertCell(1);
        row.insertCell(2);
        row.insertCell(3);
        row.insertCell(4);
        row.insertCell(5);
        row.insertCell(6);
        row.insertCell(7);
        row.insertCell(8);
        row.insertCell(9);
        row.insertCell(10);
        row.insertCell(11);
        row.insertCell(12);
        row.insertCell(13);
        row.insertCell(14);
        row.insertCell(15);
        row.insertCell(16);
        row.insertCell(17);
        row.insertCell(18);
        row.insertCell(19);
        row.insertCell(20);
        row.insertCell(21);
        row.insertCell(22);
        row.insertCell(23);
        row.insertCell(24);
        row.insertCell(25);
    }

    var table = document.getElementById('serverStats');

    // Define Total Vars
    let totalInactive = 0;
    let totalAccountDown = 0;
    let totalRow = table.rows[1];

    // Fill out the lb information.
    for (let i = 0; i < serverNames.length; i++) {
        // Skip Non-Server Rows
        let isZoneRow = serverNames[i].includes("Zone")
        let isDevServersRow = serverNames[i].includes("Dev Servers")
        let isTotalsRow = serverNames[i].includes("Total")
        if (isZoneRow || isDevServersRow || isTotalsRow) {
            continue;
        }

        // Define helper for dev servers
        let isDevServer = serverNames[i].includes("dev");
        let isXYZServer = serverNames[i].includes("xyz");
        let isCrapServer = serverNames[i].includes("crap");
        let ignoreTotals = isDevServer || isXYZServer || isCrapServer;

        // Prod servers and crap server use siasky.net	
        let domain = serverNames[i] + '.siasky.net'
            // Update for Dev Servers
        if (isDevServer) {
            domain = serverNames[i] + '.siasky.dev'
        }
        // Handle xyz server
        if (isXYZServer) {
            domain = 'siasky.xyz'
        }
        url = 'https://' + domain + '/health-check?nocache=true'

        // Fetch results
        fetch(url)
            .then(res => {
                var row = table.rows[i + 1];
                var activeCell = row.cells[3];

                // Set the active cell.
                if (res.status > 200) {
                    activeCell.innerHTML = 'No';
                    activeCell.style.color = 'red';

                    // Update Totals
                    if (!ignoreTotals) {
                        totalInactive += 1;
                    }
                } else {
                    activeCell.innerHTML = 'Yes';
                    activeCell.style.color = 'green';
                }

                // Update Total Row
                let percentUp = (totalServers - totalInactive) / totalServers * 100;
                let totalCell = totalRow.cells[3];
                totalCell.innerHTML = (percentUp).toFixed(0);
                if (percentUp >= 75) {
                    totalCell.style.color = 'green'
                } else if (percentUp >= 50) {
                    totalCell.style.color = 'orange'
                } else {
                    totalCell.style.color = 'red'
                }

                return res
            })
            .then(res => res.json())
            .then(res => {
                var row = table.rows[i + 1];
                var accountCell = row.cells[4];

                // Set the account cell.
                if (res.entry && res.entry.checks !== undefined) {
                    const checks = res.entry.checks
                    const health = checks.filter(el => el.name === 'accounts')
                    if (health.length && health[0].up) {
                        accountCell.innerHTML = 'healthy';
                        accountCell.style.color = 'green';
                    } else {
                        accountCell.innerHTML = 'down';
                        accountCell.style.color = 'red';

                        // Update Totals
                        if (!ignoreTotals) {
                            totalAccountDown += 1;
                        }
                    }
                }

                // Update Total Row
                let percentUp = (totalServers - totalAccountDown) / totalServers * 100;
                let totalCell = totalRow.cells[4];
                totalCell.innerHTML = (percentUp).toFixed(0);
                if (percentUp >= 75) {
                    totalCell.style.color = 'green'
                } else if (percentUp >= 50) {
                    totalCell.style.color = 'orange'
                } else {
                    totalCell.style.color = 'red'
                }

                return res
            })
            .catch(err => {
                console.log(`Error fetching health for '${serverNames[i]}'`)

                var row = table.rows[i + 1];
                var activeCell = row.cells[3];
                var accountCell = row.cells[4];

                // Set the active cell.
                activeCell.innerHTML = 'No';
                activeCell.style.color = 'red';

                // Set the account cell.
                accountCell.innerHTML = 'Unknown';
                accountCell.style.color = 'red';

                // Ignore Dev servers
                if (!ignoreTotals) {
                    // Update Inactive Totals
                    totalInactive += 1;
                    let percentUp = (totalServers - totalInactive) / totalServers * 100;
                    let totalUpCell = totalRow.cells[3];
                    totalUpCell.innerHTML = (percentUp).toFixed(0);
                    if (percentUp >= 75) {
                        totalUpCell.style.color = 'green'
                    } else if (percentUp >= 50) {
                        totalUpCell.style.color = 'orange'
                    } else {
                        totalUpCell.style.color = 'red'
                    }

                    // Update Account Down Totals
                    totalAccountDown += 1;
                    let percentAccountUp = (totalServers - totalAccountDown) / totalServers * 100;
                    let totalAccountUpCell = totalRow.cells[4];
                    totalAccountUpCell.innerHTML = (percentAccountUp).toFixed(0);
                    if (percentAccountUp >= 75) {
                        totalAccountUpCell.style.color = 'green'
                    } else if (percentAccountUp >= 50) {
                        totalAccountUpCell.style.color = 'orange'
                    } else {
                        totalAccountUpCell.style.color = 'red'
                    }
                }
            })
    }

    // Define Total Vars
    let totalDLRate = 0;
    let totalULBaseRate = 0;
    let totalULChunkRate = 0;
    let totalRRRate = 0;
    let totalRWRate = 0;
    let totalFiles = 0;
    let totalStorage = 0;
    let totalContractData = 0;
    let totalRepairData = 0;
    let totalStuckChunks = 0;

    // Fill out the table with information from the stats endpoint.
    for (let i = 0; i < serverNames.length; i++) {
        // Skip Non-Server Rows
        let isZoneRow = serverNames[i].includes("Zone")
        let isDevServersRow = serverNames[i].includes("Dev Servers")
        let isTotalsRow = serverNames[i].includes("Total")
        if (isZoneRow || isDevServersRow || isTotalsRow) {
            continue;
        }

        // Define helper for dev servers
        let isDevServer = serverNames[i].includes("dev");
        let isXYZServer = serverNames[i].includes("xyz");
        let isCrapServer = serverNames[i].includes("crap");
        let ignoreTotals = isDevServer || isXYZServer || isCrapServer;

        // Prod servers and crap server use siasky.net	
        let domain = serverNames[i] + '.siasky.net'
            // Update for Dev Servers
        if (isDevServer) {
            domain = serverNames[i] + '.siasky.dev'
        }
        // Handle xyz server
        if (isXYZServer) {
            domain = 'siasky.xyz'
        }
        url = 'https://' + domain + '/skynet/stats?nocache=true'

        // Fetch results
        fetch(url)
            .then(async res => {
                try {
                    const data = await res.json();
                    return data;
                } catch (error) {
                    throw new Error(res.status)
                }
            })
            .then(res => {
                var row = table.rows[i + 1];

                if (res.versioninfo !== undefined) {
                    if (res.versioninfo.gitrevision !== undefined) {
                        var versionCell = row.cells[2];
                        versionCell.innerHTML = res.versioninfo.gitrevision;
                    }
                }

                // Set the alert count cell.
                if (res.numcritalerts !== undefined) {
                    var alertCell = row.cells[5];
                    alertCell.innerHTML = res.numcritalerts;
                    if (res.numcritalerts === 0) {
                        alertCell.style.color = 'green';
                    }
                    if (res.numcritalerts > 0) {
                        alertCell.style.color = 'red';
                    }
                }

                // Set the Download rate cell.
                if (res.streambufferread15mdatapoints) {
                    var streamBufferRateCell = row.cells[6];
                    streamBufferRateCell.innerHTML = (res.streambufferread15mdatapoints).toFixed(2);

                    // Update Totals
                    if (!ignoreTotals) {
                        totalDLRate += res.streambufferread15mdatapoints;
                        let totalCell = totalRow.cells[6];
                        totalCell.innerHTML = (totalDLRate).toFixed(0);
                    }
                }

                // Set the upload basesector rate cell.
                if (res.basesectorupload15mdatapoints) {
                    var baseSectorRateCell = row.cells[7];
                    baseSectorRateCell.innerHTML = (res.basesectorupload15mdatapoints).toFixed(2);

                    // Update Totals
                    if (!ignoreTotals) {
                        totalULBaseRate += res.basesectorupload15mdatapoints;
                        let totalCell = totalRow.cells[7];
                        totalCell.innerHTML = (totalULBaseRate).toFixed(0);
                    }
                }

                // Set the upload chunk rate cell.
                if (res.chunkupload15mdatapoints) {
                    var chunkUploadRateCell = row.cells[8];
                    chunkUploadRateCell.innerHTML = (res.chunkupload15mdatapoints).toFixed(2);

                    // Update Totals
                    if (!ignoreTotals) {
                        totalULChunkRate += res.chunkupload15mdatapoints;
                        let totalCell = totalRow.cells[8];
                        totalCell.innerHTML = (totalULChunkRate).toFixed(0);
                    }
                }

                // Set the regread rate cell.
                if (res.registryread15mdatapoints) {
                    var regReadRateCell = row.cells[9];
                    regReadRateCell.innerHTML = (res.registryread15mdatapoints).toFixed(2);

                    // Update Totals
                    if (!ignoreTotals) {
                        totalRRRate += res.registryread15mdatapoints;
                        let totalCell = totalRow.cells[9];
                        totalCell.innerHTML = (totalRRRate).toFixed(0);
                    }
                }

                // Set the regwrite rate cell.
                if (res.registrywrite15mdatapoints) {
                    var regWriteRateCell = row.cells[10];
                    regWriteRateCell.innerHTML = (res.registrywrite15mdatapoints).toFixed(2);

                    // Update Totals
                    if (!ignoreTotals) {
                        totalRWRate += res.registrywrite15mdatapoints;
                        let totalCell = totalRow.cells[10];
                        totalCell.innerHTML = (totalRWRate).toFixed(0);
                    }
                }

                // Set the stream buffer read time cell.
                if (res.streambufferread15mp99ms) {
                    var uploadCell = row.cells[11];
                    uploadCell.innerHTML = res.streambufferread15mp99ms + 'ms / ' + res.streambufferread15mp999ms + 'ms';
                    if (res.basesectorupload15mp99ms < 2000) {
                        uploadCell.style.color = 'green';
                    }
                    if (res.basesectorupload15mp999ms > 5000) {
                        uploadCell.style.color = 'red';
                    }
                }

                // Set the base sector upload time cell.
                if (res.basesectorupload15mp99ms) {
                    var uploadCell = row.cells[12];
                    uploadCell.innerHTML = res.basesectorupload15mp99ms + 'ms / ' + res.basesectorupload15mp999ms + 'ms';
                    if (res.basesectorupload15mp99ms < 2000) {
                        uploadCell.style.color = 'green';
                    }
                    if (res.basesectorupload15mp999ms > 5000) {
                        uploadCell.style.color = 'red';
                    }
                }

                // Set the upload chunk time cell.
                if (res.chunkupload15mp99ms) {
                    var uploadCell = row.cells[13];
                    uploadCell.innerHTML = res.chunkupload15mp99ms + 'ms / ' + res.chunkupload15mp999ms + 'ms';
                    if (res.chunkupload15mp99ms < 2000) {
                        uploadCell.style.color = 'green';
                    }
                    if (res.chunkupload15mp999ms > 5000) {
                        uploadCell.style.color = 'red';
                    }
                }

                // Set the regread time cell.
                if (res.registryread15mp99ms) {
                    var regReadCell = row.cells[14];
                    regReadCell.innerHTML = res.registryread15mp99ms + 'ms / ' + res.registryread15mp999ms + 'ms';
                    if (res.registryread15mp999ms < 500) {
                        regReadCell.style.color = 'green';
                    }
                    if (res.registryread15mp999ms > 2000) {
                        regReadCell.style.color = 'red';
                    }
                }

                // Set the regwrite time cell.
                if (res.registrywrite15mp99ms) {
                    var regWriteCell = row.cells[15];
                    regWriteCell.innerHTML = res.registrywrite15mp99ms + 'ms / ' + res.registrywrite15mp999ms + 'ms';
                    if (res.registrywrite15mp999ms < 500) {
                        regWriteCell.style.color = 'green';
                    }
                    if (res.registrywrite15mp999ms > 2000) {
                        regWriteCell.style.color = 'red';
                    }
                }

                // set the scan duration cell.
                if (res.systemhealthscandurationhours !== undefined) {
                    var healthCell = row.cells[16];
                    var scanTime = res.systemhealthscandurationhours.toFixed(2);
                    if (scanTime == 0) {
                        healthCell.innerHTML = 'initializing';
                    } else {
                        healthCell.innerHTML = scanTime;
                    }
                    if (scanTime < 8 && scanTime > 0) {
                        healthCell.style.color = 'green';
                    }
                    if (scanTime > 24) {
                        healthCell.style.color = 'red';
                    }
                }

                // set the number of files on the server.
                if (res.numfiles !== undefined) {
                    var filesCell = row.cells[17];
                    filesCell.innerHTML = res.numfiles;
                    if (res.numfiles >= 1500000) {
                        // Color red if over 1.5 million
                        filesCell.style.color = 'red'
                    } else if (res.numfiles > 1000000) {
                        // Color orange if over 1 million
                        filesCell.style.color = 'orange'
                    }

                    // Update Totals
                    if (!ignoreTotals) {
                        totalFiles += res.numfiles;
                        let totalCell = totalRow.cells[17];
                        totalCell.innerHTML = (totalFiles).toFixed(0);
                    }
                }

                // Set the amount of storage on the server.
                if (res.storage !== undefined) {
                    var storageCell = row.cells[18];
                    let storageTBs = res.storage / 1000 / 1000 / 1000 / 1000;
                    storageCell.innerHTML = (storageTBs).toFixed(2);

                    // Update Totals
                    if (!ignoreTotals) {
                        totalStorage += storageTBs;
                        let totalCell = totalRow.cells[18];
                        totalCell.innerHTML = (totalStorage).toFixed(0);
                    }
                }

                // Set the total contract data for the server.
                if (res.contractstorage !== undefined) {
                    var contractCell = row.cells[19];
                    let contractTB = res.contractstorage / 1000 / 1000 / 1000 / 1000;
                    var contractData = (contractTB).toFixed(2)
                    contractCell.innerHTML = contractData;
                    // If the Server has more that 100TB of contract data set it to orange
                    if (contractData > 100) {
                        contractCell.style.color = 'orange'
                    }

                    // Update Totals
                    if (!ignoreTotals) {
                        totalContractData += contractTB;
                        let totalCell = totalRow.cells[19];
                        totalCell.innerHTML = (totalContractData).toFixed(0);
                    }
                }

                // Set the wallet health string.
                if (res.walletstatus) {
                    var walletCell = row.cells[20];
                    walletCell.innerHTML = res.walletstatus;
                    if (res.walletstatus == 'healthy') {
                        walletCell.style.color = 'green';
                    } else if (res.walletstatus == 'low') {
                        walletCell.style.color = 'red';
                    } else if (res.walletstatus == 'locked') {
                        walletCell.style.color = 'orange';
                    }
                }

                // Set the allowance health string.
                if (res.allowancestatus) {
                    var allowanceCell = row.cells[21];
                    allowanceCell.innerHTML = res.allowancestatus;
                    if (res.allowancestatus == 'high') {
                        allowanceCell.style.color = 'orange';
                    } else if (res.allowancestatus == 'low') {
                        allowanceCell.style.color = 'red';
                    } else if (res.allowancestatus == 'healthy') {
                        allowanceCell.style.color = 'green';
                    }
                }

                // Set the max storage price cell
                if (res.allowancestatus) {
                    var maxStoragePriceCell = row.cells[22];
                    maxStoragePriceCell.innerHTML = (res.maxstorageprice * 1000 * 1000 * 1000 * 1000 * 6 * 24 * 30 / 1000000000000000000000000).toFixed(2);
                }

                // Set the repair value.
                if (res.repair !== undefined) {
                    var repairCell = row.cells[23];
                    let repairTB = res.repair / 1000 / 1000 / 1000 / 1000;
                    var repairData = (repairTB).toFixed(2)
                    repairCell.innerHTML = repairData;
                    // If the Server has more that 1TB of repair data set it to orange
                    if (repairData > 1) {
                        repairCell.style.color = 'orange'
                    }

                    // Update Totals
                    if (!ignoreTotals) {
                        totalRepairData += repairTB;
                        let totalCell = totalRow.cells[23];
                        totalCell.innerHTML = (totalRepairData).toFixed(0);
                    }
                }

                // Set the stuck chunks value.
                if (res.stuckchunks !== undefined) {
                    var stuckChunksCell = row.cells[24];
                    stuckChunksCell.innerHTML = (res.stuckchunks);
                    if (res.stuckchunks > 0) {
                        stuckChunksCell.style.color = 'red'
                    }

                    // Update Totals
                    if (!ignoreTotals) {
                        totalStuckChunks += res.stuckchunks;
                        let totalCell = totalRow.cells[24];
                        totalCell.innerHTML = (totalStuckChunks);
                        if (totalStuckChunks > 0) {
                            totalCell.style.color = 'red'
                        }
                    }
                }
                // Set the uptime cell.
                if (res.uptime) {
                    var uptimeCell = row.cells[25];
                    uptime = 0.0
                    t = ''
                    c = ''
                    if (res.uptime < 60 * 60) { // < 1 hour
                        uptime = res.uptime / 60;
                        t = 'm';
                        c = 'red';
                    } else if (res.uptime < 24 * 60 * 60) { // < 1 day
                        uptime = res.uptime / 60 / 60;
                        t = 'h';
                        c = 'orange';
                    } else {
                        uptime = res.uptime / 60 / 60 / 24;
                        t = 'd';
                        c = 'green';
                    }
                    uptime = (Math.round(uptime * 100) / 100).toFixed(1);
                    uptimeCell.innerHTML = uptime + t;
                    uptimeCell.style.color = c;
                }
            }).catch(err => {
                console.log(`Error fetching stats for '${serverNames[i]}: ${err}'`)
            })
    }