var crypto = require('crypto');

// Company info
// go to: https://app.klipfolio.com/settings/single_signon_edit
// to find your companyId and secretKey
// --------------------------------------------------------------
var companyId = ""; // Your Klipfolio Account ID
var sso = "";       // Your SSO Key
var email = "";      // User email in account

var params = {
  "email" : email
}

var salt = sso.concat(companyId);
var hash = crypto.createHash('sha1');
hash.update(salt);
let key = hash.digest().slice(0,16);

var iv = crypto.randomBytes(16);

var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);

var message_buff = new Buffer(JSON.stringify(params));
var data = Buffer.concat([iv, message_buff]);
//Cipher will automatically pad data
var encrypted_buff = cipher.update(data);

var sso_token = Buffer.concat([encrypted_buff, cipher.final()]).toString('base64');

console.log("Test this token: https://klipfolio.github.io/kfapp-custom-sso/index.html\n\n" +
                    "email = " + email + "\n" +
                    "token = " + sso_token + "\n" +
                    "company id = " + companyId);
