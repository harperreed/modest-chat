const firebaseFunctionsTest = require('firebase-functions-test');
const chai = require('chai');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sinon = require('sinon');

const expect = chai.expect;

const test = firebaseFunctionsTest({
  databaseURL: 'https://<your-project-id>.firebaseio.com',
  storageBucket: '<your-project-id>.appspot.com',
  projectId: '<your-project-id>',
});

describe('Token Function', () => {
  let myFunctions;
  let adminInitStub;

  before(() => {
    myFunctions = require('../api/token');
    adminInitStub = sinon.stub(admin, 'initializeApp');
  });

  after(() => {
    test.cleanup();
    adminInitStub.restore();
  });

  it('should return a token for a valid request', async () => {
    const req = {
      query: {
        room: 'test-room',
      },
      headers: {
        authorization: 'Bearer valid-token',
      },
      cookies: {},
    };

    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };

    const decodedIdToken = {
      name: 'test-user',
      uid: 'test-uid',
    };

    sinon.stub(admin.auth(), 'verifyIdToken').resolves(decodedIdToken);

    await myFunctions(req, res);

    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(res.send.calledOnce).to.be.true;
    expect(res.send.firstCall.args[0]).to.deep.equal({
      room_name: 'test-room',
      identity: 'test-user',
      user_info: decodedIdToken,
    });

    admin.auth().verifyIdToken.restore();
  });

  it('should return 403 for an invalid token', async () => {
    const req = {
      query: {
        room: 'test-room',
      },
      headers: {
        authorization: 'Bearer invalid-token',
      },
      cookies: {},
    };

    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };

    sinon.stub(admin.auth(), 'verifyIdToken').rejects(new Error('Invalid token'));

    await myFunctions(req, res);

    expect(res.status.calledOnceWith(403)).to.be.true;
    expect(res.send.calledOnceWith('Unauthorized')).to.be.true;

    admin.auth().verifyIdToken.restore();
  });

  it('should return 403 if no token is provided', async () => {
    const req = {
      query: {
        room: 'test-room',
      },
      headers: {},
      cookies: {},
    };

    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };

    await myFunctions(req, res);

    expect(res.status.calledOnceWith(403)).to.be.true;
    expect(res.send.calledOnceWith('Unauthorized')).to.be.true;
  });
});
