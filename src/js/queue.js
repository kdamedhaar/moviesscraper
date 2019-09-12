/**this module manages queue for the async tasks*/
var async = require('async');

/**
* Mantains a queue for the tasks to perform as per given concurrency.
* @constructor
* @param {object} taskarg - argument for the taskfunction.
* @param {number} concurrency - number of simultaneous tasks to execute.
* @param {function} taskfunction - task to be performed
* @param {function} draincallback - callback function when queue is drained.
*/
var queueTasks = function(taskarg, concurrency,taskfunction, draincallback){
  var queue = async.queue(function(task, callback){

        //perform the actual task
        taskfunction(task, callback);

      }, concurrency);

  //callback when queue is drained
  queue.drain = draincallback;

  // queue the tasks items to be processed
  queue.push(taskarg);
};

module.exports = queueTasks;
