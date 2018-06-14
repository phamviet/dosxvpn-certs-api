const fs = require('fs');
const url = require('url');
const { send } = require('micro');

module.exports = (req, res) => {
  const urlParts = url.parse(req.url, true);
  const query = urlParts.query;
  
  let statusCode = 200;
  const data = {};

  if (!fs.existsSync('/etc/ipsec.d/cacerts/ca.cert.pem')) {
    data.error = 'CA certificate is not found';
    statusCode = 500;
  } else {
    if (query.pkcs12) {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment; filename="client.cert.p12"');
      send(res, statusCode, fs.createReadStream('/etc/ipsec.d/client.cert.p12'));
      return
    }
    
    Object.assign(data, {
      ca: fs.readFileSync('/etc/ipsec.d/cacerts/ca.cert.pem', 'utf8'),
      key: fs.readFileSync('/etc/ipsec.d/private/client.pem', 'utf8'),
      cert: fs.readFileSync('/etc/ipsec.d/certs/client.cert.pem', 'utf8'),
      password: fs.readFileSync('/etc/ipsec.d/client.cert.p12.password', 'utf8')
    });
  }

  send(res, statusCode, data)
}
