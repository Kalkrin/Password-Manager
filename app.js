console.log('starting password manager');

//Getting node-persist into the application
var storage = require('node-persist');
var crypto = require('crypto-js');
var argv = require('yargs')
	.command('create', 'Create an account', function(yargs) {
		yargs.options({
			name: {
				demand: true,
				alias: 'n',
				description: 'Enter the name of the account you want to save',
				type: 'string'
			},
			username: {
				demand: true,
				alias: 'u',
				description: 'Enter the username to access the account you are saving',
				type: 'string'
			},
			password: {
				demand: true,
				alias: 'p',
				description: 'Enter the password of the account you want to save',
				type: 'string'
			},
			masterPassword: {
				demand: true,
				alias: 'm',
				description: 'Enter the password to access your accounts',
				type: 'string'
			}
		}).help('help');
	})
	.command('get', 'Get account information', function(yargs) {
		yargs.options({
			name: {
				demand: true,
				alias: 'n',
				description: 'Enter the name of the account you want retrieve',
				type: 'string'
			},
			masterPassword: {
				demand: true,
				alias: 'm',
				description: 'Enter the password to access your accounts',
				type: 'string'
			}
		}).help('help');
	})
	.help('help')
	.argv;
//Setting up computer to save
storage.initSync();

function getAccounts(masterPassword) {
	// use getItemSync to fetch accounts
	var encryptedAccount = storage.getItemSync('accounts');
	var accounts = [];
	//if accounts is undefined, create it
	if(typeof encryptedAccount !== 'undefined') {
		//decrypt
		var bytes = crypto.AES.decrypt(encryptedAccount, masterPassword);
		accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));	
	}
	//return accounts array
	return accounts;
}

function saveAccounts (accounts, masterPassword) {
	//ecrypt accounts
	var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword); 
	// setItemSync
	storage.setItemSync('accounts', encryptedAccounts.toString());
	//return accounts
	return accounts;
}

function createAccount(account, masterPassword) {
	var accounts = getAccounts(masterPassword);
	accounts.push(account);
	
	saveAccounts(accounts, masterPassword);

	return account;
}

function getAccount(accountName, masterPassword) {
	var accounts = getAccounts(masterPassword);
	var matchedAccount;

	//itterating over accounts, returning matching account, else undefined
	accounts.forEach(function(account) {
		if(account.name === accountName) {
			matchedAccount = account;
		}
	});

	return matchedAccount;
}

var command = argv._[0];

if(command === 'create'){
	try{
		var createdAccount = createAccount({
			name: argv.name,
			username: argv.username,
			password: argv.password
		}, argv.masterPassword);
		console.log('Account created!');
		console.log(createdAccount);
	} catch(e) {
		console.log('Unable to create new account');
	}
}
else if(command === 'get'){
	try {
		var fetchedAccount = getAccount(argv.name, argv.masterPassword);

		if(typeof fetchedAccount === 'undefined') {
			console.log('Account not found');
		} else {
			console.log('Account found!');
			console.log(fetchedAccount);
		}
	} catch(e) {
		console.log('Unable to fetch account');
	}
}
// //Creating an account
// createAccount({
// 	name: 'Facebook',
// 	username: 'someemail@gmail.com',
// 	password: 'facebookpass'
// });

// //Displaying an account
// var facebookAccount = getAccount('Facebook');
// console.log(facebookAccount);