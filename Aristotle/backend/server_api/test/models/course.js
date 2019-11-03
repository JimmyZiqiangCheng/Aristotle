process.env.NODE_ENV = 'test'

const chai = require('chai');
let expect = chai.expect;
const Course = require('../../models/courseModel');

describe('Course Model Validation', () => {
    it('Shoud be invalid without title', (done) => {
        var course = new Course();
        course.validate((err) => {
            expect(err.errors.title).to.exist;
            done();
        });
    });
    it('Shoud be invalid without description', (done) => {
        var course = new Course();
        course.validate((err) => {
            expect(err.errors.description).to.exist;
            done();
        });
    })
});