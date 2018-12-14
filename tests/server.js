const request = require('supertest');
const mongoose = require('mongoose');
const mongoURI = require('../config/keys').mongoURITest;
const expect = require('chai').expect;
const express = require('express');
const movieRoutes = require('../routes/movie');

function createApp() {
    const testApp = express();
    testApp.use('/api/movie', movieRoutes);
    return testApp;
}

describe('Server-side tests', function () {
    let Movie;
    let MovieTestId;

    before(function (done) {
        mongoose.connect(mongoURI, {useCreateIndex: true, useNewUrlParser: true})
            .then(() => {console.log('Test MongoDB connected');})
            .catch(error => console.log(error));
        mongoose.connection.once('connected', () => {
            require('../models/Movie').registerModel();
            Movie = mongoose.model('movies');
            done();
        });
    });

    describe('Database requests', function () {

        it('should not save without actors', function (done) {
            const movie = new Movie({
                title: 'test film',
                year: '0000',
                format: 'VHS'
            });
            movie.save(function(err) {
                expect(err).to.exist
                    .and.be.instanceof(Error);
                done();
            });
        });

        it('should return as object', function (done) {
            const movie = new Movie({
                title: 'test film',
                year: '0000',
                format: 'VHS',
                actors: 'Your hope'
            });
            movie.save(function(err, res) {
                expect(res).to.be.an('object');
                MovieTestId = res.id;
                done();
            });
        });


    });

    describe('Routes', function () {
        let server;

        beforeEach(function(done){
            const app = createApp();
            server = app.listen(6000, function(err){
                if (err) return done(err);
                done();
            })
        });

        it('get request to /api/movie/ should return with status 200', function (done) {
            request(server)
                .get('/api/movie/')
                .expect(200);
            done();
        });

        it('get request to /api/movie/:id should return with status 200', function (done) {
            request(server)
                .get(`/api/movie/${MovieTestId}`)
                .expect(200, done);
        });

        it('get request to /api/movie/:criterion/:text should return with status 200', function (done) {
            request(server)
                .get('/api/movie/both/te')
                .expect(200, done);
        });

        /*it('post request to /api/movie/ should return with status 200', function (done) {
            const movie = {
                title: 'The Empire Strikes Back',
                year: '1980',
                format: 'DVD',
                actors: 'Mark Hamill, Harrison Ford, Carrie Fisher, David Prowse'
            };
            request(server)
                .post('/api/movie/')
                .send(movie)
                .expect(200, done);
        });*/

        it('delete request to /api/movie/:id  should return with status 200', function (done) {
            request(server)
                .delete(`/api/movie/${MovieTestId}`)
                .expect(200, done);
        });

        it('404 everything else', function (done) {
            request(server)
                .get('/test')
                .expect(404, done);
        });

        afterEach(function(done){
            server.close();
            done();
        });

    });

    after(async function () {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });
});

