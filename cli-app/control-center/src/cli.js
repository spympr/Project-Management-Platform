import { sign } from 'crypto';

const program = require('commander');
const axios = require('axios');
const https = require('https');
const fs = require('fs');

const apiUrl = 'http://127.0.0.1:3000/api-control';
const agent = new https.Agent({
  rejectUnauthorized: false,
});


export function cli(args) {

  program
  .command('users')
  .action(function (command) {
    axios.get(`${apiUrl}/users/`)
    .then(function(response) {
      console.log(response.data);
    })
    .catch(function(error) {
      console.log(error);
    })
  });

  program
  .command('projects')
  .action(function (command) {
    axios.get(`${apiUrl}/projects/`)
	.then(function(response) {
	  console.log(response.data);
	})
	.catch(function(error) {
  	  console.log(error);
	})
  });

  program
  .command('sprints')
  .action(function (command) {
    axios.get(`${apiUrl}/sprints/`)
	.then(function(response) {
	  console.log(response.data);
	})
	.catch(function(error) {
	  console.log(error);
	})
  });

  program
  .command('tasks')
  .action(function (command) {
	axios.get(`${apiUrl}/tasks/`)
	.then(function(response) {
	  console.log(response.data);
	})
	.catch(function(error) {
	  console.log(error);
	})
  });

  program
  .command('user-stories')
  .action(function (command) {
	axios.get(`${apiUrl}/user_stories/`)
	.then(function(response) {
	  console.log(response.data);
	})
	.catch(function(error) {
	  console.log(error);
	})
  });

  program
  .command('health-check')
  .option('--format <value>', 'Give format', 'json')
  .action(function (command) {
	axios.get(`${apiUrl}/health-check?format=${command.format}`, { httpsAgent: agent })
	.then(function (response) {
	  // handle success
	  console.log(response.data);
	})
	.catch(function (error) {
	  // handle error
	  console.log('{ status: \'error\' }');
	})
  });

  program
  .command('logout')
  .action(function (command) {
	fs.unlink('/tmp/user.json', function(err) {
	  if(err) {
		return console.log('Removing token failed:', err);
	  }
	  console.log('Logout successful. Token removed');
	});
  });

  program
  .command('login')
  .option('--format <value>', 'Give format', 'json')
  .requiredOption('--username <value>', 'User\'s username')
  .requiredOption('--password <value>', 'User\'s password')
  .action(function (command) {
	axios.post(`${apiUrl}/users/login?format=${command.format}`, {
	  username: command.username,
	  password: command.password
	}, { httpsAgent: agent })
	.then(function (response) {
	  console.log(response.data);
	  fs.writeFile('/tmp/user.json', JSON.stringify(response.data), function(err) {
		if(err) {
		  return console.log('Writing token failed:', err);
		}
		console.log('Login successful. Token saved');
	  });
	})
	.catch(function (error) {
	  console.log('Login failed: ', error.response.data.message);
	});
  });

  program
  .command('signup')
  .option('--format <value>', 'Give format', 'json')
  .requiredOption('--username <value>', 'User\'s username')
  .requiredOption('--password <value>', 'User\'s password')
  .requiredOption('--firstName <value>', 'User\'s first name')
  .requiredOption('--lastName <value>', 'User\'s last name')
  .requiredOption('--email <value>', 'User\'s email')
  .option('--plan <value>', 'User\'s plan (standard or premium)')
//  .option('--picture <value>', 'User\'s profile picture (url)')
  .action(function(command) {
	axios.post(`${apiUrl}/users/signup?format=${command.format}/`, {
		username: command.username,
		password: command.password,
		firstName: command.firstName,
		lastName: command.lastName,
		email: command.email,
		plan: command.plan
	}, { httpsAgent: agent })
	.then(function (response) {
	  console.log(response.data);
	  fs.writeFile('/tmp/user.json', JSON.stringify(response.data), function(err) {
		if(err) {
		  return console.log('Writing token failed:', err);
	    }
	    console.log('Login successful. Token saved');
	  });
	})
	.catch(function (error) {
	  console.log('Sign up failed');
	});
  });

  program
  .command('delete-user')
  .option('--format <value>', 'Give format', 'json')
  .requiredOption('--id <value>', 'User\'s id')
  .action(function(command) {
	axios.delete(`${apiUrl}/users/${command.id}?format=${command.format}/`, {}, { httpsAgent: agent })
	.then(function(response) {
		console.log(response.data);
	})
	.catch(function (error) {
	  console.log('Sign up failed: ', error.response.data.message);
	});
  })

  program
  .command('list-users')
  .option('--format <value>', 'Give format', 'json')
  .option('--start <value>')
  .option('--count <value>')
  .action(function (command) {
	fs.readFile('/tmp/user.json', function(err, data) {
	  if (err) {
		return console.log('Token not found. Login first', err);
	  }
	  const token = JSON.parse(data).token;
	  axios.get(`${apiUrl}/admin/users?format=${command.format}&start=${command.start}&count=${command.count}`, { httpsAgent: agent, headers: { 'Authorization': `Bearer ${token}` } })
	  .then(function (response) {
		// handle success
		console.log(response.data);
	  })
	  .catch(function (error) {
		// handle error
		console.log('{ status: \'error\' }');
	  })
	})
  });

  program
  .command('add-user')
  .option('--format <value>', 'Give format', 'json')
  .requiredOption('--username <value>', 'User\'s username')
  .requiredOption('--password <value>', 'User\'s password')
  .requiredOption('--firstName <value>', 'User\'s first name')
  .requiredOption('--lastName <value>', 'User\'s last name')
  .requiredOption('--email <value>', 'User\'s email')
  .option('--plan <value>', 'User\'s plan (standard or premium)')
  .action(function (command) {
	fs.readFile('/tmp/user.json', function(err, data) {
	  if (err) {
		return console.log('Token not found. Login first', err);
	  }
	  const token = JSON.parse(data).token;
	  axios.post(`${apiUrl}/admin/users?format=${command.format}`, {
		username: command.username,
		password: command.password,
		firstName: command.firstName,
		lastName: command.lastName,
		role: command.role,
	    agency: command.agency
	  }, { httpsAgent: agent, headers: { 'Authorization': `Bearer ${token}` } })
	  .then(function (response) {
		// handle success
		console.log(response.data);
	  })
	  .catch(function (error) {
		// handle error
		console.log('{ status: \'error\' }');
	  })
	})
  });

  program
  .command('get-user')
  .option('--format <value>', 'Give format', 'json')
  .requiredOption('--id <value>', 'User\'s id')
  .action(function (command) {
	fs.readFile('/tmp/user.json', function(err, data) {
	  if (err) {
		return console.log('Token not found. Login first', err);
	  }
	  const token = JSON.parse(data).token;
	  axios.get(`${apiUrl}/admin/users/${command.id}?format=${command.format}`, { httpsAgent: agent, headers: { 'Authorization': `Bearer ${token}` } })
	  .then(function (response) {
		// handle success
		console.log(response.data);
	  })
	  .catch(function (error) {
		// handle error
		console.log('{ status: \'error\' }');
	  })
	})
  });

  program
  .command('update-user')
  .option('--format <value>', 'Give format', 'json')
  .requiredOption('--id <value>', 'User\'s id')
  .option('--username <value>', 'User\'s username', null)
  .option('--password <value>', 'User\'s password', null)
  .option('--firstName <value>', 'User\'s firstname', null)
  .option('--lastName <value>', 'User\'s lastname', null)
  .option('--role <value>', 'User\'s role, type:\n0 for Κέντρο Ελέγχου\n1 for Υπάλληλος Τμήματος\n2 for Προσωπικό Τμήματος\n3 for Γενική Διοίκηση\n4 for Admin\n5 for Διοίκηση Φορέα\n')
  .option('--agency <value>', 'User\'s agency, type:\n0 for ΕΚΑΒ\n1 for Αστυνομία\n2 for Πυροσβεστική\n3 for Λιμενικό\n')
  .action(function (command) {
	fs.readFile('/tmp/user.json', function(err, data) {
	  if (err) {
		return console.log('Token not found. Login first', err);
	  }
	  const token = JSON.parse(data).token;
	  axios.put(`${apiUrl}/admin/users/${command.id}?format=${command.format}`, {
		username: command.username,
		password: command.password,
		firstName: command.firstName,
		lastName: command.lastName,
		role: command.role,
		agency: command.agency
	  }, { httpsAgent: agent, headers: { 'Authorization': `Bearer ${token}` } })
	  .then(function (response) {
		// handle success
		console.log(response.data);
	  })
	  .catch(function (error) {
		// handle error
		console.log('{ status: \'error\' }', error);
	  })
	})
  });

  program
  .command('delete-user')
  .option('--format <value>', 'Give format', 'json')
  .requiredOption('--id <value>', 'User\'s id')
  .action(function (command) {
    fs.readFile('/tmp/user.json', function(err, data) {
	  if (err) {
		return console.log('Token not found. Login first', err);
	  }
	  const token = JSON.parse(data).token;
	  axios.delete(`${apiUrl}/admin/users/${command.id}?format=${command.format}`, { httpsAgent: agent, headers: { 'Authorization': `Bearer ${token}` } })
	  .then(function (response) {
		// handle success
		console.log(response.data);
	  })
	  .catch(function (error) {
		// handle error
		console.log('{ status: \'error\' }');
	  })
	})
  });

  program.parse(process.argv);
}
