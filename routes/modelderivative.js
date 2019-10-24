/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

const express = require('express');
const cookieParse = require('cookie-parser');
const {
    DerivativesApi,
    JobPayload,
    JobPayloadInput,
    JobPayloadOutput,
    JobSvfOutputPayload
} = require('forge-apis');
let app=express();
app.use(cookieParse());

app.use(function (req, res, next) {
    var userCookies = req.cookies.ift;
    console.log(userCookies);
    next();
})

var CLIENT_ID = process.env.FORGE_CLIENT_ID,
    CLIENT_SECRET = process.env.FORGE_CLIENT_SECRET;

var ForgeSDK = require('../node_modules/forge-apis/src/index');

const {
    getClient,
    getInternalToken
} = require('./common/oauth');

let router = express.Router();

//两条腿认证
var oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(CLIENT_ID, CLIENT_SECRET,
    ['data:write', 'data:read', 'bucket:read', 'bucket:update', 'bucket:create', 'bucket:delete'], true);

//删除Bucket和object分别调用的API
var bucketsApi = new ForgeSDK.BucketsApi(), // Buckets Client
    objectsApi = new ForgeSDK.ObjectsApi(); // Objects Client

//Middleware for obtaining a token for each request.
router.use(async (req, res, next) => {
    const token = await getInternalToken();
    req.oauth_token = token;
    req.oauth_client = getClient();
    next();
});

// POST /api/forge/modelderivative/jobs - submits a new translation job for given object URN.
// Request body must be a valid JSON in the form of { "objectName": "<translated-object-urn>" }.
router.post('/jobs', async (req, res, next) => {
    let job = new JobPayload();
    job.input = new JobPayloadInput();
    job.input.urn = req.body.objectName;
    job.output = new JobPayloadOutput([
        new JobSvfOutputPayload()
    ]);
    job.output.formats[0].type = 'svf';
    job.output.formats[0].views = ['2d', '3d'];
    try {
        // Submit a translation job using [DerivativesApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/DerivativesApi.md#translate).
        await new DerivativesApi().translate(job, {}, req.oauth_client, req.oauth_token);
        res.status(200).end();
    } catch (err) {
        next(err);
    }
});

/**
 * 刪除Object.
 * 两条腿认证.
 * @param bucketKey
 * @param fileName
 */
router.post('/jobs/deleteobject',  (req, res, next) => {
    bucketKey = req.body.bucketKey;
    RealObjectName = req.body.fileRealName;
    console.log('bucket:' + bucketKey);
    console.log('fileName:' + RealObjectName);
    var deleteFile = function(bucketKey, RealObjectName) {
        console.log("**** Deleting file from bucket:" + bucketKey + ", filename:"+RealObjectName);
        return objectsApi.deleteObject(bucketKey,RealObjectName,oAuth2TwoLegged, oAuth2TwoLegged.getCredentials());
    };
    try {
        oAuth2TwoLegged.authenticate().then(function(credentials){
            console.log("**** 獲取 Credentials",credentials);
            
            deleteFile(bucketKey, RealObjectName).then(function(deleteRes) {
                console.log("**** 返回200就对了:", deleteRes.statusCode);
            },defaultHandleError);
        }, defaultHandleError);
        res.status(200).end();

    } catch (err) {
        next(err);
    }
});

/**
 * 刪除Bucket.
 * 两条腿认证.
 * @param bucketKey
 */
router.post('/jobs/deletebucket',  (req, res, next) => {
    bucketKey = req.body.bucketKey;
    console.log('bucket:' + bucketKey);
    //调用API 删除Bucket
    var deleteBucket = function(bucketKey) {
        console.log("**** 删除bucket:" + bucketKey);
        return bucketsApi.deleteBucket(bucketKey,oAuth2TwoLegged, oAuth2TwoLegged.getCredentials());
    };

    try {
        oAuth2TwoLegged.authenticate().then(function(credentials){
            console.log("**** 獲取 Credentials",credentials);
            deleteBucket(bucketKey).then(function(deleteRes) {
                console.log("**** 返回200就对了:", deleteRes.statusCode);
            },defaultHandleError);
        }, defaultHandleError);
        res.status(200).end();
    } catch (err) {
        next(err);
    }
});

/////////////////////////////////////////错误提示///////////////////////////////////////////////////////
function defaultHandleError(err) {
    console.error('\x1b[31m Error:', err, '\x1b[0m');
}

/////////////////////////////////////获取所有Buckets////////////////////////////////////////////////////
var getBuckets = function () {
    console.log("**** Getting all buckets");
    return bucketsApi.getBuckets({}, oAuth2TwoLegged, oAuth2TwoLegged.getCredentials());
};

module.exports = router;