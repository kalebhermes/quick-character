let creds = {};

if(process.env.NODE_ENV === 'development'){
	creds.username = 'root';
	creds.password = '';
} else if(process.env.NODE_ENV === 'production'){
	creds.username = 'root';
	creds.password = 'password';
}

module.exports = creds;