const mongoose = require('mongoose');

mongoose.promise = global.promise;

const Schema = mongoose.Schema;

//My Schemas

const commentSchema =new Schema({content:String})

const blogSchema = new Schema({
        author:[authorSchema]
        title: {type:String},
        contet:{type:String},
        created: {type:Date, default:Date.now},
        comments:[commentSchema]
    });

const authorSchema = new Schema({
    firstname: {type:String},
    lastname: {type:String}
    username:{type:String, unique:true}
});

blogSchema.pre('findOne', function(next) {
  this.populate('author');
  next();
});

blogSchema.pre('find', function(next) {
  this.populate('author');
  next();
});

//the coolest thing ever.. combines name
blogSchema.virtual('authorname').get(function(){
  return `${this.authorName.firstname} ${this.authorName.lastname}`.trim();
});

blogSchema.methods.serialize = function(){
  return {
    id: this._id,
    authorName: this.authorName,
    content: this.content,
    created: this.created,
    title: this.title
  };
};

const Authors = mongoose.model('Authors',authorSchema)
const BlogPost = mongoose.model('Blog', blogSchema);

module.exports = { BlogPost,Authors }
