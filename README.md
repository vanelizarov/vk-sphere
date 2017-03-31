# gulp-react-es6-sass

My custom gulp configuration file to bundle sass and js files with React and ES6 syntax

## How to use it
Clone repository, then `cd` in directory, in which you've cloned the files and then install dependencies:

```
git clone https://github.com/vanelizarov/gulp-react-es6-sass.git [dir]
cd [dir]
npm install
```

### Available scripts

* `npm run bundle` - create production bundle
* `npm run watch` - bundle, then wathc and rebundle, if anything changes

### Settings

In `gulpfile.babel.js` under imports you can see two Javascript objects:
###### dirs
Project directories. Assuming you have similar project structure:

```
project
|-- src
|   |-- scss
|   |   |-- index.scss
|   |
|   |-- js
|	    |-- index.js
|
|-- static
|
|-- package.json
|-- .babelrc
|-- gulpfile.babel.js
```

So, the `dirs` object contains names of source files folder and bundled files folder. They act like some kind of prefixes.


###### config
Configuration for input/output

- `entry` - entry filename to process
- `output` - output filename
- `src` - full name of folder, that contains source files
- `dest` - full name of folder, that contains bundle files

### Tasks

* `js` - process js files
* `sass` - process sass files

This Gulpfile is using:
* `Autoprefixer`
* `UglifyJS`
* `CleanCSS`

If you don't need them as well as the other tools, like sourcemaps, you might want to remove the corresponding pipes from tasks.
In future, I will release a version with option to disable some features.
