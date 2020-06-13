import React from 'react';
import { render, fireEvent, cleanup } from 'react-testing-library';
import * as Yup from 'yup';

import Location from '../src/Location';

afterEach(cleanup);

const isNullableDate = Yup.string().test('is-date', '${path}:${value} is not a valid date', date => !date || !isNaN(Date.parse(date)));
const integer = Yup.number().integer();
const naturalNbr = integer.moreThan(-1);
const wholeNbr = integer.positive();

test('constructs with no params', () => {
    const HomeLocation = new Location({ path: '/' });
    expect(HomeLocation).toBeDefined();
    expect(HomeLocation.path).toMatch('/');
})

test('constructs with path params', () => {
    const ResourceLocation = new Location({ 
        path: '/resources/:id',
        pathParamDefs: { id: wholeNbr.required() }
    });
    expect(ResourceLocation).toBeDefined();
    expect(ResourceLocation.path).toMatch('/resources/:id');
})

test('constructs with query string params', () => {
    const ResourceListLocation = new Location({
        path: '/resources',
        queryStringParamDefs: {
            typeID: wholeNbr.required(),
            page: naturalNbr.default(0),
            rowsPerPage: Yup.number().oneOf([25, 50, 75, 100]).default(25),
            order: Yup.string().oneOf(['asc', 'desc']).default('asc'),
            isActive: Yup.boolean(),
            categoryID: wholeNbr.nullable(),
        }
    });
    expect(ResourceListLocation).toBeDefined();
    expect(ResourceListLocation.path).toMatch('/resources');
})


