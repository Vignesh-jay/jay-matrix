import json

infra = {
    "macmini": {
        "ssd": "35%",
        "hdd": "88%",
        "ram": "4.3 GB / 8 GB",
        "uptime": "12 Days"
    },
    "ubuntu": {
        "ssd": "14%",
        "hdd": "21%",
        "ram": "500 MB / 16 GB",
        "uptime": "25 Days"
    }
}

with open("data/infra.json", "w") as f:
    json.dump(infra, f, indent=4)