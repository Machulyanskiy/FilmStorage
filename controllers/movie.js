const mongoose = require('mongoose');
require('../models/Movie').registerModel();
const Movie = mongoose.model('movies');
const errorHandler = require('../utils/errorHandler');
const fs = require('fs');

module.exports.getAll = async function(req, res) {
    try {
        let movies = await Movie.find().sort({title: 1});

        res.status(200).json(movies);
    } catch (e) {
        errorHandler(e, res);
    }
};

module.exports.getById = async function(req, res) {
    try {
        let movie = await Movie.findById(req.params.id);
        res.status(200).json(movie);
    } catch (e) {
        errorHandler(e, res);
    }
};

module.exports.getByCriterion = async function(req, res) {
    try {
        let query = null;
        switch(req.params.criterion) {
            case 'byActor':
                query = {"actors": { "$regex": req.params.text, "$options": "i"}};
                break;
            case 'byMovie':
                query = {"title": { "$regex": req.params.text, "$options": "i"}};
                break;
            case 'both':
                query = {
                    $or: [
                        {"actors": {"$regex": req.params.text, "$options": "i"}},
                        {"title": {"$regex": req.params.text, "$options": "i"}}
                    ]
                };
        }

        const movies = await Movie.find(query);
        res.status(200).json(movies);
    } catch (e) {
        errorHandler(e, res);
    }
};

module.exports.create = async function(req, res) {
    try {
        const movie = ({
            title: req.body.title.trim(),
            year: parseInt(req.body.year),
            format: req.body.format.trim(),
            actors: req.body.actors.trim()
        });
        await Movie.findOneAndUpdate(
            {title: movie.title},
            {$set: movie},
            {upsert: true}
        );
        res.status(200).json({message: "Movie created"});
    } catch (e) {
        errorHandler(e, res);
    }
};

module.exports.import = async function(req, res) {
    try {
        const fileContent = fs.readFileSync(req.file.path, 'utf8', function(err, contents){
            if (err) throw err;

        }).split("\n\n");
        let buff = '';
        const movieArr = fileContent.map(function (val) {
            buff = val.split("\n");
            return buff.map(function(val){
                return val.split(":");
            });
        }, buff);
        for(let index in movieArr) {
            if (movieArr[index][0][1] === undefined) break;
            let movie = ({
                title: movieArr[index][0][1].trim(),
                year: parseInt(movieArr[index][1][1]),
                format: movieArr[index][2][1].trim(),
                actors: movieArr[index][3][1].trim()
            });
            await Movie.findOneAndUpdate(
                {title: movie.title},
                {$set: movie},
                {upsert: true}
            );
        }
        fs.unlinkSync(req.file.path);
        res.status(200).json({message: "Movies imported"});
    } catch (e) {
        errorHandler(e, res);
    }
};

module.exports.delete = async function(req, res) {
    try {
        await Movie.deleteOne({_id: req.params.id});
        res.status(200).json({message: 'Movie deleted'})
    } catch (e) {
        errorHandler(e, res);
    }
};