import urllib, urllib.request, sys
#免费版本每秒可调用1次。本地5千万条IP，如果取不到会实时按顺序从淘宝、京东、百度、腾讯等大站依次抓取IP归属地，是很全的IP地址库。
#免费条数 1000。所以还是慎重使用！！！
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
content = response.read().decode('utf-8')
if (content):
    print(content)