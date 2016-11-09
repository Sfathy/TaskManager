var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
  name: String,
  emp: String,
  startDt: {
    type: Date,
    default: Date.now()
  },
  endDt: {
    type: Date,
    default: ''
  },
  type: String,
  estimation: Number,
  actualEffort: {
    type: Number,
    default: 0
  },
  work:[],
  currEffortStart:Date,
  currEffortEnd:Date,
  isworking:Boolean,
  project:String
  
});

TaskSchema.methods.start = function(cb) {
  this.isworking = true;
  this.currEffortStart = Date.now();
  this.endDt = '';
  this.save(cb);
};

TaskSchema.methods.stop = function(cb) {
  this.isworking = false;
  this.currEffortEnd = Date.now();
  this.work.push({'stDt':this.currEffortStart,'endDt':this.currEffortEnd});
  this.actualEffort += (Math.round((this.currEffortEnd.getTime() - this.currEffortStart.getTime())/(1000*60*60)*10)/10);
  this.save(cb);
};
TaskSchema.methods.finish = function(cb) {
  if(this.isworking){

    this.isworking = false;
    this.currEffortEnd = Date.now();
    this.work.push({'stDt':this.currEffortStart,'endDt':this.currEffortEnd});
    this.actualEffort += (Math.round((this.currEffortEnd.getTime() - this.currEffortStart.getTime())/(1000*60*60)*10)/10);
  }
  this.endDt = Date.now();
  this.save(cb);
  };

// TaskSchema.methods.update = function(cb){
//   this.save(cb);
// }
mongoose.model('Task', TaskSchema);  