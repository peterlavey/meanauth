var express = require('express'),
  app = new express(),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  port = process.env.PORT || 3000;

//Config
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

//Headers
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, \Authorization');
  next();
});

//Routes Global
app.get('/', function(req, res) {
  res.send('Welcome');
});

//Routes
var User = require('./app/models/user');

var apiRoute = express.Router();

apiRoute.get('/', function(req ,res){
  res.json({message:'wena wenaa'});
});

apiRoute.route('/users')
  .post(function(req, res){
    var user = new User();

    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;

    user.save(function(err){
      if(err){
        //Duplicate
        if(err.code == 11000){
          return res.json({success: false, message: 'Este usuario ya existe'});
        }else{
          return res.send(err);
        }
      }
      return res.json({message:'User created!'});
    });
  })
  .get(function(req, res){
    User.find(function(err, users){
      if(err) res.send(err);
      res.json(users);
    });
  });

apiRoute.route('/users/:id')
    .get(function(req, res){
      User.findById(req.params.id, function(err, user){
        if(err) res.send(err);
        res.json(user);
      })
    })
    .put(function(req, res){
      User.findById(req.params.id, function(err, user){
        if(err) res.send(err);
        if(req.body.name) user.name = req.body.name;
        if(req.body.username) user.username = req.body.username;
        if(req.body.password) user.password = req.body.password;

        user.save(function(err){
          if(err) res.send(err);
          res.json({message: 'User updated!'});
        });
      });
    })
    .delete(function(req, res){
      User.remove({
        _id: req.params.id
      }, function(err, user){
        if(err) res.send(err);
        res.json({message: 'User deleted!'});
      });
    });

app.use('/api', apiRoute);

app.listen(port);
console.log('Servidor iniciado en el puerto ' + port);

mongoose.connect('mongodb://juanito:perez@ds059155.mongolab.com:59155/mean');
