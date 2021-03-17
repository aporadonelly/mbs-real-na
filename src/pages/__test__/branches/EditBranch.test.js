import 'jsdom-global/register';
import React from 'react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { Provider } from 'react-redux';
import { configure, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { BranchForm, PageHeader } from '../../../components';
import EditBranch from '../../branches/EditBranch';

configure({ adapter: new Adapter() });
jest.unmock('react-redux');

const mockStore = configureMockStore({ thunk });

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        push: mockHistoryPush
    }),
    useParams: () => ({
        id: 1
    })
}));

describe('renders Branches Page', () => {
    it('initial view', () => {
        const store = mockStore({
            address: {
                result: '',
                message: '',
                error: {},
                provinceList: [
                    {
                        id: 1,
                        provinceName: 'Abra',
                        country: 1
                    },
                    {
                        id: 2,
                        provinceName: 'Agusan del Norte',
                        country: 1
                    },
                    {
                        id: 3,
                        provinceName: 'Agusan del Sur',
                        country: 1
                    }
                ],
                cityList: [
                    {
                        id: 17,
                        cityName: 'Bengued',
                        province: 1
                    },
                    {
                        id: 2,
                        cityName: 'Boliney',
                        province: 1
                    },
                    {
                        id: 19,
                        cityName: 'Bucay',
                        province: 1
                    }
                ]
            },
            branch: {
                branchList: [
                    {
                        id: 1,
                        schedules: [
                            {
                                bankingDays: ['Monday', 'Tuesday', 'Wednesday'],
                                bankingHoursFrom: '8:00',
                                bankingHoursTo: '9:00'
                            },
                            {
                                bankingDays: ['Monday'],
                                bankingHoursFrom: '8:00',
                                bankingHoursTo: '10:00'
                            },
                            {
                                bankingDays: ['Saturday', 'Sunday'],
                                bankingHoursFrom: '8:00',
                                bankingHoursTo: '10:00'
                            }
                        ],
                        branchName: 'branch',
                        locationStreet: 'khgjhgjhg',
                        locationProvinceOrState: {
                            id: 1,
                            provinceName: 'Abra',
                            country: 1
                        },
                        locationCity: {
                            id: 1,
                            cityName: 'Caloocan City',
                            province: 82
                        },
                        locationPostalOrZipCode: 0,
                        email: 'asd@asd.com',
                        phone: '(123)12123, (123)123123',
                        mobile: '+639175240823',
                        latitude: '11.0000000000',
                        longitude: '11.0000000000',
                        landmark: 'jkhkjh'
                    }
                ],
                totalBranchItems: 20,
                result: '',
                message: '',
                error: {},
                isCreateSuccess: false,
                isDeleteSuccess: false,
                specificBranch: {
                    id: 1,
                    schedules: [
                        {
                            bankingDays: ['Monday', 'Thursday', 'Friday', 'Saturday'],
                            bankingHoursFrom: '08:00',
                            bankingHoursTo: '20:00'
                        }
                    ],
                    branchName: 'Mandaluyong Branch',
                    locationStreet: 'Csp Building 173 Edsa',
                    locationProvinceOrState: {
                        id: 82,
                        createdTimestamp: '2020-08-18T17:41:28Z',
                        lastModifiedTimestamp: '2020-08-18T17:41:28Z',
                        provinceName: 'Metro Manila',
                        country: 1
                    },
                    locationCity: {
                        id: 5,
                        createdTimestamp: '2020-08-18T17:41:28Z',
                        lastModifiedTimestamp: '2020-08-18T17:41:28Z',
                        cityName: 'Mandaluyong City',
                        province: 82
                    },
                    locationPostalOrZipCode: 1550,
                    email: 'asd@asd.com',
                    phone: '(123)12313, (123)12313, (123)12313, (123)12313',
                    mobile: '9175240823',
                    latitude: '1.0000000000000000',
                    longitude: '1.0000000000000000',
                    createdTimestamp: '2021-03-05T12:16:16.927324Z',
                    lastModifiedTimestamp: '2021-03-05T12:16:16.927335Z',
                    landmark: ''
                },
                isEditSuccess: false
            }
        });
        const wrapper = mount(
            <Provider store={store}>
                <EditBranch />
            </Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find(PageHeader).exists()).toMatchSnapshot();
        expect(wrapper.find(PageHeader).exists()).toBeTruthy();
        expect(wrapper.find(BranchForm).exists()).toMatchSnapshot();
        expect(wrapper.find(BranchForm).exists()).toBeTruthy();
    });

    it('successful update', () => {
        const store = mockStore({
            address: {
                result: '',
                message: '',
                error: {},
                provinceList: [
                    {
                        id: 1,
                        provinceName: 'Abra',
                        country: 1
                    },
                    {
                        id: 2,
                        provinceName: 'Agusan del Norte',
                        country: 1
                    },
                    {
                        id: 3,
                        provinceName: 'Agusan del Sur',
                        country: 1
                    }
                ],
                cityList: [
                    {
                        id: 17,
                        cityName: 'Bengued',
                        province: 1
                    },
                    {
                        id: 2,
                        cityName: 'Boliney',
                        province: 1
                    },
                    {
                        id: 19,
                        cityName: 'Bucay',
                        province: 1
                    }
                ]
            },
            branch: {
                branchList: [
                    {
                        id: 1,
                        schedules: [
                            {
                                bankingDays: ['Monday', 'Tuesday', 'Wednesday'],
                                bankingHoursFrom: '8:00',
                                bankingHoursTo: '9:00'
                            },
                            {
                                bankingDays: ['Monday'],
                                bankingHoursFrom: '8:00',
                                bankingHoursTo: '10:00'
                            },
                            {
                                bankingDays: ['Saturday', 'Sunday'],
                                bankingHoursFrom: '8:00',
                                bankingHoursTo: '10:00'
                            }
                        ],
                        branchName: 'branch',
                        locationStreet: 'khgjhgjhg',
                        locationProvinceOrState: {
                            id: 1,
                            provinceName: 'Abra',
                            country: 1
                        },
                        locationCity: {
                            id: 1,
                            cityName: 'Caloocan City',
                            province: 82
                        },
                        locationPostalOrZipCode: 0,
                        email: 'asd@asd.com',
                        phone: '(123)12123, (123)123123',
                        mobile: '+639175240823',
                        latitude: '11.0000000000',
                        longitude: '11.0000000000',
                        landmark: 'jkhkjh'
                    }
                ],
                totalBranchItems: 20,
                result: '',
                message: '',
                error: {},
                isCreateSuccess: false,
                isDeleteSuccess: false,
                specificBranch: {
                    id: 1,
                    schedules: [
                        {
                            bankingDays: ['Monday', 'Thursday', 'Friday', 'Saturday'],
                            bankingHoursFrom: '08:00',
                            bankingHoursTo: '20:00'
                        }
                    ],
                    branchName: 'Mandaluyong Branch',
                    locationStreet: 'Csp Building 173 Edsa',
                    locationProvinceOrState: {
                        id: 82,
                        createdTimestamp: '2020-08-18T17:41:28Z',
                        lastModifiedTimestamp: '2020-08-18T17:41:28Z',
                        provinceName: 'Metro Manila',
                        country: 1
                    },
                    locationCity: {
                        id: 5,
                        createdTimestamp: '2020-08-18T17:41:28Z',
                        lastModifiedTimestamp: '2020-08-18T17:41:28Z',
                        cityName: 'Mandaluyong City',
                        province: 82
                    },
                    locationPostalOrZipCode: 1550,
                    email: 'asd@asd.com',
                    phone: '(123)12313, (123)12313, (123)12313, (123)12313',
                    mobile: '9175240823',
                    latitude: '1.0000000000000000',
                    longitude: '1.0000000000000000',
                    createdTimestamp: '2021-03-05T12:16:16.927324Z',
                    lastModifiedTimestamp: '2021-03-05T12:16:16.927335Z',
                    landmark: ''
                },
                isEditSuccess: true
            }
        });
        const wrapper = mount(
            <Provider store={store}>
                <EditBranch />
            </Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find(PageHeader).exists()).toMatchSnapshot();
        expect(wrapper.find(PageHeader).exists()).toBeTruthy();
        expect(wrapper.find(BranchForm).exists()).toMatchSnapshot();
        expect(wrapper.find(BranchForm).exists()).toBeTruthy();
        expect(mockHistoryPush.mock.calls.length).toBe(1);
        expect(mockHistoryPush.mock.calls[0][0]).toBe('/branches');
    });
});
