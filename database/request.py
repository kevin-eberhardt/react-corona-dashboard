from datetime import datetime
import requests


rki_api = "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=cases,deaths,BL,county,last_update,cases7_per_100k,recovered&outSR=4326&f=json"
data = requests.get(rki_api).json()
items = data["features"]
dataObjects = []
for item in items:
    object = {
        "state": '',
        "county": '',
        "date": today,
        "cases": 0,
        "deaths": 0,
        "incidence": 0,
        "recovered": 0
    }
    print(item["attributes"]["BL"])
today = datetime.now()
todaySTR = today.strftime("%d/%m/%Y %H:%M:%S")
print(today)
r = requests.get(rki_api)
print(r)
data_object = {
    "state": '',
    "county": '',
    "date": today,
    "cases": 0,
    "deaths": 0,
    "incidence": 0,
    "recovered": 0
}
data_objects = []
