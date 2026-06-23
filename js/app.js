const PIN = "1515";

let currentPin = "";

let serviceStatus = {};

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

                document
                .getElementById(
                    "dashboard"
                )
                .style.display =
                "flex";

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
    30000
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

    event.currentTarget.classList.add(
        "active"
    );
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
}

loadInfrastructure();
setInterval(
    loadStatus,
    30000
);