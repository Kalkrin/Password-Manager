var crypto = require('crypto-js');

var secretMessage = {
	name: 'Craig',
	secretName: '007'
};

var messageString = JSON.stringify(secretMessage);

var secretKey = '123abc';

//Encrypt
var encryptedMessage = crypto.AES.encrypt(messageString, secretKey);

console.log('Encrypted Message: ' + encryptedMessage);

//Decrypt
var bytes = crypto.AES.decrypt(encryptedMessage, secretKey);
console.log('encrypted message bytes: ' + bytes);

var decryptedMessage = bytes.toString(crypto.enc.Utf8);

secretMessage = JSON.parse(decryptedMessage);

console.log('Decrypted message: ' + secretMessage.secretName);