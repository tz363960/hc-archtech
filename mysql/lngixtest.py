import datetime
import re
from queue import Queue
import threading
from pathlib import Path
from user_agents import parse
from collections import defaultdict
 
 
# 正则，文件读取，时间窗口，队列，多线程，高阶函数，分发器，嵌套函数
 
logline = '''183.60.212.153 - - [19/Feb/2013:10:23:29 +0800] "GET /o2o/media.html?menu=3 HTTP/1.1" 200 16691 "-" "Mozilla/5.0 (compatible; EasouSpider; +http://www.easou.com/search/spider.html)"'''
 
pattern = '''(?P<remote_addr>[\d\.]{7,}) - - (?:\[(?P<datetime>[^\[\]]+)\]) "(?P<request>[^"]+)" (?P<status>\d+) (?P<size>\d+) "[^"]+" "(?P<useragent>[^"]+)"'''
 
# 数据源处理
ops = {
    'datetime': lambda timestr: datetime.datetime.strptime(timestr, "%d/%b/%Y:%H:%M:%S %z"),
    'request': lambda request: dict(zip(('method', 'url', 'protocol'), request.split())),
    'status': int,
    'size': int,
    'useragent': lambda useragent: parse(useragent)
}
 
regex = re.compile(pattern)
 
def extract(line):
    matcher = regex.match(line)
    if matcher:
        return {k: ops.get(k, lambda x: x)(v) for k, v in matcher.groupdict().items()}
 
 
def openfile(path:str):
    with open(path) as f:
        for line in f:
            fields = extract(line)
            if fields:
                yield fields  # return generator objects,next(load(path))
            else:
                # TODO 不合格数据有哪些
                continue  # TODO 解析失败就抛弃，或者打印日志
 
 
def load(*paths):
    '''装载日志文件或路径'''
    for item in paths:
        p = Path(item)
        if not p.exists():
            continue
 
        if p.is_dir():
            for file in p.iterdir():
                if file.is_file():
                    yield from openfile(str(file))
        elif p.is_file():
            yield from openfile(str(p))
 
 
def window(src:Queue, handler, width: int, interval: int):
    '''
    窗口函数
    :param src: 数据源，生成器，用来拿数据
    :param handler: 数据处理函数
    :param width: 时间窗口宽度，秒
    :param interval: 处理时间间隔，秒/ 时间偏移量，秒
    :return:
    '''
 
    start = datetime.datetime.strptime('1970/01/01 01:01:01 +0800', '%Y/%m/%d %H:%M:%S %z')
    current = datetime.datetime.strptime('1970/01/01 01:01:02 +0800', '%Y/%m/%d %H:%M:%S %z')
    delta = datetime.timedelta(seconds=width-interval)
 
    buffer = []  #窗口里的待计算数据
 
    while True:  #while True方式迭代queue
        # 从数据源获取数据
        data = src.get()   # block阻塞的
 
        if data:
            buffer.append(data)
            current = data['datetime']
 
        if (current - start).total_seconds() >= interval:
            ret = handler(buffer)      # 如何处理
            print("{}".format(ret))
 
            start = current
 
            buffer = [i for i in buffer if i['datetime'] > current - delta]
 
 
def donothing_handler(iterable:list):
    # print(iterable)
    return iterable
 
 
# 状态码时间段百分比分析
def status_handler(iterable:list):
    d = {}
    for item in iterable:
        key = item['status']
        if key not in d:
            d[key] = 0
        d[key] += 1
 
    total= sum(d.values())
    return {'{}: {:.2f}%'.format(k,v/total*100) for k,v in d.items()}
 
 
# 浏览器分析函数
ua_dict = defaultdict(lambda : 0)  # 作用域改为全局之后,字典递增保存所有ua及其版本
def browser_handler(iterable):
    for item in iterable:
        ua = item['useragent']
        key = (ua.browser.family, ua.browser.version_string)
        ua_dict[key] += 1
    return ua_dict
 
 
# 分发器,嵌套函数
def dispatcher(src):
    queues = []  # 队列列表
    threads = []  # 线程管理
 
    def reg(handler, width, interval):
        q = Queue()    # 分配队列
        queues.append(q)  # 方便调用
 
        t = threading.Thread(target=window,args=(q, handler, width, interval))
        threads.append(t)
 
 
 
    def run():
        for t in threads:
            t.start()
 
        for x in src:
            for q in queues:
                q.put(x)
 
    return reg,run
 
     
reg,run = dispatcher(load('test.log'))
 
# reg注册 窗口
# reg(donothing_handler, 10, 5)    #注册测试
# reg(status_handler, 10, 5)       # 注册状态码处理函数
reg(browser_handler, 60, 60)       # 注册useragent处理函数,注意时间窗口宽度
 
run()