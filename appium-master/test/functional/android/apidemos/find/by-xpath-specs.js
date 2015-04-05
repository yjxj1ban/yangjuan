"use strict";

var setup = require("../../../common/setup-base")
  , desired = require("../desired")
  , atv = 'android.widget.TextView'
  , alv = 'android.widget.ListView'
  ;

describe("apidemo - find - by xpath", function () {

  var driver;
  setup(this, desired).then(function (d) { driver = d; });

  var f = "android.widget.FrameLayout";
  var l = alv;
  var t = atv;

  before(function (done) {
    driver.sleep(2000).nodeify(done);
  });

  it('should throw with status 7 when matching nothing', function (done) {
    driver
      .elementByXPath('//whatthat')
      .should.be.rejectedWith(/status: 7/)
      .nodeify(done);
  });

  it('should throw with status 7 for hierarchy root', function (done) {
    driver
      .elementByXPath('/*')
      .should.be.rejectedWith(/status: 7/)
      .nodeify(done);
  });


  it('should find element by type', function (done) {
    driver
      .elementByXPath('//' + t).text()
        .should.become("API Demos")
      .nodeify(done);
  });
  it('should find element by text', function (done) {
    driver
      .elementByXPath("//" + t + "[@text='Accessibility']").text()
        .should.become("Accessibility")
      .nodeify(done);
  });
  // This test verifies a specific XPath issue has been resolved.
  // https://github.com/appium/appium/pull/3730
  it('should find exactly one element via elementsByXPath', function (done) {
    driver
      .elementsByXPath("//" + t + "[@text='Accessibility']").then(function (els) {
        els.length.should.equal(1);
        els[0].text().should.become("Accessibility");
      })
      .nodeify(done);
  });
  it('should find element by partial text', function (done) {
    driver
      .elementByXPath("//" + t + "[contains(@text, 'Accessibility')]").text()
        .should.become("Accessibility")
      .nodeify(done);
  });
  it('should find the last element', function (done) {
    driver
      .elementByXPath("(//" + t + ")[last()]").text()
      .then(function (text) {
        ["OS", "Text", "Views", "Preference"].should.include(text);
      }).nodeify(done);
  });
  it('should find element by xpath index and child @skip-ci', function (done) {
    driver
      .elementByXPath("//" + f + "[2]/" + l + "[1]/" + t + "[4]").text()
        .should.become("App")
      .nodeify(done);
  });
  it('should find element by index and embedded desc', function (done) {
    driver
      .elementByXPath("//" + f + "//" + t + "[5]").text()
        .should.become("Content")
      .nodeify(done);
  });
  it('should find all elements', function (done) {
    driver
      .elementsByXPath("//*").then(function (els) {
        els.length.should.be.above(2);
      })
      .nodeify(done);
  });
  it('should find the first element when searching for all elements', function (done) {
    driver
      .elementByXPath("//*").then(function (el) {
        return el.should.be.ok;
      })
      .nodeify(done);
  });
  it('should find less elements with compression turned on', function (done) {
    var getElementsWithoutCompression = function () {
      return driver.updateSettings({"ignoreUnimportantViews": false}).elementsByXPath("//*");
    };
    var getElementsWithCompression    = function () {
      return driver.updateSettings({"ignoreUnimportantViews": true }).elementsByXPath("//*");
    };

    var elementsWithoutCompression, elementsWithCompression;

    getElementsWithoutCompression()
    .then(function (els) {
      elementsWithoutCompression = els;
      return getElementsWithCompression();
    })
    .then(function (els) {
      elementsWithCompression = els;
    })
    .then(function () {
      return elementsWithoutCompression.length.should.be.greaterThan(elementsWithCompression.length);
    })
    .nodeify(done);
  });
});
