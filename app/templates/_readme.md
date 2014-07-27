# <%= ProjectName %><% if (oldIE) { %>

## Browser Support (IE)

This project supports IE8!<% } %>

## Team

Project manager: <%= ProjectManager %>
Designer: <%= GraphicDesigner %>
HTML developer: <%= HTMLDeveloper %>

## Usage

This is a kickstarted project (https://github.com/markusfalk/generator-kickstart).

Install Yeoman & kickstart generator ([Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started))

```bash
$ npm install -g yo
$ npm install -g generator-kickstart
```

Start a new project.
```bash
$ yo kickstart
```

Adding a module to app/.
```bash
$ yo kickstart:addcomponent
```

Adding a Bower package.
```bash
$ yo kickstart:addbower
```

## Requirements

* [npm](https://npmjs.org)
* [Yeoman](http://yeoman.io)
* [Grunt](http://gruntjs.com)
* [Bower](http://bower.io)