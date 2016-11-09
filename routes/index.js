var express = require('express');
var router = express.Router();

//added by sfathy///////////////////////////
var mongoose = require('mongoose');
var jwt = require('express-jwt');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var Task = mongoose.model('Task');
var Comment = mongoose.model('Comment');
var passport = require('passport');
var User = mongoose.model('User');



router.get('/tasks', auth,function(req, res, next) {
  Task.find({'emp' :  req.payload.username},function(err, tasks){
    //console.log('emp:' + req.payload.username);
    if(err){ return next(err); }

    res.json(tasks);
  });
});

router.get('/tasks/team/:name', auth,function(req, res, next) {
  Task.find({'emp' :  req.params.name},function(err, tasks){
    //console.log('emp:' + req.payload.username);
    if(err){ return next(err); }

    res.json(tasks);
  });
});



router.post('/tasks',auth, function(req, res, next) {
  var task = new Task(req.body);
  task.emp = req.payload.username;
  task.save(function(err, task){
    if(err){ return next(err); }

    res.json(task);
  });
});

router.param('task', function(req, res, next, id) {
  var query = Task.findById(id);

  query.exec(function (err, task){
    if (err) { return next(err); }
    if (!task) { return next(new Error('can\'t find task')); }

    req.task = task;
    return next();
  });
});

router.get('/tasks/:task', auth,function(req, res, next) {
  
  
    res.json(req.task);
  
});


router.put('/tasks/:task/start', function(req, res, next) {
  req.task.start(function(err, task){
    if (err) { return next(err); }

    res.json(task);
  });
});

router.put('/tasks/:task/', function(req, res, next) {
  var task = new Task(req.body);
  console.log("task id = " + req.task._id);
  Task.remove({_id:req.task._id},function(err,task){
    console.log("delete task id = " + req.task._id);
    task = new Task(req.body);
    task.save(function(err, task){
      if (err) { return next(err); }
      console.log("save new task ");
      res.json(task);
    });
  });
  
});

router.put('/tasks/:task/finish', function(req, res, next) {
  req.task.finish(function(err, task){
    if (err) { return next(err); }

    res.json(task);
  });
});

router.put('/tasks/:task/stop', function(req, res, next) {
  req.task.stop(function(err, task){
    if (err) { return next(err) ; }

    res.json(task);
  });
});



router.get('/timesheet', auth,function(req, res, next) {
  Task.find({'emp' :  req.payload.username},function(err, tasks){
    //console.log('emp:' + req.payload.username);
    if(err){ return next(err); }

    res.json(tasks);
  });
});


router.get('/team', auth,function(req, res, next) {
  var regex = new RegExp(["^", req.payload.username, "$"].join(""), "i");
  User.find({'supervisor' :  regex},function(err, users){
  /*  Task.aggregate([{$lookup:{from:"users",localField:"emp",foreignField:"username",as:"userTasks"}},
      {$match:{"isworking":true}},function(err,usertasks){*/
        if(err){ return next(err); }

        // for (var user = users.length - 1; user >= 0; user--) {
        //   Task.find({$and:[{'emp' : users[user].username},{'isworking' : true}]},function(err,task){
        //     if(err){return next(err);}
        //     users[user].workingTask = task;

        //   });
        // }
        res.json(users);    
    });
    //console.log('emp:' + req.payload.username);
    
  
});

router.get('/team/:username', auth,function(req, res, next) {
  
  Task.find({'emp' :  $params.username},function(err, users){
  /*  Task.aggregate([{$lookup:{from:"users",localField:"emp",foreignField:"username",as:"userTasks"}},
      {$match:{"isworking":true}},function(err,usertasks){*/
        if(err){ return next(err); }

        res.json(users);    
    });
    //console.log('emp:' + req.payload.username);
    
  
});



router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;
  //console.log('user name:' + user.username);
  user.setPassword(req.body.password)
  user.id = req.body.ID;
  user.supervisor = req.body.Supervisor;

  /*console.log("hash:" + user.hash);
  console.log("salt:" + user.salt);
  console.log("supervisor:" + user.supervisor);
  console.log("supervisor:" + req.body.Supervisor);*/
  user.save(function (err){
    if(err){ console.log(err); return next(err);  }


    return res.json({token: user.generateJWT()})
  });
});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      //var con = 'supervisor':req.body.username;
      console.log(user.username);
      User.find({'supervisor':user.username},function(err,team){
        if (err) {user.isSupervisor=false;}
        else{
          if(team.length>0){
            user.isSupervisor = true;
          }else{
            user.isSupervisor=false;
          }
        }
        return res.json({token: user.generateJWT()});
      });

      // console.log(team.username);
      // if(team.username !== undefined){
      //   user.isSupervisor = true;
      //   console.log('supervisor for:' + team);
      // }else{
      //   user.isSupervisor = false;
      //   console.log(' not supervisor: ' + team);
      // }

      
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});                


///////////////////////////////////////

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
