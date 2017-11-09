var crypto = require("crypto");
var path = require("path");
var fs = require("fs");
var decrypt = require("../lib/request/decryption.js");

describe("encrypt and decrypt", () => {
  it("should encrypt a decryptable string", (done) => {
    var absolutePath = path.resolve('./key/public.pem');
    var publicKey = fs.readFileSync(absolutePath, "utf8");
    var buffer = new Buffer('hello');
    var encrypted = crypto.publicEncrypt({
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING
    }, buffer);
    var toDecrypt = encrypted.toString("base64");
    //console.log(toDecrypt);
    var absolutePath = path.resolve('./key/private.pem');
    var privateKey = fs.readFileSync(absolutePath, "utf8");
    var buffer = new Buffer(toDecrypt, "base64");
    var decrypted = crypto.privateDecrypt({
      key: privateKey,
      passphrase: "password",
      padding: crypto.constants.RSA_PKCS1_PADDING
    }, buffer);
    expect(decrypted.toString("utf8")).toBe('hello');
    //console.log( decrypted.toString("utf8"));
    done();
  })

  toDecrypt = {
    "orderinfo": {
      "firstName": "L2zZdgxsRed/NcX3X+Rs2tOOFr7xMxSvxciO9vzzDEUTYz7+9Wflm2WV94rtZQ1FMCJ6RCrQidOrF40qhfXrh6WWV96AmJ3CtnNqSrWc3CIkVXHUnoo4ntKKm7OdelUZlHpp+Wd+tf8j6PGJQMPBfqy2XZxLmwWHSHeM3sCUd0BF4Yv01VJLShrNUyeD508KJRAPkEZqUampZieIWNRPXP1ntWp8acjTl+BuVp7VUvaqk+S3RV9zdeHXPVNksVS0sVDM+Z80rxi2Y14tZBBQihlFaxwC7QsLTFkOqoq7mA8RHo+WWkJYTz9sc2HHGvIvTXsBKPzzDvZLg37VMDLgmw==",
      "lastName": "RkTlNnjZMiYdYNXxFE12EOp4ZrVYDEia5DAWB5mzTtV2AYOhSDrxQvZrcFTL9sr1gMqNQR9F7OIM2LOU1s6dB2JfbEia7kBEBSw/6G7vS1t4DXq/qBgkZXySlDzRpD0HKTc8CTApTE6NZwThNe7LEuRV/Hp39onuqktqvq8+nqUM6q91aaw38EjWLR+YZHCqrsdte2uda/gerzTEaTzP1VI5ldgEy1XzzePfmKB2zYobL1iWFzplrW8LxAJrXr+/89mRB/rPVUjFxhAiSUhFek20rbQtQ4Gor5q8jPkp5K10RF001zXKZzNpEtHQ9TnbtPpQrC/JdKF5gprPM9uPIw==",
      "phoneNumber": "FDJYYbg8hRVhTq+Yoa5q1N813DLU+JfIHtgqV6knFBXvO4KF/jRBDQFl0izsbquUzsze3+sgh0Z26j8EJ9GRXWr5EtEypS+QiYBLV78ngO2VUoMkxr8OEJqU5N5Bb2h8r0wZ9NfzGb7UAZ6WxxVB7+dtKaw4t/jn87hpM/V3iuXa2h3tMTZ0l1BIajsitk5G3fh/biQlTtxhirB5SXBPm8Xf/n1tHL7T0M+tfd1ZDq8SRVWpzVB+1Dwok4T19odjzXaSkaKoYOh/dahyZS/chu2qb3BurP64Fr4rL7NzYgQgq6beiCyWqfW99bjm4ubQwNMKxTHm5M2+sIqrL8nizQ==",
      "currency": "dJU0C/9Xo+ONV5InpbXpGyWJIN9BNMKGpiq/VgksvTxd7V1CKVzsPml0VAAeHWEPLecoXG2cp4tjCP0BKBcyE5akViR+b3/C7iuYQEmy+yf3EubtwPVjteVjDuU3bSb4KDAl7x9bZQcnzibr/SGhM6rjPMBgTGbg79soJgemVxvnhfeAXMGMTlYv9joxqI7SU3aJgNaTkGzpkC4eTtZ4VsJGtehkhg8XzFlAyPPhdXMMfS13EQH9T5fNKyWwPpIcgQe06mAUyxqhENKptPdVXc8Bcqxb2+nPWynIlxCVGbKY1Lb69EzxTxHvX56s8x12RF0jsgql9AAHCU/0wAkpnQ==",
      "price": "E0RR363KTzZUNNuRw4+V3OCmdUQK58hOMv4Lu0Pw08N8C6QvmBFhmVE9gyhBrISGWUa79pnOPe4YtRfd6AiYfpAnQAAjSbuH152Fj4w4xLQgJoeG4Iix31zjLRbDWJggL8Txp6BjW7S0ca1WYUNyYvaQtAUhTl2ZNa5iGWgD33t9ioFgR9fjtMAIssbsonX7DUPJm7FjdFmtgre96TzRH4hygfBJLXThAEFAP85e4CdUWN5EGIiL1dMCNXheLz5Od+oG0bbMdhFXMpNpBzt7LtaQiZxj51MLHtbHQXa8TOmoCxdjfJYFmxJ+K8e6Fim9bQeUr2c8CCS9zIGwlXu89w=="
    },
    "paymentinfo": {
      "cardholderName": "Ors9hOWJFdAEK179eRUeZciCEx6qsKVocXMV22Kbg3qr6V1bLHc3j1HdZQlveT6yx72WTdTIgmwclvKxjQHLtpQLUUglTvL9BmaWSYqQBTCH5TFCbK1f0yv6UmVR1hDp4nlsMEMRjeOCVExnK+h7+sJMx/UR6arDPW7H6CNld2ARPcgB9jW92eAcyUKn0UtgKq9OHj1LLANkw6fFpoOo8GGOKKv6mtfVvlSNsmevtEzwXVSViZZM/zoduSNvUnHYtMtIaaUqxOWCUqdArwbX+b6lNv8XhXnQmN7q3bou45rLN4Cil4CVtZDqIsbyF+E3cIkpUPIaGwbU3+ANPg2GMA==",
      "number": "acfRFrO10gVnvgky0TnQlx5eZMrX7E8j6aQyx5fpq9eobtHBOMgMorbZvWh2XXzo2NapObyKokGvwsCZLEJDkfVLRASfKn0pGMtgWtbC98TcYpyxc3VMW9aNQwEh1/iAovgT4av/3i//PPYigV8LdTl7y+PG5wwrgWHkz+cevQng3eRi3z1xACVivzO85gX3u9mnodZVwhSEF3YcCYRbV1bEyQ+75WAzC0AQ45TCjSjI/fNwLKo90GAOjbOze5gz1K5udXAVk/tHe7FSIMZR4J8Qqng9Ck3x8G4wk1srqhWslQowY9ZjUycBT6bDZ7LYxLmGZGVaXrDFI/C/nvnIfQ==",
      "expirationDate": "UH89T9HpW6Ykqz7O8A66Ef/xT5oT7NT0cuLaWs6CMMGVy02s5L7EJnhAzF+WMaHmVJfEIZzCrMweZxyH3g0iywbbdW2j+AOpFa644w+kUwjfzV8T3Q+BojC5UWfe8Lnias8fklcJ0L6/ZhUS1CvsnSJ5eTG0nvqpW4rlx3mgFsujXHRe9B0u08ilOyzHAJruBjvoUDREEPQrgLyYGQSoSTu6kNFTp/CJ5ISxHaj29XWKaWAwj2g/f3T7Tq1YedbTu30BbHpfzXrhvLMGTNb5XqR2uXn4zEVCeWtsF9VUQqBIP+m00r8QYSeadsjS7/wy/dbPWJ1WHBv2zqkpxwImpQ==",
      "cvv": "FjB4imj3RYOnNsBwi+Pxxl/XzQEvKSHlj6WGAolhFl6N1Op5bIVbTQpV5I87OU7t63Q1AD3XTjOhc5RoRYlfBxGjADkfYQ1hw3/VgHOte7PS6864qIUHhaYvdDjA/dhFkzLSCo2NU3OiW5h3vslFo+Ny0ZlWECXb+qEj5fE0q1HCSrA5IJxB3Nh7ti+WopOuHWDa5PL2M0LRcXZOCs+BJF/HOe4v21rN1LVdL2l0odSjr4sEAo+Qj0cG3ENyywgI9M3IXulCr45Xx6xVjt4hYx0gnuanYrSpOB1zB/1vS4btNJ2yP287B2N1ZljNubAam/GO/wBoIkSaw5+EaNUkDw=="
    }
  }

  it("should decrypt a unknow string", (done) => {
    let result = decrypt(toDecrypt);
    expect(result.orderinfo.firstName).toBe('a');
    expect(result.orderinfo.lastName).toBe('a');
    expect(result.orderinfo.phoneNumber).toBe('1');
    expect(result.orderinfo.currency).toBe('HKD');
    expect(result.orderinfo.price).toBe('1');
    expect(result.paymentinfo.cardholderName).toBe('c');
    expect(result.paymentinfo.number).toBe('41');
    expect(result.paymentinfo.expirationDate).toBe('11/');
    expect(result.paymentinfo.cvv).toBe('123');
    done();
  })
})