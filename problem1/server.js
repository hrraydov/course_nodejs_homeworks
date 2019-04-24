const express = require('express');
const bodyParser = require('body-parser');

const Project = require('./model');

const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

app.use(bodyParser.json());

const mongooseErrorMapper = (err) => {
    return Object.keys(err.errors).map(field => ({
        field: err.errors[field].path,
        message: err.errors[field].message
    }));
};

app.get('/api/projects', (req, res) => {
    Project.find((err, data) => {
        if (err) {
            return res.status(400).json(mongooseErrorMapper(err));
        }
        return res.json(data);
    });
});
app.post('/api/projects', (req, res) => {
    const project = req.body;
    Project.create(project, (err, created) => {
        if (err) {
            return res.status(400).json(mongooseErrorMapper(err));
        }
        return res.status(201).location(`/api/projects/${created.id}`).json(created);
    });
});
app.get('/api/projects/:id', (req, res) => {
    Project.findById(req.params.id, (err, found) => {
        if (err) {
            return res.status(400).json(mongooseErrorMapper(err));
        }
        if (!found) {
            return res.status(404).json({message: 'Проектът не е намерен'});
        }
        return res.json(found);
    });
});
app.put('/api/projects/:id', (req, res) => {
    Project.findById(req.params.id, (err, found) => {
        if (!found) {
            return res.status(404).json({message: 'Проектът не е намерен'});
        }
        Project.findByIdAndUpdate(req.params.id, req.body, {runValidators: true}, (err, updated) => {
            if (err) {
                return res.status(400).json(mongooseErrorMapper(err));
            }
            return res.json(updated);
        });
    });

});
app.delete('/api/projects/:id', (req, res) => {
    Project.findById(req.params.id, (err, found) => {
        if (!found) {
            return res.status(404).json({message: 'Проектът не е намерен'});
        }
        Project.findByIdAndDelete(req.params.id, req.body, (err, deleted) => {
            if (err) {
                console.log(err);
                return res.status(400).json(mongooseErrorMapper(err));
            }
            return res.json(deleted);
        });
    });
});

app.use(function (err, req, res, next) {
    return res.status(500).json({
        message: 'Something went wrong with the server'
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
