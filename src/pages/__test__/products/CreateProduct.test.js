import 'jsdom-global/register';
import React from 'react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { Provider } from 'react-redux';
import { configure, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MutationObserver from 'mutation-observer';
import { PageHeader, ProductForm } from '../../../components';
import CreateProduct from '../../products/CreateProduct';

global.MutationObserver = MutationObserver;
global.DOMParser = window.DOMParser;

configure({ adapter: new Adapter() });
jest.unmock('react-redux');

const mockStore = configureMockStore([thunk]);

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

describe('renders Product Page', () => {
    it('initial view', () => {
        const store = mockStore({
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
                ],
                productList: [],
                createSuccess: false
            }
        });
        const wrapper = mount(
            <Provider store={store}>
                <CreateProduct />
            </Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find(PageHeader).exists()).toMatchSnapshot();
        expect(wrapper.find(PageHeader).exists()).toBeTruthy();
        expect(wrapper.find(ProductForm).exists()).toMatchSnapshot();
        expect(wrapper.find(ProductForm).exists()).toBeTruthy();
        expect(mockHistoryPush.mock.calls.length).toBe(0);
    });

    it('successful creation', () => {
        const store = mockStore({
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
                ],
                createSuccess: true,
                productList: []
            }
        });
        const wrapper = mount(
            <Provider store={store}>
                <CreateProduct />
            </Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find(PageHeader).exists()).toMatchSnapshot();
        expect(wrapper.find(PageHeader).exists()).toBeTruthy();
        expect(wrapper.find(ProductForm).exists()).toMatchSnapshot();
        expect(wrapper.find(ProductForm).exists()).toBeTruthy();
        expect(mockHistoryPush.mock.calls.length).toBe(1);
        expect(mockHistoryPush.mock.calls[0][0]).toBe('/products');
    });
});
