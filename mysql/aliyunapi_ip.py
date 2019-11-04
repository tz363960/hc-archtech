import urllib, urllib.request, sys

host = 'http://saip.market.alicloudapi.com'
path = '/ip'
method = 'GET'
appcode = '9e9d655fd35c46398b7bbc6d8b1964d7'
querys = 'ip=223.5.5.5'
bodys = {}
url = host + path + '?' + querys

request = urllib.request.Request(url)
request.add_header('Authorization', 'APPCODE ' + appcode)
response = urllib.request.urlopen(request)
content = response.read()
if (content):
    print(content)