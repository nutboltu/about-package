'use strict';
var async = require('async');
var typeChecker = require('typeco');
var request = require('request');

var REGISTRY_ENDPOINT = 'https://registry.npmjs.org';
var DOWNLOAD_COUNT_ENDPOINT = 'https://api.npmjs.org/downloads/point';
var GITHUB_API_ENDPOINT= 'https://api.github.com/repos';

function parseGithubUrl(url) {
  if (url.indexOf('github')) {
    var splits = url.split('/');
    return {
      username: splits[splits.length - 2],
      repos: splits[splits.length - 1].slice(0, -4),
    }
  }
  return null;
}

function getDownloadCounts(period, packageName, cb) {
  var downloadCountUrl = DOWNLOAD_COUNT_ENDPOINT + '/'+period+ '/' + packageName.toLowerCase();
  request(downloadCountUrl, function(error, response, body) {
    if(error) {
      return cb(new Error('Package doesn\'t exists'));
    }
    if(response && response.statusCode !== 200) {
      return cb(new Error('Error fetching information of this package'));
    }
    var downloadCountData = JSON.parse(body);
    cb(null, downloadCountData.downloads);
  });
}

module.exports = function(packageName, callback) {
  if(!typeChecker.isString(packageName) && !typeChecker.isFunction(callback)) {
     return callback(new Error('Invalid parameter'));   
  }
  const parallelSteps = [
    function getNPMDetails(cb) {
      var _registryUrl = REGISTRY_ENDPOINT+ '/' +packageName.toLowerCase();
      request(_registryUrl, function(error, response, body) {
        if(error) {
          return cb(new Error('Package doesn\'t exists'));
        }
        if(response && response.statusCode !== 200) {
          return cb(new Error('Error fetching information of this package'));
        }
    
        var npmDetails = JSON.parse(body);
        cb(null, npmDetails);
      });
    },
    function getLastDayDownloadCounts(cb) {
      const lastDay = 'last-day';
      getDownloadCounts(lastDay, packageName, cb);
    },
    function getLastWeekDownloadCounts(cb) {
      const lastWeek = 'last-week';
      getDownloadCounts(lastWeek, packageName, cb);
    },
    function getLastWeekDownloadCounts(cb) {
      const lastWeek = 'last-week';
      getDownloadCounts(lastWeek, packageName, cb);
    },
    function getLastMonthDownloadCounts(cb) {
      const lastMonth = 'last-month';
      getDownloadCounts(lastMonth, packageName, cb);
    },
  ];

  const waterFallSteps = [
    function getPackageInfo(cb) {
      async.parallel(parallelSteps, (err, results) => {
        if (err) return cb(err);
        var stableVersion = results[0][ 'dist-tags' ].latest;
        var info = {
          name: results[0].name,
          version: stableVersion,
          repository: results[0].versions[stableVersion].repository,
          description: results[0].description,
          license: results[0].license,
          downloads: {
            lastDay: results[1],
            lastWeek: results[2],
            lastMonth: results[3],
          }
           
        };
        cb(null, info);
      });
    },
    function getGitHubInfo(packageInfo, cb) {
      if (packageInfo.repository && packageInfo.repository.url) {
          var githubCredentials = parseGithubUrl(packageInfo.repository.url);
          delete packageInfo.repository;
          if(githubCredentials) {
            var githubEndpoint = GITHUB_API_ENDPOINT+'/'+githubCredentials.username+'/'+githubCredentials.repos;
            var options = {
              url: githubEndpoint,
              headers: {'user-agent': 'node.js'},
            }
            request(options, function(error, response, body) {
             if(!error && response && response.statusCode == 200) {
                var githubInfo = JSON.parse(body);
                packageInfo.github = {
                  stars: githubInfo.stargazers_count,
                  forks: githubInfo.forks,
                  openIssues: githubInfo.open_issues_count,
                  watchers: githubInfo.watchers_count,
                  lastUpdated: githubInfo.updated_at,
                  created: githubInfo.created_at,
                }
              }
              return cb(null, packageInfo);
            });
          } else cb(null, packageInfo);
      }
      else cb(null, packageInfo);
    }
  ]
  async.waterfall(waterFallSteps, callback);
}