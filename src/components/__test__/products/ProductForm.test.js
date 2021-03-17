import 'jsdom-global/register';
import React from 'react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import toJson from 'enzyme-to-json';
import { act } from '@testing-library/react';
import MutationObserver from 'mutation-observer';
import { Close } from '@material-ui/icons';
import ProductForm from '../../products/ProductForm';
import WysiwygField from '../../WysiwygField';
import CustomErrorMessage from '../../CustomErrorMessage';

global.MutationObserver = MutationObserver;
global.DOMParser = window.DOMParser;

configure({ adapter: new Adapter() });

const mockStore = configureMockStore([thunk]);

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

let store;
beforeEach(() => {
    mockHistoryPush.mockClear();
    store = mockStore({
        products: {
            categories: [
                {
                    id: 1,
                    createdTimestamp: '2020-08-18T17:41:28Z',
                    lastModifiedTimestamp: '2020-08-18T17:41:28Z',
                    slug: 'loans',
                    label: 'Loans',
                    enabled: true
                },
                {
                    id: 2,
                    createdTimestamp: '2020-08-18T17:41:28Z',
                    lastModifiedTimestamp: '2020-08-18T17:41:28Z',
                    slug: 'casa',
                    label: 'Savings & Checking',
                    enabled: true
                },
                {
                    id: 3,
                    createdTimestamp: '2020-08-18T17:41:28Z',
                    lastModifiedTimestamp: '2020-08-18T17:41:28Z',
                    slug: 'time_deposit',
                    label: 'Time Deposit',
                    enabled: true
                }
            ]
        }
    });
    store.dispatch = jest.fn();
});

const findByTest = (wrapper, tag, val) => wrapper.find(`${tag}[data-testid="${val}"]`);

describe('Renders Product Form', () => {
    it('initial display of product form', () => {
        const formSubmitFunc = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <ProductForm onFormSubmit={formSubmitFunc} />
            </Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();

        expect(wrapper.find(Close).exists()).toBeFalsy();
        const submitButton = findByTest(wrapper, 'button', 'submit-btn');

        act(() => {
            submitButton.simulate('click');
        });
        wrapper.update();

        expect(formSubmitFunc.mock.calls.length).toBe(0);
        expect(wrapper.find(WysiwygField).length).toEqual(2);
        expect(wrapper.find(CustomErrorMessage).length).toBeGreaterThan(0);
    });

    it('handles add/remove requirement', () => {
        const formSubmitFunc = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <ProductForm onFormSubmit={formSubmitFunc} />
            </Provider>
        );

        const addRequirementButton = findByTest(wrapper, 'button', 'add-requirement-button');

        act(() => {
            addRequirementButton.simulate('click');
        });
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find(Close).exists()).toBeTruthy();
        expect(wrapper.find(WysiwygField).length).toEqual(3);

        const removeRequirementButton = findByTest(wrapper, 'button', 'remove-requirement-btn-0');

        act(() => {
            removeRequirementButton.simulate('click');
        });
        wrapper.update();

        expect(wrapper.find(Close).exists()).toBeFalsy();
        expect(wrapper.find(WysiwygField).length).toEqual(2);
    });

    it('handles field updates', () => {
        const formSubmitFunc = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <ProductForm onFormSubmit={formSubmitFunc} />
            </Provider>
        );

        const submitButton = findByTest(wrapper, 'button', 'submit-btn');
        const productNameField = findByTest(wrapper, 'TextValidator', 'product-name');

        act(() => {
            productNameField.simulate('change', { target: { value: 'TEST PRODUCT NAME' } });
            submitButton.simulate('click');
        });
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(formSubmitFunc.mock.calls.length).toBe(0);
        expect(wrapper.find(Close).exists()).toBeFalsy();
        expect(wrapper.find(WysiwygField).length).toEqual(2);
    });

    it('handles back button', () => {
        const formSubmitFunc = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <ProductForm onFormSubmit={formSubmitFunc} />
            </Provider>
        );

        const backButton = findByTest(wrapper, 'button', 'back-btn');

        act(() => {
            backButton.simulate('click');
        });
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(mockHistoryPush.mock.calls[0][0]).toBe('/products');
    });
    it('handles cancel button', () => {
        const formSubmitFunc = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <ProductForm onFormSubmit={formSubmitFunc} />
            </Provider>
        );

        const cancelButton = findByTest(wrapper, 'button', 'cancel-btn');

        act(() => {
            cancelButton.simulate('click');
        });
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(mockHistoryPush.mock.calls[0][0]).toBe('/products');
    });

    it('handles valid form submit', () => {
        const formSubmitFunc = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <ProductForm onFormSubmit={formSubmitFunc} />
            </Provider>
        );

        const productNameField = findByTest(wrapper, 'TextValidator', 'product-name');
        const productTypeIdField = findByTest(wrapper, 'SelectValidator', 'product-type-id');
        const descriptionField = findByTest(wrapper, 'WysiwygField', 'description');
        const requirementNameField = findByTest(wrapper, 'TextValidator', 'requirement-name-0');
        const requirementDescriptionField = findByTest(
            wrapper,
            'WysiwygField',
            'requirement-description-0'
        );
        // const productsForm = findByTest(wrapper, 'ValidatorForm', 'products-form');

        act(() => {
            productNameField.simulate('change', { target: { value: 'TEST PRODUCT NAME' } });
            productTypeIdField.simulate('change', { target: { value: 1 } });
            descriptionField.simulate('change', 'DESCRIPTION');
            requirementNameField.simulate('change', { target: { value: 'TEST REQUIREMENT NAME' } });
            requirementDescriptionField.simulate('change', 'REQUIREMENT DESCRIPTION');
            // productsForm.simulate('submit', [jest.fn()]);
        });

        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
