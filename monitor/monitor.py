import requests
import json

SERVICES = {

    "streamr":
        "https://streamr.vignesh-jay.xyz",

    "files":
        "https://files.vignesh-jay.xyz",

    "cloud":
        "https://cloud.vignesh-jay.xyz"
}

from datetime import datetime

status = {

    "lastCheck":
        datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )
}

for name, url in SERVICES.items():

    try:

        response = requests.get(
            url,
            timeout=10
        )

        status[name] = (
            response.status_code == 200
        )

    except:

        status[name] = False


# Placeholder values for now

status["docker"] = True
status["nextcloud"] = True
status["tunnel"] = True


with open(
    "../data/status.json",
    "w"
) as file:

    json.dump(
        status,
        file,
        indent=4
    )

print(
    "Status updated successfully."
)