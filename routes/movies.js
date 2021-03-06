const auth = require('../middleware/auth');
const { Movie, validate } = require('../models/movie');
const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
const { Genre } = require('../models/genre');



router.get('/', async (req, res) => {
    const genres = await Movie.find().sort('name');
    res.send(genres);

});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    await movie.save();

    res.send(movie);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send("This movie cannot be found");
    res.send(movie);

});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    const movie = await Movie.findByIdAndUpdate(req.params.id,
        {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }, { new: true });

    if (!movie) return res.status(404).send('The movie with the given ID was not found.');
    res.send(movie);
});

router.delete('/:id', auth, async (req, res) => {
    const genre = await Movie.findByIdAndRemove(req.params.id);

    if (!genre) return res.status(404).send("This movie cannot be found");
    res.send(genre);
});


module.exports = router;