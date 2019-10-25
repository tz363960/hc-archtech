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

const { AuthClientTwoLegged } = require('forge-apis');
const cookieParse = require('cookie-parser');
const express = require('express');

const config = require('../../config');


/**
 * Initializes a Forge client for 2-legged authentication.
 * @param {string[]} scopes List of resource access scopes.
 * @returns {AuthClientTwoLegged} 2-legged authentication client.
 */
function getClient(client_id,client_secret,scopes) {
    // var client_id = authIdAndSecret[userCookiesName].FORGE_ID;
    // var client_secret = authIdAndSecret[userCookiesName].FORGE_SECRET;
    // const { client_id, client_secret } = config.credentials;
    return new AuthClientTwoLegged(client_id, client_secret, scopes || config.scopes.internal);
}

let cache = {};
async function getToken(client_id,client_secret,scopes) {
    const key = scopes.join('+');
    if (cache[key]) {
        return cache[key];
    }
    
    const client = getClient(client_id,client_secret,scopes);
    let credentials = await client.authenticate();
    cache[key] = credentials;
    setTimeout(() => { delete cache[key]; }, credentials.expires_in * 1000);
    return credentials;
}

/**
 * Retrieves a 2-legged authentication token for preconfigured public scopes.
 * @returns Token object: { "access_token": "...", "expires_at": "...", "expires_in": "...", "token_type": "..." }.
 */
async function getPublicToken(client_id, client_secret) {
    return getToken(client_id,client_secret,config.scopes.public);
}

/**
 * Retrieves a 2-legged authentication token for preconfigured internal scopes.
 * @returns Token object: { "access_token": "...", "expires_at": "...", "expires_in": "...", "token_type": "..." }.
 */
async function getInternalToken(client_id, client_secret) {
    return getToken(client_id, client_secret, config.scopes.internal);
}

module.exports = {
    getClient,
    getPublicToken,
    getInternalToken
};
