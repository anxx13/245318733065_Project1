//storing secret for JWT hashing
//This secret will be read by JWT library while creating and validating tokens. 
//In production, we need to store this secret in environment variable instead of a file
module.exports = {
    secret: 'worldisfullofdevelopers'
  };