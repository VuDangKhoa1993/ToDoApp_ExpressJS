const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ToDoTask = require('./models/todotask');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();

dotenv.config();
// create virtual path prefix 
app.use('/static', express.static('public'));
// extract data from body request
// app.use(bodyParser.urlencoded({ extended: false })); // question for this one

// made a connection to DB
mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('Connected to DB successfully!');
    app.listen(process.env.PORT, () => {
        console.log('server up and running on port 3000');
    });
});

// GET method
app.get('/', async (req, res, next) => {
    try {
        const tasks = await ToDoTask.find({});
        res.json(tasks);
    }
    catch (err) {
        res.status(500, err);
    }
});

// POST method
app.post('/', jsonParser, async (req, res, next) => {
    try {
        const todoTask = new ToDoTask({
            content: req.body.content
        });
        await todoTask.save();
        res.sendStatus(200);
    }
    catch (err) {
        console.log(err);
        next(err);
        res.sendStatus(500, err);
    }
});

// UPDATE
app.put('/edit/:id', jsonParser, async (req, res, next) => {
    const id = req.params.id;
    try {
        await ToDoTask.findByIdAndUpdate(id, { content: req.body.content });
        res.sendStatus(200);
    }
    catch (error) {
        next(error);
        res.sendStatus(500, error);
    }
});

// DELETE
app.delete('/delete/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        await ToDoTask.findByIdAndRemove(id);
        res.sendStatus(200);
    }
    catch (error) {
        next(error);
        res.sendStatus(500, error);
    }
});