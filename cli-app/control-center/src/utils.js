fs = require('fs');

function getToken(path) {
  try {
    const data = fs.readFileSync(path);
    const tokenObject = JSON.parse(data);
    const token = tokenObject.token;

    return token.substring(7);
  } catch(error) {
      return error;
  }
}

function checkLogInfo(username, userPath, tokenPath) {
  if(fs.existsSync(userPath)) {
    const data = fs.readFileSync(userPath);
    const user = JSON.parse(data);

    // If a user is already logged in
    if(fs.existsSync(tokenPath)) {
      // If it is another user than the one trying to log in
      if(username !== user.username)
        return { result: false, message: 'Error: Please log out first!' }
      else
        return { result: false, message: 'You are already logged in!' } 
    }
  }

  return { result: true }
}

module.exports.getToken = getToken;
module.exports.checkLogInfo = checkLogInfo;