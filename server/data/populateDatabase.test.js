let app = require('../index');
let expect = require('chai').expect;
let request = require('supertest');

describe('POST /api/argument', function () {
    let argumentA = {
        "likes" : [ 
            "oKTl48GSZ1MZnI2fAoCECsVFrvm2"
        ],
        "scheme" : "action",
        "title" : "Can Alternative Sources of Energy Effectively Replace Fossil Fuels?",
        "link" : "",
        "uid" : "oKTl48GSZ1MZnI2fAoCECsVFrvm2",
        "username" : "Haaris Memon",
        "circumstance" : "That there is a widescale use of fossils fuels, which are a finite resource and the primary contributor to global climate change.",
        "action" : "Immediately replace fossil fuels with more sustainable, efficient and renewable sources of energy.",
        "newCircumstance" : "Use of renewable sources will result in a lower impact on the environment and reduce dependence on fossil fuels.",
        "goal" : "To stop and reduce the effects of global warming.",
        "value" : "To preserve and protect our planet.",
    }

    let argumentB = {
        "likes" : [],
        "scheme" : "action",
        "criticalQuestionTag" : "action3",
        "criticalQuestion" : "Is there an alternative action that achieves the goal 'Decrease the use of fossil fuels and emission of CO2 to the atmosphere'?",
        "agree" : false,
        "title" : "Alternative action by reducing the number of trees being cut down",
        "link" : "",
        "uid" : "oKTl48GSZ1MZnI2fAoCECsVFrvm2",
        "username" : "Haaris Memon",
        "circumstance" : "That there is a widescale use of fossils fuels, which are a finite resource and the primary contributor to global climate change.",
        "action" : "Reduce the number of trees being cut down. Timber harvesting contributes to billions of tons of carbon to the atmosphere. To act we need to improve the agricultural practices along with paper recycling and forest management.",
        "newCircumstance" : "of quick elimination of a significant chunk of emissions to the atmosphere.",
        "goal" : "To stop and reduce the effects of global warming. ",
        "value" : "To preserve and protect our planet.",
    }

    let argumentC = {
        "likes" : [],
        "scheme" : "expert",
        "criticalQuestionTag" : "action1",
        "criticalQuestion" : "Is the current circumstance 'Global Warming' true?",
        "agree" : true,
        "title" : "Current circumstance of Global Warming is true",
        "link" : "",
        "uid" : "oKTl48GSZ1MZnI2fAoCECsVFrvm2",
        "username" : "Haaris Memon",
        "source" : "An associate professor in the Faculty of Arts & Humanities at King’s College London.",
        "domain" : "Philosophy",
        "assertion" : "Fossil fuel combustion is the main contributor to black carbon collected at five sites around the Arctic, which has implications for global warming.",
    }

    let argumentD = {
        "likes" : [],
        "scheme" : "positionToKnow",
        "criticalQuestionTag" : "expert2",
        "criticalQuestion" : "Is the source 'Professor of Harvard' an expert in the field that the assertion 'Global warming is a real problem' is in?",
        "agree" : false,
        "title" : "The Professor of Harvard is not an expert in the field",
        "link" : "",
        "uid" : "oKTl48GSZ1MZnI2fAoCECsVFrvm2",
        "username" : "Haaris Memon",
        "source" : "A professor at King’s College London in Environmental Science.",
        "proposition" : "The associate professor does not specialise in and is not in a field to make an assertion about climate change and global warming. Hence the assertion being made should be taken with a grain of salt.",
    }

    let idArgumentA;

    it('Create argument A', function (done) {
        argumentA.ancestorIds = [];

        request(app).post('/api/argument').send(argumentA)
        .end(function(err, res) {
            expect(res.statusCode).to.equal(201);
            expect(res.body._id).to.exist;
            idArgumentA = res.body._id;
            done();
        });
    });

    let idArgumentB;

    it('Create argument B', function (done) {
        argumentB.parentId = idArgumentA;
        argumentB.ancestorIds = [idArgumentA];
        argumentB.originalId = idArgumentA;

        request(app).post('/api/argument').send(argumentB)
        .end(function(err, res) {
            expect(res.statusCode).to.equal(201);
            expect(res.body._id).to.exist;
            idArgumentB = res.body._id;
            done();
        });
    });

    let idArgumentC;

    it('Create argument C', function (done) {
        argumentC.parentId = idArgumentA;
        argumentC.ancestorIds = [idArgumentA];
        argumentC.originalId = idArgumentA;

        request(app).post('/api/argument').send(argumentC)
        .end(function(err, res) {
            expect(res.statusCode).to.equal(201);
            expect(res.body._id).to.exist;
            idArgumentC = res.body._id;
            done();
        });
    });

    let idArgumentD;

    it('Create argument D', function (done) {
        argumentD.parentId = idArgumentC;
        argumentD.ancestorIds = [idArgumentA, idArgumentC];
        argumentD.originalId = idArgumentA;

        request(app).post('/api/argument').send(argumentD)
        .end(function(err, res) {
            expect(res.statusCode).to.equal(201);
            expect(res.body._id).to.exist;
            idArgumentD = res.body._id;
            done();
        });
    });
});