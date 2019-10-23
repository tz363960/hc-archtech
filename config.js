// Autodesk Forge configuration
var ForgeAll = {
    FORGE_CLIENT_ID: '',
    FORGE_CLIENT_SECRET: ''
}

module.exports = {
    // Set environment variables or hard-code here
    credentials: {
        client_id: process.env.FORGE_CLIENT_ID,
        client_secret: process.env.FORGE_CLIENT_SECRET,
        callback_url: process.env.FORGE_CALLBACK_URL
    },
    scopes: {
        // Required scopes for the server-side application
        internal: ['bucket:create', 'bucket:read', 'data:read', 'data:create', 'data:write'],
        // Required scope for the client-side viewer
        public: ['viewables:read']
    },
    sqlconnection: {
        host: 'localhost',
        user: 'hctech',
        password: 'hc123',
        database: 'zemenbank'
    }
};

function chooseClientId(username) {
    switch (username) {
        case 'cxn2':
            ForgeAll.FORGE_CLIENT_ID = "oyMP7fHNIHXrGfdxnsSeJ9p7o1HlJz4m";
            ForgeAll.FORGE_CLIENT_SECRET = "nA8YA1KcR5OjkDrG";
            break;
        case 'cxn1':
            ForgeAll.FORGE_CLIENT_ID = "EAImUtWq2VNlA3VAA7ZBWYdJ2KLZksiU";
            ForgeAll.FORGE_CLIENT_SECRET = "zzXT3Ix7dt76Bprd";
            break;
    }
}
