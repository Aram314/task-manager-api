const express = require('express');
const Task = require('../models/task');
const authMiddleware = require('../middleware/auth');

const router = new express.Router();

router.post('/tasks', authMiddleware, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })
  try {
    await task.save();
    res.status(201).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.patch('/tasks/:id', authMiddleware,  async (req, res) => {
  const validKeys = ['description', 'completed'];
  const comingKeys = Object.keys(req.body);
  const isValidOperation = comingKeys.every(key => validKeys.includes(key));

  if (!isValidOperation) {
    return res.status(404).send({ error: 'Keys are invalid' })
  }

  const id = req.params.id;
  try {
    const task = await Task.findOne({ _id: id, owner: req.user._id })
    if(!task) {
      return res.status(404).send()
    }
    comingKeys.forEach(key => {
      task[key] = req.body[key]
    })
    await task.save();
    res.send(task)
  } catch (e) {
    res.status(400).send()
  }
})

router.delete('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task)
  } catch (e) {
    res.status(500).send();
  }
})

router.get('/tasks', authMiddleware, async (req, res) => {
  const match = {};
  const sort = {};

  const sortBy = req.query.sortBy || '';

  if(req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  if (sortBy) {
    const [criteria, order] = sortBy.split('_');
    sort[criteria] = (order === 'asc' ? 1 : -1)
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      }
    });
    res.send(req.user.tasks)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.get('/tasks/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findOne({ _id: id, owner: req.user._id });
    if(!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router;
