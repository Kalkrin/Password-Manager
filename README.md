# Password-Manager
Node.js script to store login information for accounts, passwords are stored encrypted

To run this program you have to have node.js installed. 

Enter the terminal for your machine, change the directory to Password-Manager and enter "node app.js".

This program has different flags to use to store password information. below are some sample commands

<pre>
<b>To see the commands you can run</b>
node app.js --help

<b>Creating an account</b>

<b>Getting help with the create command</b>
node app.js create --help

<b>Storing account credentials</b>
node app.js create -n Facebook -u email@email.com -p fbpass -m masterpass

<b>Example of stored information</b>
"U2FsdGVkX1/N3oGomr5lOmYLbOsI3AFDuM+HVwUw5g3VgcB/5k+p25QuKS1n08HpD0yUjtJTAmS8giWA2qIjdj6Thj3u0gtxsGN3pKSihgl9Q0XT0xS4yaGFEiXoOGvn"

<b>Getting account credentials</b>

<b>Getting help with the get command</b>
node app.js get --help

<b>Getting the credentials for an account</b>
node app.js get -n Facebook -m masterpass

<b>Example retrieved information</b>
starting password manager
Account found!
{ name: 'Facebook',
  username: 'email@email.com',
  password: 'fbpass' }
</pre>
When used for the first time, you assign the master password when create your first account. For every time you create or get an account after that, you must use the same master password
