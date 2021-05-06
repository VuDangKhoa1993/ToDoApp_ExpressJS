const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ToDoTask = require('./models/todotask');
const todotask = require('./models/todotask');

dotenv.config();

// create virtual path prefix 
app.use('/static', express.static('public'));

// extract data from body request
app.use(express.urlencoded({ extended: true }));

// made a connection to DB
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('Connected to DB successfully!');
    app.listen(3000, () => {
        console.log('server up and running on port 3000');
    });
});


// setting view engine configruration 
app.set('view engine', 'ejs');

// GET method
app.get('/',async (req, res, next) => {
    const tasks = await ToDoTask.find({});
    res.json(tasks);
    // ToDoTask.find({}, (error, tasks) => {
    //     res.render('todo.ejs', { todoTasks: tasks });
    //     // res.json(tasks);
    // });
});

// POST method
app.post('/', async (req, res, next) => {
    const todoTask = new ToDoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.status(201);
    }
    catch (err) {
        res.status(500, err);
    }
});

// UPDATE
app.put('/edit/:id',async (req, res) => {
    const id = req.params.id;
    try {
        await ToDoTask.findByIdAndUpdate(id, { content: req.body.content});
        res.status(200);
    }
    catch(error) {
        res.status(500, error);
    }
});

// DELETE
app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    await ToDoTask.findByIdAndRemove(id, (err) => {
        if(err) return res.statusCode(500, err);
        res.status(200);
    })
});