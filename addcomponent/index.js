/**
 * Adds a new component to the project.
 * @module AddcomponentGenerator
 * @requires chalk
 * @requires mkdirp
 * @requires underscore.string
 * @requires yeoman-generator
 * @author mail@markus-falk.com
 */

'use strict';

var

chalk = require('chalk'),
mkdirp = require('mkdirp'),
string = require('underscore.string'),
yeoman = require('yeoman-generator'),

AddcomponentGenerator = yeoman.generators.NamedBase.extend({

  /**
   * Loads package.json and waits for callback to finish. Also tells user what happened and gives a little help.
   * @function init
   * @private
   */
  init: function () {

    this.pkg = this.fs.readJSON('package.json');

    this.on('end', function () {

      this.log('\n');

      if (this.ComponentType === 'standardModule') {
        this.log('Added component ' + this.name + ' to components/app/' + string.slugify(this.name));
        if(this.includeHTML) {
          this.log('You can use it in your HTML with ' + chalk.yellow('{app:{' + string.slugify(this.name) + '}}'));
        }
      } else {
        this.log('Added component ' + this.name + ' to components/app/_deferred/' + string.slugify(this.name));
        if(this.includeHTML) {
          this.log('You can use it in your HTML with ' + chalk.yellow('{deferred:{' + string.slugify(this.name) + '}}'));
        }
      }

      this.log('\n');
    });
  },

  /**
   * Converts user's answers into Booleans.
   * @function _hasFeature
   * @returns {Boolean} Is this feature wanted?
   * @private
   */
  _hasFeature: function (feature) {
    return this.features && this.features.indexOf(feature) !== -1;
  },

  /**
   * Asks user questions about the component.
   * @function askForApp
   * @private
   */
  askForApp: function () {
    var done = this.async();

    var prompts = [
      {
        type: 'list',
        name: 'ComponentType',
        message: 'What type of module would you like to add?',
        choices: [{
          name: 'Standard module (compiled to main file)',
          value: 'standardModule'
        },
        {
          name: 'Deferred module (dynamically loaded)',
          value: 'DeferredModule'
        }]
      },
      {
        type: 'checkbox',
        name: 'whatFiles',
        message: 'What assets do you need?',
        choices: [
          {
            name: 'HTML',
            value: 'includeHTML',
            checked: true
          },
          {
            name: 'SCSS',
            value: 'includeSCSS',
            checked: true
          },
          {
            name: 'JS',
            value: 'includeJS',
            checked: true
          },
          {
            name: 'QUnit Test',
            value: 'includeQUnit',
            checked: false
          }
        ]
      }
    ];

    this.prompt(prompts, function (answers) {

      this.features = answers.whatFiles;

      this.includeHTML = this._hasFeature('includeHTML');
      this.includeJS = this._hasFeature('includeJS');
      this.includeQUnit = this._hasFeature('includeQUnit');
      this.includeSCSS = this._hasFeature('includeSCSS');

      this.ComponentType = answers.ComponentType;

      done();
    }.bind(this));
  },

  /**
   * Set paths depending on user's answers.
   * @function setDefaults
   * @private
   */
  setDefaults: function () {

    if (this.ComponentType === 'standardModule') {
      this.directory = 'components/app/';
    } else {
      this.directory = 'components/app/_deferred/';
    }

  },

  /**
   * Add all wanted files to the new component.
   * @function addApp
   * @private
   */
  addApp: function () {

    // set path
    var
    path = this.directory + string.slugify(this.name);

    // create directory
    mkdirp.mkdirp(path);

    if (this.includeJS) {
      this.fs.copyTpl(
        this.templatePath('_component.js'),
        this.destinationPath(path + '/' + string.slugify(this.name) + '.js'),
        {
          class_name: string.classify(this.name),
          _name: string.underscored(this.name),
          slug_name: string.slugify(this.name)
        }
      );
    }

    // use underscored file name for standard modules
    var SCSSFile = path + '/_' + string.slugify(this.name) + '.scss';

    // use normal filename to render deferred file
    if(this.ComponentType === 'DeferredModule') {
      SCSSFile = path + '/' + string.slugify(this.name) + '.scss';
    }

    if (this.includeSCSS) {
      this.fs.copyTpl(
        this.templatePath('_component.scss'),
        this.destinationPath(SCSSFile),
        {
          slug_name: string.slugify(this.name)
        }
      );
    }

    if (this.includeHTML) {
      this.fs.copyTpl(
        this.templatePath('_component.html'),
        this.destinationPath(path + '/' + string.slugify(this.name) + '.html'),
        {
          slug_name: string.slugify(this.name)
        }
      );
    }

    if (this.includeQUnit) {
      this.fs.copyTpl(
        this.templatePath('_qunit-test.js'),
        this.destinationPath(path + '/test-' + string.slugify(this.name) + '.js'),
        {
          class_name: string.classify(this.name),
          slug_name: string.slugify(this.name)
        }
      );
    }
  },

  /**
   * Add the new component to the scss base file.
   * @function addStyling
   * @private
   */
  addStyling: function () {
    if (this.includeSCSS) {

      var path = 'components/' + this.pkg.name + '.scss';

      // also enable to use hidden scss with _
      // this way project-name.scss can be imported
      // for theming support

      if(!this.fs.exists(path)) {
        path = 'components/_' + this.pkg.name + '.scss';
      }

      var file = this.fs.read(path);

      if (this.ComponentType === 'standardModule') {
        file += '@import "app/' + string.slugify(this.name) + '/' + string.slugify(this.name) + '";\n';
      } else {
        file += '@import "app/_deferred/' + string.slugify(this.name) + '/' + string.slugify(this.name) + '";\n';
      }

      this.fs.write(path, file);
    }
  },

  /**
   * Add the new component to the requirejs config file.
   * @function addToRequireJS
   * @private
   */
  addToRequireJS: function () {

    if(this.includeJS) {

      var
      path = 'components/' + this.pkg.name + '.js',
      file = this.fs.read(path);

      if(this.includeJS) {
        var
        match = '//{{app}}',
        newcontent;

        if (this.ComponentType === 'standardModule') {
          newcontent = '//{{app}}\n    \'' + string.slugify(this.name) + '\': \'' + 'app/' + string.slugify(this.name) + '/'+ string.slugify(this.name) + '\',';
        } else {
          newcontent = '//{{app}}\n    \'' + string.slugify(this.name) + '\': \'' + 'app/_deferred/' + string.slugify(this.name) + '/'+ string.slugify(this.name) + '\',';
        }

        var newfile = file.replace(match, newcontent);
      }

      this.fs.write(path, newfile);

    }
  }

});

module.exports = AddcomponentGenerator;
