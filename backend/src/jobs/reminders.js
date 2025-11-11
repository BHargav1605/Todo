const Agenda = require('agenda');
const Todo = require('../models/Todo');
const User = require('../models/User');
const mailer = require('../services/mailer');

module.exports = async function initAgenda(mongoConnectionString, app) {
  const agenda = new Agenda({ db: { address: mongoConnectionString, collection: 'agendaJobs' } });

  agenda.define('send reminder', async (job) => {
    const { todoId } = job.attrs.data;
    const todo = await Todo.findById(todoId).populate('user');
    if (!todo) return;
    if (todo.done) return; // don't send reminders for done tasks
    const user = await User.findById(todo.user);
    if (!user) return;
    const html = `<p>Reminder: "${todo.title}" is due at ${todo.dueAt}</p>
                  <p><a href="${process.env.APP_URL}/">Open your todo app</a></p>`;
    try {
      await mailer.sendReminder(user.email, `Reminder: ${todo.title} (due soon)`, html);
    } catch (err) {
      console.error('Failed to send reminder', err);
    }
  });

  await agenda.start();
  app.locals.agenda = agenda;
  return agenda;
};
