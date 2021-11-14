const sgMail = require('@sendgrid/mail');

const sendGridAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendGridAPIKey);

sgMail.send({
  to: 'nazaryan.aram94@gmail.com',
  from: 'nazaryan.aram94@gmail.com',
  subject: 'Hi there',
  text: 'are you here?',
}).catch(e => console.log(e.response.body))

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'nazaryan.aram94@gmail.com',
    subject: 'Thanks for joining us!',
    text: `Hi, ${name}, you are in!`,
  })
}

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'nazaryan.aram94@gmail.com',
    subject: 'Why are you leaving',
    text: `No, ${name}, please stay with us, we're working on our website to make it better, noooooo`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail,
}
