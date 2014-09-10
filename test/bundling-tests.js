'use strict';
var chai = require('chai');
chai.Assertion.includeStack = true;
require('chai').should();
var expect = require('chai').expect;
var nodePath = require('path');
var util = require('./util');
var outputDir = nodePath.join(__dirname, 'build');
require('app-module-path').addPath(nodePath.join(__dirname, 'src'));
describe('raptor-optimizer/bundling', function() {
    beforeEach(function(done) {
        util.rmdirRecursive(outputDir);
        for (var k in require.cache) {
            if (require.cache.hasOwnProperty(k)) {
                delete require.cache[k];
            }
        }
        require('raptor-promises').enableLongStacks();
        require('raptor-logging').configureLoggers({
            'raptor-optimizer': 'WARN',
            'raptor-cache': 'WARN'
        });
        done();
    });
    it('should bundle correctly with recurseInto set to "all"', function(done) {
        var optimizer = require('../');
        var pageOptimizer = optimizer.create({
            fileWriter: {
                outputDir: outputDir,
                fingerprintsEnabled: false
            },
            enabledExtensions: ['jquery', 'browser'],
            bundles: [
                {
                    name: "foo",
                    dependencies: [
                        // Specified for a single dependency:
                        { path: "require: foo", recurseInto: "all" }
                    ]
                }
            ]
        }, nodePath.join(__dirname, 'test-bundling-project'), __filename);

        var writerTracker = require('./WriterTracker').create(pageOptimizer.writer);
        pageOptimizer.optimizePage({
                pageName: 'testPage',
                dependencies: [
                        'require: ./main'
                    ],
                from: nodePath.join(__dirname, 'test-bundling-project')
            },
            function(err, optimizedPage) {
                if (err) {
                    return done(err);
                }

                var fooCode = writerTracker.getCodeForFilename('foo.js');
                expect(fooCode).to.not.contain('[MAIN]');
                expect(fooCode).to.contain('[FOO]');
                expect(fooCode).to.contain('[FOO_INDEX]');
                expect(fooCode).to.contain('[BAR]');
                expect(fooCode).to.contain('[BAZ]');
                done();
            });
    });

    it('should bundle correctly with recurseInto set to "dir"', function(done) {
        var optimizer = require('../');
        var pageOptimizer = optimizer.create({
            fileWriter: {
                outputDir: outputDir,
                fingerprintsEnabled: false
            },
            enabledExtensions: ['jquery', 'browser'],
            bundles: [
                {
                    name: "foo",
                    dependencies: [
                        // Specified for a single dependency:
                        { path: "require: foo", recurseInto: "dir" }
                    ]
                }
            ]
        }, nodePath.join(__dirname, 'test-bundling-project'), __filename);

        var writerTracker = require('./WriterTracker').create(pageOptimizer.writer);
        pageOptimizer.optimizePage({
                pageName: 'testPage',
                dependencies: [
                        'require: ./main'
                    ],
                from: nodePath.join(__dirname, 'test-bundling-project')
            },
            function(err, optimizedPage) {
                if (err) {
                    return done(err);
                }

                var fooCode = writerTracker.getCodeForFilename('foo.js');
                expect(fooCode).to.not.contain('[MAIN]');
                expect(fooCode).to.not.contain('[FOO]');
                expect(fooCode).to.contain('[FOO_INDEX]');
                expect(fooCode).to.not.contain('[BAR]');
                expect(fooCode).to.not.contain('[BAZ]');
                done();
            });
    });

    it('should bundle correctly with recurseInto set to "dirtree"', function(done) {
        var optimizer = require('../');
        var pageOptimizer = optimizer.create({
            fileWriter: {
                outputDir: outputDir,
                fingerprintsEnabled: false
            },
            enabledExtensions: ['jquery', 'browser'],
            bundles: [
                {
                    name: "foo",
                    dependencies: [
                        // Specified for a single dependency:
                        { path: "require: foo", recurseInto: "dirtree" }
                    ]
                }
            ]
        }, nodePath.join(__dirname, 'test-bundling-project'), __filename);

        var writerTracker = require('./WriterTracker').create(pageOptimizer.writer);
        pageOptimizer.optimizePage({
                pageName: 'testPage',
                dependencies: [
                        'require: ./main'
                    ],
                from: nodePath.join(__dirname, 'test-bundling-project')
            },
            function(err, optimizedPage) {
                if (err) {
                    return done(err);
                }

                var fooCode = writerTracker.getCodeForFilename('foo.js');
                expect(fooCode).to.not.contain('[MAIN]');
                expect(fooCode).to.contain('[FOO]');
                expect(fooCode).to.contain('[FOO_INDEX]');
                expect(fooCode).to.contain('[BAR]');
                expect(fooCode).to.not.contain('[BAZ]');
                done();
            });
    });

    it('should bundle correctly with recurseInto set to "module"', function(done) {
        var optimizer = require('../');
        var pageOptimizer = optimizer.create({
            fileWriter: {
                outputDir: outputDir,
                fingerprintsEnabled: false
            },
            enabledExtensions: ['jquery', 'browser'],
            bundles: [
                {
                    name: "foo",
                    dependencies: [
                        // Specified for a single dependency:
                        { path: "require: foo", recurseInto: "module" }
                    ]
                }
            ]
        }, nodePath.join(__dirname, 'test-bundling-project'), __filename);

        var writerTracker = require('./WriterTracker').create(pageOptimizer.writer);
        pageOptimizer.optimizePage({
                pageName: 'testPage',
                dependencies: [
                        'require: ./main'
                    ],
                from: nodePath.join(__dirname, 'test-bundling-project')
            },
            function(err, optimizedPage) {
                if (err) {
                    return done(err);
                }

                var fooCode = writerTracker.getCodeForFilename('foo.js');
                expect(fooCode).to.not.contain('[MAIN]');
                expect(fooCode).to.contain('[FOO]');
                expect(fooCode).to.contain('[FOO_INDEX]');
                expect(fooCode).to.not.contain('[BAR]');
                expect(fooCode).to.not.contain('[BAZ]');
                done();
            });
    });
});