let sinon = require('sinon')
let expect = require('chai').expect
let models = require('../models/argument.model')
let argumentController = require('../controllers/argumentController');

describe("Submit an argument", function() {
    it('should create a new argument', function(done) {
        var ArgumentMock = sinon.mock(models.getSchemeModel('action', { 
            _id: 'mock_id',
            scheme: 'action',
            uid: 'mock_uid',
            username: 'mock_username'
        }));
        var argument = ArgumentMock.object;
        var expectedResult = { status: true };
        ArgumentMock.expects('save').yields(null, expectedResult);
        argument.save(function (err, result) {
            ArgumentMock.verify();
            ArgumentMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });

    it("should return error, if argument not saved", function(done){
        var ArgumentMock = sinon.mock(models.getSchemeModel('action', { 
            _id: 'mock_id',
            scheme: 'action',
            uid: 'mock_uid',
            username: 'mock_username'
        }));
        var argument = ArgumentMock.object;
        var expectedResult = { status: false };
        ArgumentMock.expects('save').yields(expectedResult, null);
        argument.save(function (err, result) {
            ArgumentMock.verify();
            ArgumentMock.restore();
            expect(err.status).to.not.be.true;
            done();
        });
    });
});

describe("Update an argument", function() {
    let status, json, req, res;

    beforeEach(async function() {
        req = {
            query: {
                id: "mock_id"
            }
        };
        json = sinon.spy()
        status = sinon.stub()
        res = {json, status};
        status.returns(res)

        expectedResult = [{}];
        sinon.stub(models.BaseArgumentModel, 'findOneAndUpdate').resolves(expectedResult);
        await argumentController.argument_update_put(req, res);
    });

    afterEach(function() {
        models.BaseArgumentModel.findOneAndUpdate.restore();
    })

    it('should correctly find an argument', function() {
        sinon.assert.calledOnce(models.BaseArgumentModel.findOneAndUpdate);
        sinon.assert.calledWith(models.BaseArgumentModel.findOneAndUpdate, {_id: "mock_id"});
    });

    it('should update an argument', function() {
        sinon.assert.calledOnce(json);
        sinon.assert.calledWith(json, expectedResult);
    });
});

describe("Get an argument", function() {
    let status, json, req, res;

    beforeEach(function() {
        req = { 
            body: { 
                scheme: 'action',
                title: "Mock Argument",
                uid: "userid",
                username: "John Doe"
            },
            query: { 
                id: "5aa06bb80738152cfd536fdc" // for testing get, delete and update vehicle
            }
        };

        json = sinon.spy()
        status = sinon.stub()
        res = {json, status};
        status.returns(res)

        expectedResult = req.body;
    });

    afterEach(function() {
        models.BaseArgumentModel.findOne.restore();
    })

    it('should correctly use id to get an argument', async function() {
        sinon.stub(models.BaseArgumentModel, 'findOne').resolves(expectedResult);
        await argumentController.argument_detail_get(req, res);

        sinon.assert.calledOnce(models.BaseArgumentModel.findOne);
        sinon.assert.calledWith(models.BaseArgumentModel.findOne, { _id: req.query.id });
    });

    it('should return an argument', async function() {
        sinon.stub(models.BaseArgumentModel, 'findOne').resolves(expectedResult);
        await argumentController.argument_detail_get(req, res);

        sinon.assert.calledOnce(json);
        sinon.assert.calledWith(json, req.body);
        sinon.assert.calledOnce(status);
        sinon.assert.calledWith(status, 200);
    });

    it('should return an error', async function() {
        sinon.stub(models.BaseArgumentModel, 'findOne').resolves(null);
        await argumentController.argument_detail_get(req, res);

        sinon.assert.calledOnce(json);
        sinon.assert.calledWith(json, { error: "Argument not found with given id" });
        sinon.assert.calledOnce(status);
        sinon.assert.calledWith(status, 500);
    });
});

describe("Delete an argument", function() {
    let status, json, req, res;

    beforeEach(async function() {
        req = {
            query: {
                id: "mock_id"
            }
        };
        json = sinon.spy()
        status = sinon.stub()
        res = {json, status};
        status.returns(res)

        expectedResult = [{}];
        sinon.stub(models.BaseArgumentModel, 'findOneAndRemove').resolves(expectedResult);
        await argumentController.argument_delete(req, res);
    });

    afterEach(function() {
        models.BaseArgumentModel.findOneAndRemove.restore();
    })

    it('should correctly find an argument', function() {
        sinon.assert.calledOnce(models.BaseArgumentModel.findOneAndRemove);
        sinon.assert.calledWith(models.BaseArgumentModel.findOneAndRemove, {_id: "mock_id"});
    });

    it('should delete an argument', function() {
        sinon.assert.calledOnce(json);
        sinon.assert.calledWith(json, expectedResult);
    });
});

describe("Get list of the top arguments", function() {
    let status, json, req, res;

    beforeEach(async function() {
        req = {};
        json = sinon.spy()
        status = sinon.stub()
        res = {json, status};
        status.returns(res)

        expectedResult = [{}, {}];
        
        let sandbox = sinon.createSandbox();
        sandbox.stub(models.BaseArgumentModel, 'find').callsFake(() => {
            return {
                limit: sinon.stub().resolves(expectedResult)
            }
        });
        await argumentController.argument_list_top(req, res);
    });

    afterEach(function() {
        models.BaseArgumentModel.find.restore();
    })

    it('should correctly search for top arguments', function() {
        sinon.assert.calledOnce(models.BaseArgumentModel.find);
        sinon.assert.calledWith(models.BaseArgumentModel.find, {parentId: null});
    });

    it('should return a list of arguments', function() {
        sinon.assert.calledOnce(json);
        sinon.assert.calledWith(json, expectedResult);
    });
});

describe("Get list of an argument's descendents", function() {
    let status, json, req, res;

    beforeEach(function() {
        req = {
            query: { 
                id: "5aa06bb80738152cfd536fdc" // for testing get, delete and update vehicle
            }
        };
        json = sinon.spy()
        status = sinon.stub()
        res = {json, status};
        status.returns(res)

        expectedResult = {
            dummy_1: {
                _id: "dummy_1",
                title: "dummy argument 1",
                scheme: "action",
                parentId: "5aa06bb80738152cfd536fdc",
                children: []
            }, 
            dummy_2: {
                _id: "dummy_2",
                title: "dummy argument 2",
                scheme: "action",
                parentId: "5aa06bb80738152cfd536fdc",
                children: []
            }
        };

        searchResults = [{
                toJSON: sinon.stub().returns({...expectedResult.dummy_1})
            }, 
            {
                toJSON: sinon.stub().returns({...expectedResult.dummy_2})
            }, 
        ];

        sinon.stub(models.BaseArgumentModel, 'find').yields(null, searchResults);
        argumentController.argument_list_descendents(req, res);
    });

    afterEach(function() {
        models.BaseArgumentModel.find.restore();
    })

    it('should correctly search for descendents', function() {
        sinon.assert.calledOnce(models.BaseArgumentModel.find);
        sinon.assert.calledWith(models.BaseArgumentModel.find, { "$or": [
            { _id: "5aa06bb80738152cfd536fdc" },
            {"$or": [ 
                { originalId: "5aa06bb80738152cfd536fdc" },
                { ancestorIds: "5aa06bb80738152cfd536fdc" }
              ]
            }
          ]
        });
    });

    it('should return a list of arguments', function() {
        sinon.assert.calledOnce(json);
        sinon.assert.calledWith(json, expectedResult);
    });
});

describe("Get list of arguments for network", function() {
    let status, json, req, res;

    beforeEach(function() {
        req = {
            query: { 
                id: "5aa06bb80738152cfd536fdc", // for testing get, delete and update vehicle
                useLikes: 'false'
            }
        };
        json = sinon.spy()
        status = sinon.stub()
        res = {json, status};
        status.returns(res)

        expectedResult = {
            edges: [],
            nodes: [{
                borderWidth: 2,
                group: "inNode",
                id: "dummy_1",
                label: "dummy argument 1 \n(Argument for Action)"
          }]
          };

        searchResults = [
            {
                _id: "dummy_1",
                title: "dummy argument 1",
                scheme: "action",
                parentId: "5aa06bb80738152cfd536fdc",
                children: []
            }
        ];

        sinon.stub(models.BaseArgumentModel, 'find').yields(null, searchResults);
        argumentController.argument_list_network(req, res);
    });

    afterEach(function() {
        models.BaseArgumentModel.find.restore();
    })

    it('should correctly search for networks', function() {
        sinon.assert.calledOnce(models.BaseArgumentModel.find);
        sinon.assert.calledWith(models.BaseArgumentModel.find, { "$or": [
            { _id: "5aa06bb80738152cfd536fdc" },
            {"$or": [ 
                { originalId: "5aa06bb80738152cfd536fdc" },
                { ancestorIds: "5aa06bb80738152cfd536fdc" }
              ]
            }
          ]
        });
    });

    it('should return a list of arguments', function() {
        sinon.assert.calledOnce(json);
        sinon.assert.calledWith(json, sinon.match({...expectedResult}));
    });
});

describe("Search for arguments", function() {
    let status, json, req, res;

    beforeEach(async function() {
        req = {
            query: {
                searchQuery: "dummy query"
            }
        };
        json = sinon.spy()
        status = sinon.stub()
        res = {json, status};
        status.returns(res)

        expectedResult = [{}, {}];
        sinon.stub(models.BaseArgumentModel, 'find').resolves(expectedResult);
        await argumentController.argument_list_search(req, res);
    });

    afterEach(function() {
        models.BaseArgumentModel.find.restore();
    })

    it('should correctly search for arguments with given search query', function() {
        sinon.assert.calledOnce(models.BaseArgumentModel.find);
        sinon.assert.calledWith(models.BaseArgumentModel.find, { $text: { $search: "dummy query" } });
    });

    it('should return a list of arguments', function() {
        sinon.assert.calledOnce(json);
        sinon.assert.calledWith(json, expectedResult);
    });
});

describe("Get list of user submitted arguments", function() {
    let status, json, req, res;

    beforeEach(async function() {
        req = {
            query: {
                uid: "dummy_uid"
            }
        };
        json = sinon.spy()
        status = sinon.stub()
        res = {json, status};
        status.returns(res)

        expectedResult = [{}, {}];
        sinon.stub(models.BaseArgumentModel, 'find').resolves(expectedResult);
        await argumentController.argument_list_user_submitted(req, res);
    });

    afterEach(function() {
        models.BaseArgumentModel.find.restore();
    })

    it('should correctly search for user submitted arguments with given user id', function() {
        sinon.assert.calledOnce(models.BaseArgumentModel.find);
        sinon.assert.calledWith(models.BaseArgumentModel.find, { uid: "dummy_uid" });
    });

    it('should return a list of arguments', function() {
        sinon.assert.calledOnce(json);
        sinon.assert.calledWith(json, expectedResult);
    });
});