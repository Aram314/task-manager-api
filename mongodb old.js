const { MongoClient, ObjectID } = require('mongodb');

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => {
  if(error) {
    return console.log('Unable to connect to the database');
  }

  const db = client.db(databaseName);

  db.collection('users').deleteMany({
    age: 27,
  }).then(res => console.log(res))
    .catch(err => console.log(err))

  // db.collection('tasks').updateMany({}, {
  //   $set: {
  //     completed: true
  //   }
  // })
  //   .then(res => console.log(res))
  //   .catch(err => console.log(err))

  // db.collection('users').findOne({ name: 'MyName' }, (error, user) => {
  //   if(error) {
  //     return console.log('Unable to fetch');
  //   }
  //   console.log(user)
  // })

  // db.collection('tasks').findOne({ _id: ObjectID('617d01e8e2d37773a21c135b') }, (error, task) => {
  //   console.log(task)
  // })
  //
  // db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
  //   console.log(tasks)
  // })
  // const id = new ObjectID();
  // console.log(id);
  // console.log(id.getTimestamp())
  // console.log(id.id);
  // console.log(id.toHexString());
  // db.collection('users').insertOne({
  //   name: 'MyName',
  //   age: 27
  // }, (error, result) => {
  //   if(error) {
  //     return console.log('Unable to insert document');
  //   }
  //
  //   console.log(result)
  // })

  // db.collection('users').insertMany([
  //   {
  //     name: 'varung',
  //     age: 2,
  //   }, {
  //     name: 'tav',
  //     age: 43,
  //   }
  // ], (error, result) => {
  //   if(error) {
  //     return console.log(error);
  //   }
  //
  //   console.log(result)
  // })

  // db.collection('tasks').insertMany([
  //   {
  //     description: 'Do laundry',
  //     completed: false,
  //   }, {
  //     description: 'Do shopping',
  //     completed: true,
  //   }, {
  //     description: 'Learn node js',
  //     completed: false,
  //   }
  // ], (error, result) => {
  //   if(error) {
  //     return console.log(error);
  //   }
  //
  //   console.log(result)
  // })
})