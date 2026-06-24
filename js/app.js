const PIN = "9524";

let currentPin = "";

let serviceStatus = {};

let previousStatus = {};


function runStartupSequence(){

    const startup =
        document.getElementById(
            "startupScreen"
        );

    const dashboard =
        document.getElementById(
            "dashboard"
        );

    const text =
        document.getElementById(
            "startupText"
        );

    const bar =
        document.getElementById(
            "startupBar"
        );

    startup.style.display =
        "flex";

    const steps = [

        {
            text:
            "INITIALIZING CORE...",
            width:"25%"
        },

        {
            text:
            "CHECKING SERVICES...",
            width:"50%"
        },

        {
            text:
            "LOADING INFRASTRUCTURE...",
            width:"75%"
        },

        {
            text:
            "JΛY MATRIX ONLINE",
            width:"100%"
        }

    ];

    let index = 0;

    const interval =
    setInterval(()=>{

        text.innerText =
            steps[index].text;

        bar.style.width =
            steps[index].width;

        index++;

        if(index >= steps.length){

            clearInterval(interval);

            setTimeout(()=>{

                startup.style.display =
                    "none";

                dashboard.style.display =
                    "flex";

            },700);
        }

    },600);
}

function updateDots(){

    const dots =
    document.querySelectorAll(".dot");

    dots.forEach((dot,index)=>{

        dot.style.background =
        index < currentPin.length

        ? "#00D4FF"

        : "rgba(255,255,255,.15)";
    });
}

function enterDigit(digit){

    if(currentPin.length >= 4){
        return;
    }

    currentPin += digit;

    updateDots();
}

function backspace(){

    currentPin =
    currentPin.slice(0,-1);

    updateDots();
}

function verifyPin(){

    if(currentPin === PIN){

        document
        .getElementById("message")
        .innerHTML =
        "ACCESS GRANTED";
        addLog(
            "MR. JAY LOGGED IN"
        );

        setTimeout(()=>{

            document
            .getElementById("lockScreen")
            .style.display =
            "none";

            document
            .getElementById("welcomeScreen")
            .style.display =
            "flex";

            setTimeout(()=>{

                document
                .getElementById(
                    "welcomeScreen"
                )
                .style.display =
                "none";

                runStartupSequence();

            },2000);

        },1000);

    }else{

        document
        .getElementById("message")
        .innerHTML =
        "ACCESS DENIED";

        currentPin = "";

        updateDots();
    }
}

const serviceChecks = [
    {
        id:"streamrCard",
        url:"https://streamr.vignesh-jay.xyz"
    },
    {
        id:"filesCard",
        url:"https://files.vignesh-jay.xyz"
    },
    {
        id:"cloudCard",
        url:"https://cloud.vignesh-jay.xyz"
    },
    {
        id:"dockerCard",
        url:"#"
    },
    {
        id:"nextcloudCard",
        url:"#"
    },
    {
        id:"tunnelCard",
        url:"#"
    }
];

async function checkService(service){

    try{

        await fetch(
            service.url,
            {
                mode:"no-cors"
            }
        );

        updateService(
            service.id,
            true
        );

    }catch{

        updateService(
            service.id,
            false
        );
    }
}

function updateService(id,isOnline){

    const card =
        document.getElementById(id);

    const status =
        card.querySelector(".status");

    if(isOnline){

        status.innerHTML =
            '<span class="online">ONLINE</span>';

    }else{

        status.innerHTML =
            '<span class="offline">OFFLINE</span>';
    }
}

function checkAllServices(){

    serviceChecks.forEach(
        checkService
    );

    document.getElementById(
        "lastCheck"
    ).innerText =
    new Date().toLocaleTimeString();

}

function updateSystemCore(){

    const total =
    Object.keys(serviceStatus).length || 6;

    const online =
        Object.values(serviceStatus)
        .filter(Boolean)
        .length;

    const banner =
        document.getElementById(
            "systemBanner"
        );

        banner.innerText =
        online === total

        ? "ALL SYSTEMS OPERATIONAL"

        : "SYSTEM DEGRADED";

    document.getElementById(
        "onlineCount"
    ).innerText =
    `${online}/${total}`;

    document.getElementById(
        "systemState"
    ).innerText =
    online === total
    ? "ONLINE"
    : "DEGRADED";

    updateCoreColor(online);
}

function updateCoreColor(
    online
){

    const core =
        document.querySelector(
            ".core-ring"
        );

    core.classList.remove(
        "healthy",
        "warning",
        "critical"
    );

    if(online === 6){

        core.classList.add(
            "healthy"
        );

    }else if(
        online >= 4
    ){

        core.classList.add(
            "warning"
        );

    }else{

        core.classList.add(
            "critical"
        );
    }
}

loadStatus();
setInterval(
    loadStatus,
    6000
);

function setServiceStatus(
    service,
    isOnline
){

    serviceStatus[service] =
        isOnline;

    const orbit =
        document.getElementById(
            `orbit-${service}`
        );

    orbit.classList.remove(
        "online",
        "offline"
    );

    orbit.classList.add(
        isOnline
        ? "online"
        : "offline"
    );

    const card =
        document.getElementById(
            `${service}Card`
        );

    const status =
        card.querySelector(
            ".status"
        );

    status.innerHTML =
        isOnline

        ? '<span class="online">ONLINE</span>'

        : '<span class="offline">OFFLINE</span>';

    updateSystemCore();
}

function showModule(moduleId){

    document
        .querySelectorAll(".module")
        .forEach(module => {

            module.classList.remove(
                "active-module"
            );

        });

    document
        .getElementById(moduleId)
        .classList.add(
            "active-module"
        );

    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove(
                "active"
            );

        });

    document
        .querySelector(
            `[onclick="showModule('${moduleId}')"]`
        )
        .classList.add("active");
}

async function loadStatus(){

    try{

        const response =
            await fetch(
                "https://matrix-api.vignesh-jay.xyz/status.json"
            );

        const data =
            await response.json();

        document.getElementById(
            "lastCheck"
        ).innerText =
            data.lastCheck;

        delete data.lastCheck;

        serviceStatus = data;

        updateSystemCore();
        updateOrbitStatus();
        updateCards();
        generateAlerts();

        Object.keys(data).forEach(service => {

        if(service === "lastCheck") return;

        if(
            previousStatus[service] !== undefined &&
            previousStatus[service] !== data[service]
        ){

            addLog(
                `${service.toUpperCase()} ${
                    data[service]
                    ? "ONLINE"
                    : "OFFLINE"
                }`
            );
        }

    });
    previousStatus = {...data};

    }catch(error){

        console.error(
            "Status file error",
            error
        );
    }

}



function updateOrbitStatus(){

    Object.keys(serviceStatus)
    .forEach(service=>{

        const orbit =
            document.getElementById(
                `orbit-${service}`
            );

        if(!orbit) return;

        orbit.classList.remove(
            "online",
            "offline"
        );

        orbit.classList.add(
            serviceStatus[service]
            ? "online"
            : "offline"
        );
    });
}

function updateCards(){

    Object.keys(serviceStatus)
    .forEach(service=>{

        const card =
            document.getElementById(
                `${service}Card`
            );

        if(!card) return;

        const status =
            card.querySelector(
                ".status"
            );

        status.innerHTML =
            serviceStatus[service]

            ? '<span class="online">ONLINE</span>'

            : '<span class="offline">OFFLINE</span>';
    });
}

function updateStorageStatus(
    elementId,
    percent
){

    const el =
        document.getElementById(
            elementId
        );

    const value =
        parseInt(percent);

    el.classList.remove(
        "pct-good",
        "pct-warning",
        "pct-critical"
    );

    if(value >= 80){

        el.classList.add(
            "pct-critical"
        );

    }else if(value >= 60){

        el.classList.add(
            "pct-warning"
        );

    }else{

        el.classList.add(
            "pct-good"
        );
    }
}

function updateStorageBar(barId, pct){

    const bar =
        document.getElementById(barId);

    const value =
        parseInt(pct);

    bar.classList.remove(
        "good",
        "warning",
        "critical"
    );

    if(value >= 80){

        bar.classList.add(
            "critical"
        );

    }else if(value >= 60){

        bar.classList.add(
            "warning"
        );

    }else{

        bar.classList.add(
            "good"
        );
    }
}

async function loadInfrastructure(){

    const response =
        await fetch(
            "https://matrix-api.vignesh-jay.xyz/infra.json"
            );

    const infra =
        await response.json();

    document.getElementById(
        "macSSD"
    ).innerText =
        infra.macmini.ssd;

    document.getElementById(
        "macHDD"
    ).innerText =
        infra.macmini.hdd;

    document.getElementById(
        "macRAM"
    ).innerText =
        infra.macmini.ram;

    document.getElementById(
        "macUptime"
    ).innerText =
        infra.macmini.uptime;

    document.getElementById(
        "ubuntuSSD"
    ).innerText =
        infra.ubuntu.ssd;

    document.getElementById(
        "ubuntuHDD"
    ).innerText =
        infra.ubuntu.hdd;

    document.getElementById(
        "ubuntuRAM"
    ).innerText =
        infra.ubuntu.ram;

    document.getElementById(
        "ubuntuUptime"
    ).innerText =
        infra.ubuntu.uptime;

    document.getElementById(
        "macSSDPct"
        ).innerText =
        infra.macmini.ssdPct;

    document.getElementById(
        "macHDDPct"
        ).innerText =
        infra.macmini.hddPct;

    document.getElementById(
        "macRAMPct"
        ).innerText =
        infra.macmini.ramPct;

    document.getElementById(
        "macCPU"
        ).innerText =
        infra.macmini.cpu;

    document.getElementById(
        "ubuntuSSDPct"
        ).innerText =
        infra.ubuntu.ssdPct;

    document.getElementById(
        "ubuntuHDDPct"
        ).innerText =
        infra.ubuntu.hddPct;

    document.getElementById(
        "ubuntuRAMPct"
        ).innerText =
        infra.ubuntu.ramPct;

    document.getElementById(
        "ubuntuCPU"
        ).innerText =
        infra.ubuntu.cpu;

    document.getElementById(
        "jayFilesStorage"
        ).innerText =
        infra.macmini.hdd;

    document.getElementById(
        "jayFilesPct"
        ).innerText =
        infra.macmini.hddPct;

    updateStorageStatus(
        "jayFilesPct",
        infra.macmini.hddPct
    );

    document.getElementById(
        "jayCloudStorage"
        ).innerText =
        infra.ubuntu.hdd;

    document.getElementById(
        "jayCloudPct"
        ).innerText =
        infra.ubuntu.hddPct;

    updateStorageStatus(
        "jayCloudPct",
        infra.ubuntu.hddPct
    );

    updateStorageBar(
        "jayFilesBar",
        infra.macmini.hddPct
    );

    updateStorageBar(
        "jayCloudBar",
        infra.ubuntu.hddPct
    );
    
    document.getElementById(
        "jayFilesBar"
        ).style.width =
        infra.macmini.hddPct;

    document.getElementById(
        "jayCloudBar"
        ).style.width =
        infra.ubuntu.hddPct;

}

loadInfrastructure();
setInterval(
    loadInfrastructure,
    6000
);

const serviceUrls = {

    streamr:
        "https://streamr.vignesh-jay.xyz",

    files:
        "https://files.vignesh-jay.xyz",

    cloud:
        "https://cloud.vignesh-jay.xyz",

    docker:
        "https://portainer.vignesh-jay.xyz",

    nextcloud:
        "https://cloud.vignesh-jay.xyz",

    tunnel:
        "https://one.dash.cloudflare.com"
};

function openService(service){

    if(!serviceStatus[service]){

        alert(
            `${service.toUpperCase()} is currently offline`
        );

        return;
    }

    addLog(
        `OPENED ${service.toUpperCase()}`
    );

    window.open(
        serviceUrls[service],
        "_blank"
    );
}

function toggleNotifications(){

    const panel =
        document.getElementById(
            "notificationPanel"
        );

    panel.style.display =
        panel.style.display === "block"
        ? "none"
        : "block";
}

function generateAlerts(){

    const alerts = [];

    Object.keys(serviceStatus)
    .forEach(service=>{

        if(!serviceStatus[service]){

            alerts.push(
                `${service.toUpperCase()} Offline`
            );
            addLog(
                `${service.toUpperCase()} OFFLINE`
            );
        }
    });

    const alertList =
        document.getElementById(
            "alertList"
        );

    const alertCount =
        document.getElementById(
            "alertCount"
        );

    alertCount.innerText =
        alerts.length;

    if(alerts.length === 0){

        alertList.innerHTML =
            "<div class='alert-item'>All Systems Operational</div>";

        return;
    }

    alertList.innerHTML =
        alerts
        .map(alert =>
            `<div class="alert-item">${alert}</div>`
        )
        .join("");
}

const systemLogs = [];
addLog("JAY MATRIX STARTED");

function addLog(message){

    const timestamp =
        new Date()
        .toLocaleTimeString();

    systemLogs.unshift({
        timestamp,
        message
    });

    renderLogs();
}

function renderLogs(){

    const container =
        document.getElementById(
            "logsList"
        );

    if(!container) return;

    if(systemLogs.length === 0){

        container.innerHTML = `
            <div class="log-entry">
                No system events recorded
            </div>
        `;

        document.getElementById(
            "logCount"
        ).innerText = "0 Entries";

        return;
    }

    container.innerHTML =
        systemLogs
        .slice(0,50)
        .map(log => `

            <div class="log-entry">

                <span class="log-time">
                    ${log.timestamp}
                </span>

                ${log.message}

            </div>

        `)
        .join("");

    document.getElementById(
        "logCount"
    ).innerText =
        `${systemLogs.length} Entries`;
}

function refreshMatrix(){

    loadStatus();
    loadInfrastructure();

    addLog(
        "MANUAL REFRESH"
    );
}

function clearLogs(){

    systemLogs.length = 0;

    renderLogs();

    addLog(
        "LOG HISTORY CLEARED"
    );
}

function logoutMatrix(){

    addLog(
        "USER LOGGED OUT"
    );

    setTimeout(()=>{

        location.reload();

    },500);
}

function exportLogs(){

    const content =
        systemLogs
        .map(log =>
            `${log.timestamp} - ${log.message}`
        )
        .join("\n");

    const blob =
        new Blob(
            [content],
            {
                type:"text/plain"
            }
        );

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "jay-matrix-logs.txt";

    link.click();

    addLog(
        "LOG EXPORT GENERATED"
    );
}
