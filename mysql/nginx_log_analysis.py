
from datetime import datetime
import re
import numpy as np
import pandas as pd
 
filePath = "F:\\Vue\\access.log"
filePath_ = "F:\\Vue\\access_.log"
localIP = ['115.197.108.74','115.220.139.48','101.67.152.141', '61.151.178.176', '223.167.152.20','58.246.221.163',
'180.163.220.66','47.101.162.42','122.112.248.184','220.191.124.199','112.17.125.181','115.220.136.172','183.192.91.30',
'115.193.130.101','47.110.84.253','36.27.50.122','115.216.31.121','115.220.139.55','125.118.217.254','115.196.90.187']

def clearData(path_file):
    for i in range(0, len(localIP)):
        with open(path_file, "r", encoding='utf-8') as f:
            lines = f.readlines()

        with open(path_file, "w+", encoding='utf-8') as f_w:
            for line in lines:
                if localIP[i] in line:
                    continue
                f_w.write(line)

 
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
 
if __name__ == '__main__':
    clearData(filePath)
    with open(filePath, "r", encoding='utf-8') as f1:
        for line in f1:
            try:
                log_pro = extract(line)
            except:
                pass

            # log_df = pd.DataFrame.from_dict(log_pro)
            # print(log_df)
            print(log_pro['remote_addr'],log_pro['datetime'],log_pro['status'],log_pro['user_agent'],log_pro['size'])

