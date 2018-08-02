const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


// const {BlogPosts} = require('./model')

const { BlogPost, Authors } = require('./schema');

const { PORT, DATABASE_URL } = require("./config");
mongoose.promise = global.Promise;

console.log(DATABASE_URL)


console.log('can you hear me blog post!')


//initial get from DB
router.get('/authors', function(req,res){
  Authors.find()
    .then(authors =>{
      res.json(authors.map(author =>{
        return{
          id: author._id,
          name: `${author.firstName} ${author.lastName}`,
          userName: author.userName
        };
      }));
    })
  .catch(error =>{
    console.error(error);
    res.status(500).json({error: 'big ol error'});
  });
});

//second get for ids
router.get('/:id', function(req,res){
  BlogPost
    .findById(req.params.id)
    .then(posts =>{
      res.json(posts.map(post =>post.serialize()));
    })
  .catch(error =>{
    console.error(error);
    res.status(500).json({error: 'big ol error'});
  });
});

//post blogs
router.post('/authors', jsonParser,function(req,res){
  const requiredFields = ['firstname','lastname','username'];
  for(let i=0;i<requiredFields.length;i++){
    const field =requiredFields[i];
    if(!(field in req.body)){
      const message = `Missing ${field} in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Author
  .findOne({ userName: req.body.userName })
  .then(author => {
    if (author) {
      const message = `Username already taken`;
      console.error(message);
      return res.status(400).send(message);
    }
    else{
  Authors
    .create({
      firstname: req.body.firstName,
      lastname:req.body.lastName,
      username:req.body.userName
    })
    .then(author => {
      res.status(201).json(author.serialize())
    .create(error => {
      console.error(error);
      res.status(500);
      })
      });
    }
  });
});

app.put('/authors/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['firstName', 'lastName', 'userName'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Author
    .findOne({ userName: updated.userName || '', _id: { $ne: req.params.id } })
    .then(author => {
      if(author) {
        const message = `Username already taken`;
        console.error(message);
        return res.status(400).send(message);
      }
      else {
        Author
          .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
          .then(updatedAuthor => {
            res.status(200).json({
              id: updatedAuthor.id,
              name: `${updatedAuthor.firstName} ${updatedAuthor.lastName}`,
              userName: updatedAuthor.userName
            });
          })
          .catch(err => res.status(500).json({ message: err }));
      }
    });
});


app.delete('/authors/:id', (req, res) => {
  BlogPost
    .remove({ author: req.params.id })
    .then(() => {
      Author
        .findByIdAndRemove(req.params.id)
        .then(() => {
          console.log(`Deleted blog posts owned by and author with id \`${req.params.id}\``);
          res.status(204).json({ message: 'success' });
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});
//initial get from DB
router.get('/', function(req,res){
  BlogPost.find()
    .then(posts =>{
      res.json(posts.map(post =>post.serialize()));
    })
  .catch(error =>{
    console.error(error);
    res.status(500).json({error: 'big ol error'});
  });
});

//second get for ids
router.get('/:id', function(req,res){
  BlogPost
    .findById(req.params.id)
    .then(posts =>{
      res.json(posts.map(post =>post.serialize()));
    })
  .catch(error =>{
    console.error(error);
    res.status(500).json({error: 'big ol error'});
  });
});

//post blogs
router.post('/', jsonParser,function(req,res){
  const requiredFields = ['title','content','authorName'];
  for(let i=0;i<requiredFields.length;i++){
    const field =requiredFields[i];
    if(!(field in req.body)){
      const message = `Missing ${field} in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  BlogPost
    .create({
      title: req.body.title,
      content:req.body.content,
      authorName:req.body.authorName
    })
    .then(BlogPost => {
      res.status(201).json(BlogPost.serialize())
    .create(error => {
      console.error(error);
      res.status(500);
    })
  });
});

// Delete blogs
router.delete('/:id', function(req,res){
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog ${req.params.ID}`);
  res.status(204).end();
});

//put request
router.put('/:id', jsonParser, function(req,res){
  const requiredFields = ['title','content','author'];
  for(let i=0; i<requiredFields.length;i++){
    const field = requiredFields[i];
    if(!(field in req.body)){
      const message = `Missing\`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if(req.params.id !== req.body.id){
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id} must match`);
      console.error(message);
      return res.status(400).send(message);
  }
  console.log(`updating blog \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.params.title,
    content: req.params.content
  });
  res.status(204).end();
});


// app.use('*', function (req, res) {
//   res.status(404).json({ message: 'Not Found' });
// });

module.exports = router;
