
from datetime import datetime
import re
 
filePath = "F:\\Vue\\access.log"
filePath_ = "F:\\Vue\\access_.log"
localIP = ['115.197.108.74','115.220.139.48','101.67.152.141']
localIPi = "115.197.108.74"
def clearData(path_file,path_file_):
    for i in range(0, len(localIP)):
        with open(path_file, "r", encoding='utf-8') as f:
            lines = f.readlines()

        with open(path_file_, "w+", encoding='utf-8') as f_w:
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
    clearData(filePath,filePath_)
    with open(filePath_, "r", encoding='utf-8') as f1:
        for line in f1:
            try:
                log_pro = extract(line)
            except:
                pass
            print(log_pro)
