const express = require('express');
require('./db/mongoose.js');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log('App is running on port ' + port)
})

// const Task = require('./models/task');
// const User = require('./models/user');

const main = async () => {
  // const task = await Task.findById('61864a46271a16812f073f4c');
  // await task.populate('owner');
  // console.log(task.owner)

  // const user = await User.findById('618649f9890045d89ddafefc');
  // await user.populate('tasks');
  // console.log(user.tasks)
}

main();