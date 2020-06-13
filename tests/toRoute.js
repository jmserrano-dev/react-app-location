import React from 'react';
import {  cleanup } from 'react-testing-library';

import Location from '../src/Location';

const Home = () => <div>Home</div>;
const NotFound = () => <div>No match</div>;

const HomeLocation = new Location({
    path: '/',
    invalid: NotFound
});

afterEach(cleanup);

test('errors when neither component, render nor children properties are provided', () => {
    jest.spyOn(global.console, "error").mockImplementation(() => { })
    HomeLocation.toRoute({ invalid: NotFound });
    expect(console.error).toBeCalled();
})

test('errors when invalid property is not provided', () => {
    jest.spyOn(global.console, "error").mockImplementation(() => { })
    HomeLocation.toRoute({ component: Home });
    expect(console.error).toBeCalled();
})

test('warning when children node is provided', () => {
    jest.spyOn(global.console, "error").mockImplementation(() => { })
    HomeLocation.toRoute({ children: <Home />, invalid: NotFound });
    expect(console.error).toBeCalled();
})
