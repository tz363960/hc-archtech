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
const config = require('../config');

const { getPublicToken } = require('./common/oauth');

let router = express.Router();
var userCookiesName;
var authIdAndSecret = config.authIdAndSecret;

// GET /api/forge/oauth/token - generates a public access token (required by the Forge viewer).
router.get('/token', async (req, res, next) => {
    try {
        userCookiesName = req.cookies.separateName;
        var client_id = authIdAndSecret[userCookiesName].FORGE_ID;
        var client_secret = authIdAndSecret[userCookiesName].FORGE_SECRET;
        const token = await getPublicToken(client_id,client_secret);
        res.json({
            access_token: token.access_token,
            expires_in: token.expires_in
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
