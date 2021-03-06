var assert = require('assert');
var compatBrowser = require('../browser')
var fixtures = require('./fixtures')
runTests(compatBrowser, 'JavaScript pbkdf2');

// SHA-1 vectors generated by Node.js
// SHA-256/SHA-512 test vectors from:
// https://stackoverflow.com/questions/5130513/pbkdf2-hmac-sha2-test-vectors
// https://stackoverflow.com/questions/15593184/pbkdf2-hmac-sha-512-test-vectors
function runTests(compat, name) {
  describe(name, function () {
    var algos = ['sha1', 'sha224', 'sha256',  'sha384', 'sha512'];
    describe('pbkdf2-compat', function() {
      it('defaults to sha1 and handles buffers', function(done) {
        var result = compat.pbkdf2(new Buffer('password'), new Buffer('salt'), 1, 32, function (err, result) {
          assert.equal(result.toString('hex'), "0c60c80f961f0e71f3a9b524af6012062fe037a6e0f0eb94fe8fc46bdc637164")
          done();
        });
      })
      describe('pbkdf2', function() {
        ;algos.forEach(function(algorithm) {
          describe(algorithm, function() {
            fixtures.valid.forEach(function(f, i) {
              var expected = f.results[algorithm]

              it('Async test case ' + i + ' for ' + algorithm + ' matches ' + expected, function(done) {
                compat.pbkdf2(f.key, f.salt, f.iterations, f.dkLen, algorithm, function(err, result) {
                  assert.equal(result.toString('hex'), expected)

                  done()
                })
              })
            })

            fixtures.invalid.forEach(function(f) {
              it('should throw ' + f.exception, function() {
                assert.throws(function() {
                  compat.pbkdf2(f.key, f.salt, f.iterations, f.dkLen, f.algo, function (){})
                }, new RegExp(f.exception))
              })
            })
          })
        })

        it('should throw if no callback is provided', function() {
          assert.throws(function() {
            compat.pbkdf2('password', 'salt', 1, 32, 'sha1')
          }, /No callback provided to pbkdf2/)
        })
      })

      describe('pbkdf2Sync', function() {
        it('defaults to sha1', function() {
          var result = compat.pbkdf2Sync('password', 'salt', 1, 32)

          assert.equal(result.toString('hex'), "0c60c80f961f0e71f3a9b524af6012062fe037a6e0f0eb94fe8fc46bdc637164")
        })

        ;algos.forEach(function(algorithm) {
          describe(algorithm, function() {
            fixtures.valid.forEach(function(f, i) {
              var expected = f.results[algorithm]

              it('Test case ' + i + ' for ' + algorithm + ' matches ' + expected, function() {
                var result = compat.pbkdf2Sync(f.key, f.salt, f.iterations, f.dkLen, algorithm)

                assert.equal(result.toString('hex'), expected)
              })
            })

            fixtures.invalid.forEach(function(f) {
              it('should throw ' + f.exception, function() {
                assert.throws(function() {
                  compat.pbkdf2Sync(f.key, f.salt, f.iterations, f.dkLen, f.algo)
                }, new RegExp(f.exception))
              })
            })
          })
        })
      })
    })
  })
}
