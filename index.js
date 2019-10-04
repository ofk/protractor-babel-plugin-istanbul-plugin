const fs = require('fs');
const path = require('path');
const _ = require('lodash-core');
const libCoverage = require('istanbul-lib-coverage');
const libReport = require('istanbul-lib-report');
const reports = require('istanbul-reports');

exports = module.exports = {
  setup() {
    const config = Object.assign({}, this.config);
    ['path', 'package', 'inline'].forEach((name) => {
      delete config[name];
    });

    const defaultConfig = {
      includeDir: './',
      reportDir: './coverage',
      reporter: ['text'],
      sourceFinder: null,
      saveCoverageMap: {
        enabled: false,
        path: './.localCoverageMap',
      },
    };

    this.coverageOpts = _.merge(defaultConfig, config);

    if (this.coverageOpts.saveCoverageMap.enabled && fs.existsSync(this.coverageOpts.saveCoverageMap.path)) {
      console.log("loading coverageMap from %s ...", this.coverageOpts.saveCoverageMap.path);
      const convMap = fs.readFileSync(this.coverageOpts.saveCoverageMap.path, 'utf8');
      this.coverageMap = libCoverage.createCoverageMap(JSON.parse(convMap));
    } else {
      this.coverageMap = libCoverage.createCoverageMap();
    }
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
    if (this.coverageOpts.saveCoverageMap.enabled) {
      console.log("saving coverageMap to %s ...", this.coverageOpts.saveCoverageMap.path);
      fs.writeFileSync(this.coverageOpts.saveCoverageMap.path, JSON.stringify(this.coverageMap, 'utf8'));
    }
  },
  async postTest() {
    const coverage = await browser.executeScript('return typeof __coverage__ === "undefined" ? {} : __coverage__;');
    this.coverageMap.merge(coverage);
    this.coverageMap.filter((filename) => !path.relative(this.coverageOpts.includeDir, filename).startsWith('..'));
  },
};
