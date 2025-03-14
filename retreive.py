import requests

url = 'localhost:8080/boxInfo'
myobj = {'email': 'b@c.c', 'pass': 'ass'}
x = requests.post(url, json = myobj)

print(x.text)
