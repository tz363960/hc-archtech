// Autodesk Forge configuration
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
    sqlconnection : {
        host: '47.110.84.253',
        user: 'hctech',
        password: 'hc123',
        database: 'zemenbank'
    },
    authIdAndSecret : {
        'cxn1': {
            "FORGE_ID": "chdugm33WTNMX9xeSAHWUZBHDJVlJkhS",
            "FORGE_SECRET": "GQCnwaqCncPs7fhj"
        },
        'cxn2': {
            "FORGE_ID": "oyMP7fHNIHXrGfdxnsSeJ9p7o1HlJz4m",
            "FORGE_SECRET": "nA8YA1KcR5OjkDrG"
        },
        'cxn3':{
            "FORGE_ID": "EAImUtWq2VNlA3VAA7ZBWYdJ2KLZksiU",
            "FORGE_SECRET": "zzXT3Ix7dt76Bprd",
        },
        'cxn4':{
            "FORGE_ID": "Qeul9eD5jp0ySqJrdDnvjEkqmrryZqPO",
            "FORGE_SECRET": "KOB1WypAjo6XO3mw",
        }
    }
}
