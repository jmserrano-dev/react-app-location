import React from 'react';
import { Route, matchPath } from 'react-router';
import { Link } from 'react-router-dom';
import warning from 'warning';

import LocationCore from 'app-location';
import { parseQueryString } from './parseUtils';

function isEmptyChildren(children) {
    return React.Children.count(children) === 0;
};

export default class Location extends LocationCore {
    _invalid = null;

    constructor(params) {
        super(params.path, params.pathParamDefs, params.queryStringParamDefs);
        this._invalid = params.invalid;
    }

    toLink(children, params, props = {}) {
        warning(!props.to, 'toLink props should not include a to prop; it will be overwritten');
        const linkProps = {
            ...props,
            to: this.toUrl(params),
        };
        return <Link {...linkProps}>{children}</Link>;
    }

    toRoute(params) {          
        const { component, render, children, exact, strict, sensitive } = params;

        warning(component || render || children, 'Location.toRoute requires renderOptions argument, which must include either component, render or children property');
        warning(this._invalid, 'Location.toRoute requires renderOptions argument, which must include an invalid property, indicating the component to render when the a matched location contains an invalid parameter');

        const routeProps = {
            path: this.path,
            exact,
            strict,
            sensitive,
        };

        const getPropsWithParams = props => {
            const { location, match } = props;
            const tokens = this.parseLocationParams(location, match);
            if (tokens === null) {
                return null;
            }
            //todo: warn about collisions between route params and qs params
            return {
                ...props,
                ...tokens,
            };
        }

        if (component) {
            return <Route {...routeProps} render={props => {
                const propsWithParams = getPropsWithParams(props)
                if (propsWithParams === null) {
                    //schema validation error ocurred, render Invalid component
                    return React.createElement(this._invalid);
                }
                return React.createElement(component, propsWithParams);
            }} />
        } else if (render) {
            return <Route {...routeProps} render={props => {
                const propsWithParams = getPropsWithParams(props)
                if (propsWithParams === null) {
                    //schema validation error ocurred, render Invalid component
                    return React.createElement(this._invalid);
                }
                return render(propsWithParams);
            }} />
        } else if (typeof children === "function") {
            return <Route {...routeProps} children={props => {
                const { match } = props;
                if (match) {
                    const propsWithParams = getPropsWithParams(props)
                    if (propsWithParams === null) {
                        //schema validation error ocurred, render Invalid component
                        return React.createElement(this._invalid);
                    }
                    return children(propsWithParams);
                } else {
                    return children(props);
                }
            }} />
        } else if (children && !isEmptyChildren(children)) {
            warning(false, 'Location params are not passed as props to children arrays. Use a children function prop if needed.');
            return <Route {...routeProps} children={children} />
        }
    }

    parseLocationParams(
        location = (window && window.location),
        match = matchPath(location.pathname, { path: this.path })
    ) {
        warning(location, 'location must be explicitly provided when window object is not available.');
        warning(location.pathname != undefined && location.search != undefined, 'location object must include pathname and search properties.');
        warning(location.pathname, 'location.pathname is required.');

        if (!match) {
            return null;
        }

        try {
            if (!this._paramSchema) {
                return {};
            }

            const rawParams = {
                ...match.params,
                ...parseQueryString(location.search),
            };
            return this._paramSchema.validateSync(rawParams);
        } catch (err) {
            const { name, errors } = err;
            if (name === 'ValidationError') {
                warning(false, `Location.parseLocationParams: ${errors[0]}`);
            } else {
                throw err;
            }
            return null;
        }
    }

    toUrlEndingIn(params) {
        const newParams = { ...params, anyPath: window.location.pathname };
        return this.toUrl(newParams)
                   .replaceAll("%2F", "/")
                   .replace("//", "/");
    };

    toUrlWithState(params, state) {
        return { path: this.toUrl(params), state };
    };
}
