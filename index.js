const path = require('path');
const libCoverage = require('istanbul-lib-coverage');
const libReport = require('istanbul-lib-report');
const reports = require('istanbul-reports');

exports = module.exports = {
  setup() {
    const config = Object.assign({}, this.config);
    ['path', 'package', 'inline'].forEach((name) => {
      delete config[name];
    });

    this.coverageOpts = Object.assign({
      includeDir: './',
      reportDir: './coverage',
      reporter: ['text'],
      sourceFinder: null,
    }, config);
    this.coverageMap = libCoverage.createCoverageMap();
  },
  teardown() {
    const context = libReport.createContext({
      dir: this.coverageOpts.reportDir,
      sourceFinder: this.coverageOpts.sourceFinder,
    });
    const tree = libReport.summarizers.pkg(this.coverageMap);
    this.coverageOpts.reporter.forEach((report) => {
      tree.visit(reports.create(report), context);
    });
  },
  async postTest() {
    const coverage = await browser.executeScript('return typeof __coverage__ === "undefined" ? {} : __coverage__;');
    this.coverageMap.merge(coverage);
    this.coverageMap.filter((filename) => !path.relative(this.coverageOpts.includeDir, filename).startsWith('..'));
  },
};
