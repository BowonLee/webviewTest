module.exports = function (app) {
    // Serve apple-app-site-association with correct Content-Type
    app.get('/.well-known/apple-app-site-association', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.sendFile('apple-app-site-association', {
            root: __dirname + '/../public/.well-known'
        });
    });

    // Ensure assetlinks.json also has correct Content-Type
    app.get('/.well-known/assetlinks.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.sendFile('assetlinks.json', {
            root: __dirname + '/../public/.well-known'
        });
    });
};
