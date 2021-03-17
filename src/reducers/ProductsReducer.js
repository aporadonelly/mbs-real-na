import { productsActionType } from '../actions/constants';
import { results } from './constants';

const initialState = {
    product: null,
    productList: [],
    totalProductCount: 0,
    error: {},
    categories: [],
    createSuccess: false,
    result: ''
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case productsActionType.FETCH_PRODUCTS_SUCCESS:
            return {
                ...state,
                productList: payload.results,
                totalProductCount: payload.count,
                result: results.SUCCESS
            };
        case productsActionType.CREATE_PRODUCTS_SUCCESS:
            return {
                ...state,
                product: payload,
                createSuccess: true
            };
        case productsActionType.FETCH_PRODUCTS_FAIL:
        case productsActionType.CREATE_PRODUCTS_FAIL:
        case productsActionType.FETCH_CATEGORY_FAIL:
            return {
                ...state,
                error: payload
            };
        case productsActionType.FETCH_CATEGORY_SUCCESS:
            return {
                ...state,
                categories: payload
            };
        case productsActionType.UPDATE_PRODUCT_STATE:
            return {
                ...state,
                [action.payload.prop]: action.payload.value
            };
        default:
            return state;
    }
}
