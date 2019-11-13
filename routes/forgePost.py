# -*- coding:utf-8 -*-
"""
by:cxn
"""

import requests, os, re, json, base64, time, datetime
import pymysql
import pandas as pd
import numpy as np


class getToken:
    def __init__(self, bucketName, file_upload):
        self.bucketName = bucketName
        self.file_upload = file_upload

    # 第一步用账号密码连接,获取token
    @staticmethod
    def get_token():
        url = 'https://developer.api.autodesk.com/authentication/v1/authenticate'
        mData = {'client_id': 'EAImUtWq2VNlA3VAA7ZBWYdJ2KLZksiU',
                 'client_secret': 'zzXT3Ix7dt76Bprd', 'grant_type': 'client_credentials'
            , 'scope': 'data:read viewables:read bucket:read bucket:create data:write'}
        header0 = {'Content-Type': 'application/x-www-form-urlencoded'}
        response0 = requests.post(url, headers=header0, data=mData)
        return response0

    # 传入bucketName
    def post_bucket_name(self, token_number):
        tempToken = re.findall('"(.*?)"', token_number)  # response0.text
        url1 = 'https://developer.api.autodesk.com/oss/v2/buckets'
        autho = tempToken[3] + ' ' + tempToken[1]  # 有Bearer的token
        header = {'Authorization': autho, 'Content-Type': 'application/json'}  # 好几个用的是这个header
        mData1 = {'bucketKey': self.bucketName, 'policyKey': 'transient'}
        requests.post(url1, headers=header, data=json.dumps(mData1))
        return autho, mData1, tempToken  # 传出autho

    # 检查是否在云端建立了bucketName
    def _check_bucket_name(self, autho, mData1):
        header = {'Authorization': autho, 'Content-Type': 'application/json'}  # 好几个用的是这个header
        url2 = 'https://developer.api.autodesk.com/oss/v2/buckets/' + self.bucketName + '/details'  # 与第二步的headers和data一样
        responsed2 = requests.get(url2, headers=header, data=json.dumps(mData1))
        return responsed2

    # 传文件
    def upload_file(self, autho):
        header3 = {'Authorization': autho, 'Content-Type': 'application/octet-stream',
                   'Content-Length': str(os.path.getsize(self.file_upload))}
        url3 = 'https://developer.api.autodesk.com/oss/v2/buckets/' + self.bucketName + '/objects/' + self.file_upload
        with open(self.file_upload, mode='rb') as fo:
            sn = fo.read(os.path.getsize(self.file_upload))
            fw = open(self.file_upload, "wb")
            fw.write(sn)  # fw的这些操作就是因为读filename3时文件大小会出现问题，重新写一次二进制
            fw.close()
            fw = open(self.file_upload, "rb")
            response3 = requests.put(url3, headers=header3, data=fw)
            fw.close()
            return response3

    # 用于解urn码,并发起转换
    def do_urn(self, autho, urn_number):
        header = {'Authorization': autho, 'Content-Type': 'application/json'}  # 好几个用的是这个header
        tempUrn = re.findall('"(.*?)"', urn_number)  # 用于解码,传文件的response3.text
        urnEncode = base64.b64encode(tempUrn[3].encode('utf-8'))
        urnEncodeEnd = str(urnEncode, 'utf-8').replace("=", "")
        mData4 = {"input": {"urn": urnEncodeEnd}, "output": {"formats": [{"type": "svf", "views": ["2d", "3d"]}]}}
        url4 = 'https://developer.api.autodesk.com/modelderivative/v2/designdata/job'
        response4 = requests.post(url4, headers=header, data=json.dumps(mData4))
        return response4, urnEncodeEnd

    # 检查模型是否传完,如果报401，则是token问题
    def _check_model_uploaded(self, autho, urnEncodeEnd):
        header5 = {'Authorization': autho}
        url5 = 'https://developer.api.autodesk.com/modelderivative/v2/designdata/' + urnEncodeEnd + '/manifest'
        response5 = requests.get(url5, headers=header5)
        return response5

    # 检查是否有文件
    def check_file_uploaded(self, autho):
        header = {'Authorization': autho, 'Content-Type': 'application/json'}  # 好几个用的是这个header
        urnDecode = 'urn:adsk.objects:os.object:' + self.bucketName + '/' + self.file_upload
        urnEncode = base64.b64encode(urnDecode.encode('utf-8'))
        urnEncodeEnd = str(urnEncode, 'utf-8').replace("=", "")
        mData4 = {"input": {"urn": urnEncodeEnd}, "output": {"formats": [{"type": "svf", "views": ["2d", "3d"]}]}}
        url4 = 'https://developer.api.autodesk.com/modelderivative/v2/designdata/job'
        response = requests.post(url4, headers=header, data=json.dumps(mData4))
        return response, response.status_code, urnEncodeEnd

    
    # 对原有html网页文件进行修改
    def _change_html_file(self, tempToken, urnEncodeEnd):
        dir_road = "./"
        for root, dirs, files in os.walk(dir_road):
            for file in files:
                if file == 'hahahaha':
                    with open(os.path.join(root, file), encoding='utf-8', mode='r+') as Html_file:
                        htmlHandle = Html_file.read()
                        assesTokenPatten = re.compile(r'var accessToken =.*')
                        assesTokenReplace = "var accessToken = '" + tempToken[1] + "';"  # tempToken[1]是字符串，token
                        htmlHandle = re.sub(assesTokenPatten, assesTokenReplace, htmlHandle)
                        assesDocumentIdPatten = re.compile(r'var documentId =.*')
                        assesDocumentIdReplace = "var documentId = 'urn:" + urnEncodeEnd + "';"  # urnEncodeEnd是最终值
                        assesDocumentIdOut = re.sub(assesDocumentIdPatten, assesDocumentIdReplace,
                                                    htmlHandle)  # 最终替换完成的str

                    with open(os.path.join(root, file), encoding='utf-8', mode='w+') as newHtml:
                        newHtml.write(assesDocumentIdOut)


fileRead = 'access.txt'
with open(fileRead, 'r') as load_file:
    tempFile = load_file.read()
    ipPattern = re.compile(r'\d+\.\d+\.\d+\.\d+(?=\s-)')
    allIps = ipPattern.findall(tempFile)
    NotRepetitionIp = []
    NotRepetitionIpAddress = []
    for ip in allIps:
        if ip not in NotRepetitionIp:
            NotRepetitionIp.append(ip)
    try:
        for ip in NotRepetitionIp:
            head = {
                "User-Agent": random.choice(USER_AGENTS),
                "Referer": "http://www.cip.cc/" + ip,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                'Connection': 'keep-alive'
            }
            tempHtml = requests.get('http://www.cip.cc/' + ip, headers=head, timeout=50).text
            addressCompile = '(?<=' + ip + ').*?(?=数据三)'
            htmlResult = re.findall(addressCompile, tempHtml, re.S)[0]
            htmlResult = htmlResult.replace('\r', '').replace('\n', '').replace('\t', '')
            NotRepetitionIpAddress.append(htmlResult)
    except Exception as e:
        print(e)