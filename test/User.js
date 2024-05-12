const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); 
chai.use(chaiHttp);
const expect = chai.expect;

 
describe('User login', () => {
    describe('POST /user/login', () => {
        it('it should return status code 200 since the username and password are correct', (done) => {
            chai.request(app)
                .post('/user/login')
                .send({
                    Username: "testUser",
                    Password: "123456"
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
            });
        });

        it('should display an error if password is incorrect and username is correct', (done) => {
            chai.request(app)
                .post('/user/login')
                .send({
                    Username: "testUser",
                    Password: "wrongPassword"
                })
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    done();
                });
            });
    
        it('should display an error if username is incorrect and the password is correct', (done) => {
            chai.request(app)
                .post('/user/login')
                .send({
                    Username: "wrongUser",
                    Password: "123456"
                })
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    done();
                });
            });

        it('should display an error if the input is blank', (done) => {
            chai.request(app)
                .post('/user/login')
                .send({
                    Username: "",
                    Password: ""
                })
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    done();
            });
        });
});
    



