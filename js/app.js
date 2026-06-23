const PIN = "1515";

let currentPin = "";

const serviceStatus = {

    streamr: true,
    files: true,
    cloud: true,

    docker: true,
    nextcloud: true,
    tunnel: true

};

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
        Object.keys(serviceStatus).length;

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

    document.getElementById(
        "onlineServices"
    ).innerText = online;

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

checkAllServices();

updateSystemCore();

setInterval(
    checkAllServices,
    60000
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