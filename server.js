
//setting up my npms, for logging, express, mongoose
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

//connecting my module
const blogPostRouter = require('./blogPostRouter');
const { PORT, DATABASE_URL } = require("./config");

console.log('i exist, Can you hear me')

// Setting up my logging, module, and (i dont know why i need the third)
app.use(morgan('common'));


app.use(express.static('public'));

// Set mongoose promise
mongoose.Promise = global.Promise;

//initiating blog Post Router
app.use('/blog-posts', blogPostRouter);

app.get('/', (req, res) => {
  res.end('Welcome to Kevins Website!')
})

// starting/ closing my servers

let server;


function runServer(){
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject)=>{
    mongoose.connect(DATABASE_URL, error =>{
      if(error){
        return reject(error);
      }

    server = app.listen(port, function(){
      console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
      resolve(server);
    })
    .on('error',function(error){
      mongoose.disconnect();
      console.log('above reject', error)
      reject(error);
    });
  });
})
};



//closes server and disconnects mongoose
function closeServer(){
  return mongoose.disconnect().then(() =>{

  return new Promise((resolve, reject)=>{
    console.log('closing server')
    server.close(err =>{
      if (err){
        reject(err);
        return;
      }
      resolve();
      });
    });
  });
};


if (require.main === module) {
  runServer(DATABASE_URL)
    .catch(err => {
      console.error('Unable to start the server.')
      console.error(err)
    })
};




// app.listen(process.env.PORT || 8080, () => {
//   console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
// });

module.exports = {app,runServer, closeServer};
