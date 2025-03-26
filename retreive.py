import requests

def getUpdates():
    url = 'http://localhost:8080/boxInfo'
    myobj = {'email': 'b@c.c', 'pass': 'ass'}
    try:
        x = requests.get(url, json = myobj)
        x.raise_for_status() #should throw an exception depending on status code returned by POST
        #print("text: " + x.text)
        inter = x.json()
        incomingVals = []
        receivedVals = []
        incoming = inter['incoming']
        for item in incoming:
            incomingVals.append(item['value'])   
        received = inter['received']
        for item in received:
            receivedVals.append(item['value'])   
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")

if __name__ == '__main__' :
    getUpdates();
