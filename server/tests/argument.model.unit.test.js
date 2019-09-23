let expect = require('chai').expect;
let models = require('../models/argument.model');

describe('BaseArgumentModel required fields', function () {
    it('should be invalid if title is empty', function (done) {
        var model = new models.BaseArgumentModel();

        model.validate(function(error) {
            expect(error.errors.title).to.exist;
            done();
        })
    });

    it('should be invalid if uid is empty', function (done) {
        var model = new models.BaseArgumentModel();

        model.validate(function(error) {
            expect(error.errors.uid).to.exist;
            done();
        })
    });

    it('should be invalid if username is empty', function (done) {
        var model = new models.BaseArgumentModel();

        model.validate(function(error) {
            expect(error.errors.username).to.exist;
            done();
        })
    });
});