const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/projects', {useNewUrlParser: true, useFindAndModify: false}, (err) => {
    if(err) {
        throw new Error(err);
    } else {
        console.log('connected to mongoo');
    }
});

const ProjectSchema = mongoose.Schema({
    createdOn: {
        type: Date,
        required: [true, 'Липсва дата на записване'],
    },
    authors: {
        type: String,
        required: [true, 'Липсват автори'],
    },
    name: {
        type: String,
        required: [true, 'Липсва име'],
    },
    url: {
        type: String,
        match: [new RegExp('https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,}'), 'URL-a e невалиден'],
        required: [true, 'Липсва URL'],
    },
    description: {
        type: String,
        required: [true, 'Липсва описание'],
    },
    tags: String,
    status: {
        type: String,
        required: true,
        enum: {
            values: ['Предложен', 'Одобрен'],
            message: 'Невалиден статус'
        },
        default: 'Предложен'
    }
});
ProjectSchema.set('toJSON', {
    getters: true,
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Project', ProjectSchema);
