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

 