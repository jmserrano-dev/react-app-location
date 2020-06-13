import * as Yup from 'yup';
import Location from '../../../src/Location';

const integer = Yup.number().integer();
const wholeNbr = integer.positive();

export const HomeLocation = new Location({
     path: '/'
});

export const ItemListLocation = new Location({
    path: '/items',
    queryStringParamDefs: {
        isActive: Yup.boolean(),
        categoryID: wholeNbr.nullable()
    }
});

export const ItemLocation = new Location({
    path: '/items/:id',
    pathParamDefs: {
        id: wholeNbr.required()
    }
});

export default {
    Home: HomeLocation,
    ItemList: ItemListLocation,
    Item: ItemLocation,
};