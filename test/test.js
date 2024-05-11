//I Mocha grupperer vi tests ved hjælp af describe-funktionen og definerer
//tests ved hjælp af it-funktionen

const assert = require('assert');

describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});