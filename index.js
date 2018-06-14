const fs = require('fs');
const { send } = require('micro');

module.exports = (req, res) => {
  let statusCode = 200;
  const data = {};

  if (!fs.existsSync('/etc/ipsec.d/cacerts/ca.cert.pem')) {
    data.error = 'CA certificate is not found';
    statusCode = 500;
  } else {
    Object.assign(data, {
      ca: fs.readFileSync('/etc/ipsec.d/cacerts/ca.cert.pem', 'utf8'),
      key: fs.readFileSync('/etc/ipsec.d/private/client.pem', 'utf8'),
      cert: fs.readFileSync('/etc/ipsec.d/certs/client.cert.pem', 'utf8'),
      pkcs12: fs.readFileSync('/etc/ipsec.d/client.cert.p12', 'utf8'),
      password: fs.readFileSync('/etc/ipsec.d/client.cert.p12.password', 'utf8')
    });
  }

  send(res, statusCode, data)
}
