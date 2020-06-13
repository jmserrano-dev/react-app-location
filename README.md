# @jmserrano/react-app-location

Declarative locations for <a href="https://facebook.github.io/react">React</a> apps. Avoids repetition with Routes and Links, and reduces boilerplate with parsing and casting parameters from URLs.

This package depends on React Router 4. If you are not using React Router 4, take a look at [app-location](https://github.com/bradstiff/app-location), which is router-agnostic.


## Install
`npm i @jmserrano/react-app-location --save`

## Improvements
This is a fork from [Original Repo](https://github.com/bradstiff/react-app-location). I have developed the following new features:
* Added [babel-plugin-dev-expression](https://www.npmjs.com/package/babel-plugin-dev-expression) to bypass warning messages in production mode
* Added types for Typescript
* Added other methods to API
    * toUrlEndingIn
    * toDefaultRoute
    * toUrlWithState

## Usage
A `Location` is an endpoint that your app supports.  It specifies a path, and can optionally specify path and query string parameters. 

A `Location` keeps your code DRY as the `Location` is defined in one place and used throughout your code to generate `Routes`, `Links` and URLs. 

When generating a `Link` or URL, you can provide a literal object of values, and the values will be mapped to path and query string parameters and inserted into the resulting URL.

Path and query string parameters are specified as Yup schemas. A `Route` that is generated from a `Location` automatically parses the URL and extracts 
the path and query string parameters. These are validated according to the schema, cast to the appropriate data types, and passed as props to your 
component.  If a required parameter is missing or a parameter fails validation, the `Route` will render the specified `<Invalid />` component. 
This eliminates a boatload of boilerplate.

```javascript
import React from "react";
import { Link, BrowserRouter, Switch, Route } from 'react-router-dom';
import * as Yup from 'yup';
import Location from "@jmserrano/react-app-location";

const HomeLocation = new Location('/');
const ArticleLocation = new Location('/articles/:id', { id: Yup.number().integer().positive().required() });

const App = () => (
    <BrowserRouter>
        <Switch>
            {/* Regular Route */}
            <Route path={HomeLocation.path} component={Home} exact />
            {/* Route with params automatically passed as props to your component */}
            {ArticleLocation.toRoute({ component: Article, invalid: NotFound }, true)}
            <Route component={NotFound} />
        </Switch>
    </BrowserRouter>
);

const Home = () => (
    <div>
        <header>Articles</header>
        <ul>
            {/* <Link to={'/articles/1'}>Article 1</Link> */}
            <li>{ArticleLocation.toLink('Article 1', {id: 1})}</li>
            {/* <Link to={'/articles/2'}>Article 2</Link> */} 
            <li>{ArticleLocation.toLink('Article 2', {id: 2})}</li> 
            {/* Also works */}
            <li><Link to={ArticleLocation.toUrl({id: 3})}>Article 3</Link></li>  
            {/* Clicking results in <NotFound /> */}
            <li><Link to={ArticleLocation.toUrl({id: 'oops-not-an-int'})}>Article 4</Link></li>  
            {/* Also results in <NotFound /> */}
            <li><Link to={'/articles/oops-not-an-int'}>Article 5</Link></li>  
        </ul>
    </div>
);

//id has been parsed from the URL, cast to int, and merged into props
const Article = ({id}) => <header>`Article ${id}`</header>;

const NotFound = () => (
    <div>
        <header>Page not found</header>
        <p>Looks like you have followed a broken link or entered a URL that does not exist on this site.</p>
    </div>
);
```

## API
**`Location.ctor(path: string, pathParamDefs: ?schema, queryStringParamDefs: ?schema): Location`**

Defines a `Location`. pathParamDefs and queryStringParamDefs are optional and specified as Yup schemas.

**`Location.toUrl(params: ?object): string`**

Builds a URL with param values plugged in.

**`Location.toLink(children: func || node, params: ?object, props: ?object): element`**

Generates a React Router 4 `Link` passing the generated URL as the `to` prop.

<pre><strong>Location.toRoute(
	renderOptions: {
		component: ?func, 
		render: ?func, 
		children: ?func || ?node, 
		invalid: func
	}, 
	exact: bool = false, 
	strict: bool = false, 
	sensitive: bool = false
): element</strong></pre>

Generates a React Router 4 `Route` which parses params and passes them as props to your component. 

**`Location.path: string`**

Returns the path property which you can use when building a Route by hand, e.g., without params passed as props.

**`Location.parseLocationParams(location: object = window.location, ?match: object) : object`**

Returns a literal object containing the parameters parsed from the React Router 4 `location` (or window.location) and `match` (optional) props. Each parameter is validated and cast to the data type indicated in the schema. If validation fails, returns null.

You can manually call `parseLocationParams` from within your component to get the location parameters if you prefer to not use the automatic param parsing and prop injection provided by `Location.toRoute`.

**`Location.isValidParams(params: ?object): boolean`**

Returns a boolean indicating if the parameters are valid.

## Try it out
### Online
[Demo](https://bradstiff.github.io/react-app-location/)

### Local
1. `git clone https://github.com/bradstiff/react-app-location.git`
2. `cd react-app-location`
3. `npm install`
4. `npm start`
5. Browse to http://localhost:3001

## Contribute
You're welcome to contribute to react-app-location.

To set up the project:

1.  Fork and clone the repository
2.  `npm install`

The project supports three workflows, described below.

### Developing, testing and locally demoing the component
Source and tests are located in the /src and /test folders.  

To test: `npm run test`.

To run the demo, `npm start`.  The demo can be seen at http://localhost:3001 in watch mode.

### Publishing the module to npm
`npm publish`

This will use babel to transpile the component source, and publish the component and readme to npm.

### Publishing the demo to github-pages
`npm run publish-demo`

This will build a production version of the demo and publish it to your github-pages site, in the react-app-location directory. 

Note that webpack.config is set up to handle the fact the demo lives in a directory.

Also note that github-pages does not support routers that use HTML5 pushState history API.  There are special scripts added to index.html and 404.html to redirect server requests for nested routes to the home page.