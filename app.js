console.log('starting password manager');

//Accessing the persist module
var storage = require('node-persist');
//Accessing the crypto-js module
var crypto = require('crypto-js');
//Accessing the yargs module and assigning options for the commands
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
//Setting up computer to save account information
storage.initSync();

//Getting accounts from the accounts file in the persist folder
function getAccounts(masterPassword) {
	//Grabbing the accounts 
	var encryptedAccount = storage.getItemSync('accounts');
	//Creating an accounts array so an array is returned regardless of whether there is data
	var accounts = [];
	//If there is data in the accounts file, decrpt it and assign it to the accounts array
	if(typeof encryptedAccount !== 'undefined') {
		//decrypt
		var bytes = crypto.AES.decrypt(encryptedAccount, masterPassword);
		accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));	
	}
	//return accounts array
	return accounts;
}

//Saving the accounts array to the accounts file with any new account added to it
function saveAccounts (accounts, masterPassword) {
	//Encrypting the accounts array
	var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword); 
	//Saving the accounts array to the accounts file
	storage.setItemSync('accounts', encryptedAccounts.toString());
	//return accounts
	return accounts;
}

//Pushing new account credentials and saving the array to the file
function createAccount(account, masterPassword) {
	var accounts = getAccounts(masterPassword);

	accounts.push(account);
	
	saveAccounts(accounts, masterPassword);

	return account;
}

//Taking the inputed account name and masterpassword and looking for a match in the accounts file
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
//Getting the user input
var command = argv._[0];

//Creating an account object and saving it with the createAccount function
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

//If an account is found, displaying it
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
