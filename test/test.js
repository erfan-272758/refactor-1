const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');


//* Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Task APIs', () => {


    /**
     * Test the Signup route
    */
    describe("POST /auth/signup", () => {
        it("It should create a new user", (done) => {
            const user = {
                fullname: 'حسن محمدی',
                secretString: '123-895-95'
            }
            chai.request(server)
                .post('/auth/signup')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message');
                    response.body.should.have.property('user');
                    done();
                });
        });
    });


    it("It should NOT POST a new user without required properties", (done) => {
        const user = {
            fullname: "سهیل حاجی زاده"
        };
        chai.request(server)
            .post("/auth/signup")
            .send(user)
            .end((err, response) => {
                response.should.have.status(404);
                response.text.should.be.eq('Please provide all requested data.');
                done();
            });
    });


    it("It should NOT POST a new user with invalid secretString", (done) => {
        const user = {
            fullname: "سهیل حاجی زاده",
            secretString: "1.323-65"
        };
        chai.request(server)
            .post("/auth/signup")
            .send(user)
            .end((err, response) => {
                response.should.have.status(422);
                response.text.should.be.eq('Provided data is not valid! Secret String should not contain - and . in the same time.');

                done();
            });
    });



    /**
     * Test the login route
    */

    describe("POST /auth/login", () => {
        it("It should login a user", (done) => {
            const user = {
                secretString: '132.1596.1356'
            }
            chai.request(server)
                .post('/auth/login')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message');
                    response.body.should.have.property('token');
                    done();
                });
        });
    });


    /**
     * Test the getName route
    */
    describe("POST /auth/getName", () => {
        it("It should get name of a user", (done) => {
            const user = {
                secretString: '132.1596.1356'
            };
            const fullname = 'مریم علی زاده'
            chai.request(server)
                .post('/auth/getName')
                .send(user)
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTk4ZDRkOWRiMTFhN2I0YWU3OTYwMWMiLCJpYXQiOjE2Mzc0NTE4MjcsImV4cCI6MTYzNzQ1NTQyN30.auxR0C2H3y5ILJt0rY_WdOTuoCWyYfXXEwOmqO-Tg1E')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.text.should.be.eq(`You are authenticated and your name is ${fullname}`);
                    done();
                });
        });
    });


    describe("POST /auth/getName", () => {
        it("It should NOT get name of user if client doesn't provide valid credentials.", (done) => {
            const user = {
                secretString: '132.1596.1356'
            };
            chai.request(server)
                .post('/auth/getName')
                .send(user)
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTk4MTFiYWU0NTAzZmY3ZjJmMTNjZTciLCJpYXQiOjE2Mzc0NTI3ODUsImV4cCI6MTYzNzQ1NjM4NX0.cOJN1skSKpBuMjX2-m1IbGgyW-RZFI8TWIKnv0JVqW0')
                .end((err, response) => {
                    response.should.have.status(401);
                    response.text.should.be.eq('Credentials not valid.');
                    done();
                });
        });
    });
});