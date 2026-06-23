import json
import requests
from datetime import datetime

SERVICES = {
    "streamr": "https://streamr.vignesh-jay.xyz",
    "files": "https://files.vignesh-jay.xyz",
    "cloud": "https://cloud.vignesh-jay.xyz"
}

def check(url):
    try:
        response = requests.get(
            url,
            timeout=10
        )

        return response.status_code < 500

    except:
        return False


status = {
    "lastCheck":
        datetime.utcnow().strftime(
            "%Y-%m-%d %H:%M:%S UTC"
        )
}

for name, url in SERVICES.items():
    status[name] = check(url)

# Placeholder infrastructure status

status["docker"] = status["cloud"]
status["nextcloud"] = status["cloud"]
status["tunnel"] = status["cloud"]

with open(
    "data/status.json",
    "w"
) as f:

    json.dump(
        status,
        f,
        indent=4
    )

print("Status updated.")