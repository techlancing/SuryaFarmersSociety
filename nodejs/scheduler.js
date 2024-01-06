const EventEmitter = require('events');

class Scheduler extends EventEmitter {
  constructor() {
    super();
    this.scheduleTask();
  }

  scheduleTask() {
    const cron = require('node-cron');
    //cron.schedule('0 6 * * *', () => {
    cron.schedule('0 6 * * *', () => {
      console.log('Executing the scheduled task at 6:40 PM...');
      this.emit('scheduledTask');
    });
  }
}

const schedulerInstance = new Scheduler();

module.exports = schedulerInstance;