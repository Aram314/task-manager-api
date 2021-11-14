const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account');
const router = new express.Router();

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('please upload image file'))
    }
    cb(undefined, true)
  }
});

router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token })
  } catch(err) {
    res.status(400).send(err)
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
})

router.post('/users/logout', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = user.tokens.filter(token => {
      return token.token !== req.token;
    })
    await user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
})

router.post('/users/logoutAll', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = [];
    await user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
})

router.get('/users/me', authMiddleware, async (req, res) => {
  res.send(req.user);
})

router.patch('/users/me', authMiddleware, async (req, res) => {
  const validKeys = ['name', 'email', 'password', 'age'];
  const comingKeys = Object.keys(req.body);

  const isValidOperation = comingKeys.every(key => validKeys.includes(key));

  if (!isValidOperation) {
    return res.status(404).send({ error: 'Keys are invalid' })
  }

  try {
    comingKeys.forEach(key => {
      req.user[key] = req.body[key]
    })
    await req.user.save();
    res.send(req.user)
  } catch(e) {
    res.status(400).send();
  }
})

router.delete('/users/me', authMiddleware, async (req, res) => {
  try {
    await req.user.remove();
    sendCancelEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
})

router.post('/users/me/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  res.send();
}, (error, req, res, next) => {
  res.status(400).send({ msg: error.message });
})

router.delete('/users/me/avatar', authMiddleware, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch(e) {
    res.status(400).send();
  }
})

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set('Content-Type', 'image/jpg');
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
})

module.exports = router;