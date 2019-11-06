
from datetime import datetime
import re
import geoip2.database
import numpy as np
import pandas as pd
 
filePath = "F:\\Vue\\access.log"
# delete the pool of ips
localIP = ['115.196.94.158','58.152.47.116','124.131.8.91','115.197.108.74','115.220.139.48','101.67.152.141', '61.151.178.176', '223.167.152.20','58.246.221.163',
'180.163.220.66','47.101.162.42','122.112.248.184','220.191.124.199','112.17.125.181','115.220.136.172','183.192.91.30',
'115.193.130.101','47.110.84.253','36.27.50.122','115.216.31.121','59.56.62.34','122.233.186.179','115.220.139.55','125.118.217.254','115.196.90.187']

# rewrite the access.log in order to ignore the safe ips 
def clearData(path_file):
    for i in range(0, len(localIP)):
        with open(path_file, "r", encoding='utf-8') as f:
            lines = f.readlines()

        with open(path_file, "w+", encoding='utf-8') as f_w:
            for line in lines:
                if localIP[i] in line:
                    continue
                f_w.write(line)

# clear the data in rewroten file
def extract(line):
    pattern = '''(?P<remote_addr>[\d\.]{7,}) - - (?:\[(?P<datetime>[^\[\]]+)\]) "(?P<request>[^"]+)" (?P<status>\d+) (?P<size>\d+) "[^"]+" "(?P<user_agent>[^"]+)"'''
    regex = re.compile(pattern)
    matcher = regex.match(line)
    if matcher:
        return {k: ops.get(k, lambda x: x)(v) for k, v in matcher.groupdict().items()}
    else:
        raise Exception('No match')
 
 
ops = {
    'datetime': lambda timestr: datetime.strptime(timestr, "%d/%b/%Y:%H:%M:%S %z"),
    'request': lambda request: dict(zip(('method', 'url', 'protocol'), request.split())),
    'status': int,
    'size': int
}

def ip_city(ip):
    c= reader.city(ip)
    c1 = c.city
    return c1
 
if __name__ == '__main__':
    clearData(filePath)
    reader = geoip2.database.Reader('F:\Vue\GeoLite2-Country_20191029\GeoLite2-City.mmdb')
    # create a dataframe to store the filtered data
    log_df =pd.DataFrame(columns=('ip','city','datetime','status','user_agent','size'))
    with open(filePath, "r", encoding='utf-8') as f1:
        for line in f1:
            try:
                log_pro = extract(line)

            except:
                pass

            trans_city = reader.city(log_pro['remote_addr']).names['en']
                
           # _city = ip_city(log_pro['remote_addr']).names['en']
            log_df = log_df.append(pd.DataFrame({'ip': [log_pro['remote_addr']],'city':['trans_city'],'datetime': [log_pro['datetime']],'status': [log_pro['status']],'user_agent': [log_pro['user_agent']],'size': [log_pro['size']]}))

            # print(log_df)
            # print(log_pro['remote_addr'],log_pro['datetime'],log_pro['status'],log_pro['user_agent'],log_pro['size'])
    
    print(log_df.head())

