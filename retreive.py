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
        print('\nIncoming: ')
        for item in incoming:
            incomingVals.append(item['value'])
            print('\n' + str(item['value']))
        received = inter['received']
        print('\nReceived: ')
        for item in received:
            receivedVals.append(item['value'])   
            print('\n' + str(item['value']))
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")

def postUpdates(received):
    url = 'http://localhost:8080/boxUpdate'
    myobj = {'email': 'b@c.c', 'pass': 'ass', 'received':received}
    try:
        x = requests.post(url, json = myobj)
        x.raise_for_status() #should throw an exception depending on status code returned by POST
        print("text: " + x.text)
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")

if __name__ == '__main__' :
   #postUpdates([1223,4455,4665])
   getUpdates()
