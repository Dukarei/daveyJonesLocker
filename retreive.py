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
        print("\nIncoming:")
        for item in incoming:
            #print(str(item) + "\n")
            print("\nvalue: " + str(item['value']))
            incomingVals.append(item['value'])   
        print("\nIncomingVals:")
        for item in incomingVals:
            print("\nvalue: " + str(item))
        received = inter['received']
        print("\nReceived:")
        for item in received:
            #print(str(item) + "\n")
            print("\nvalue: " + str(item['value']))
            receivedVals.append(item['value'])   
        for item in receivedVals:
            print("\nvalue: " + str(item))
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")

if __name__ == '__main__' :
    getUpdates();
