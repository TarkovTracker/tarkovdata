const https = require('https');
const fs = require('fs');
const path = require('path');

const existingData = require('./items.en.json');

const data = JSON.stringify({
    query: `{
        itemsByType(type: any){
            id
            name
            shortName
        }
    }`,
});

const options = {
    hostname: 'api.tarkov.dev',
    port: 443,
    path: '/graphql',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    },
};

const req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    let responseData = '';

    res.on('data', (chunk) => {
        responseData = `${responseData}${chunk}`;
    });

    res.on('end', () => {
        const updatedData = {};
        const ttData = JSON.parse(responseData);

        // Update all existing items
        for(const itemId in existingData){
            updatedData[itemId] = ttData.data.itemsByType.find(item => item.id === itemId);
        }

        // Add any potential new items
        for(const item of ttData.data.itemsByType){
            if(updatedData[item.id]){
                continue;
            }

            updatedData[item.id] = item;
        }

        fs.writeFileSync(path.join(__dirname, 'items.en.json'), JSON.stringify(updatedData, null, 4));
    });
});

req.on('error', (e) => {
    console.error(e);
});

req.write(data);
req.end();