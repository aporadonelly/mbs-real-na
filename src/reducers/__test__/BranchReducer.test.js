import BranchReducer from '../BranchReducer';
import { branchActionType } from '../../actions/constants';
import { results } from '../constants';

describe(' Promos Reducer tests', () => {
    const INITIAL_STATE = {
        branchList: [],
        totalBranchItems: 0,
        result: '',
        message: '',
        error: {},
        isCreateSuccess: false,
        isDeleteSuccess: false,
        specificBranch: {},
        isEditSuccess: false
    };

    it('Returns Initial State', () => {
        expect(BranchReducer(INITIAL_STATE, { type: '' })).toEqual(INITIAL_STATE);
    });

    it('Returns Initial State', () => {
        expect(BranchReducer(undefined, { type: '' })).toEqual(INITIAL_STATE);
    });

    it('Returns Update Branch Prop', () => {
        expect(
            BranchReducer(INITIAL_STATE, {
                type: branchActionType.UPDATE_BRANCH_REDUCER,
                payload: {
                    prop: 'isCreateSuccess',
                    value: true
                }
            })
        ).toEqual({
            ...INITIAL_STATE,
            isCreateSuccess: true
        });
    });

    it('Returns Create Branch', () => {
        expect(
            BranchReducer(INITIAL_STATE, {
                type: branchActionType.CREATE_BRANCH_SUCCESS,
                payload: {
                    branchName: 'branch'
                }
            })
        ).toEqual({
            ...INITIAL_STATE,
            isCreateSuccess: true,
            result: results.SUCCESS
        });
    });

    it('Returns Create Branch Fail', () => {
        expect(
            BranchReducer(INITIAL_STATE, {
                type: branchActionType.CREATE_BRANCH_FAIL,
                payload: { code: 'Bad Request' }
            })
        ).toEqual({
            ...INITIAL_STATE,
            error: { code: 'Bad Request' },
            result: results.FAIL
        });
    });

    it('Returns Fetch Branches Success', () => {
        const branches = {
            count: 20,
            results: [
                {
                    id: 1,
                    schedules: [
                        {
                            bankingDays: ['Monday'],
                            bankingHoursFrom: '8:00',
                            bankingHoursTo: '9:00'
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
                    phone: '+639175240823',
                    mobile: '+639175240823',
                    latitude: '11.0000000000',
                    longitude: '11.0000000000',
                    landmark: 'jkhkjh'
                },
                {
                    id: 2,
                    schedules: [
                        {
                            bankingDays: ['Monday', 'Friday'],
                            bankingHoursFrom: '9:00',
                            bankingHoursTo: '10:00'
                        }
                    ],
                    branchName: 'asdasd',
                    locationStreet: 'qweqwe',
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
                    phone: '+639175240823',
                    mobile: '+639175240823',
                    latitude: '12.0000000000',
                    longitude: '12.0000000000',
                    landmark: 'asdasd'
                }
            ]
        };
        expect(
            BranchReducer(INITIAL_STATE, {
                type: branchActionType.FETCH_BRANCHES_SUCCESS,
                payload: branches
            })
        ).toEqual({
            ...INITIAL_STATE,
            branchList: branches.results,
            totalBranchItems: 20,
            result: results.SUCCESS
        });
    });

    it('Returns Fetch Branches Fail', () => {
        expect(
            BranchReducer(INITIAL_STATE, {
                type: branchActionType.FETCH_BRANCHES_FAIL,
                payload: { code: 'Forbidden' }
            })
        ).toEqual({
            ...INITIAL_STATE,
            error: { code: 'Forbidden' },
            message: 'Failed to Retrieve Branches',
            result: results.FAIL
        });
    });

    it('Returns Delete Branch', () => {
        expect(
            BranchReducer(INITIAL_STATE, {
                type: branchActionType.DELETE_BRANCH_SUCCESS
            })
        ).toEqual({
            ...INITIAL_STATE,
            isDeleteSuccess: true,
            result: results.SUCCESS
        });
    });

    it('Returns Delete Branches Fail', () => {
        expect(
            BranchReducer(INITIAL_STATE, {
                type: branchActionType.DELETE_BRANCH_FAIL,
                payload: { code: 'Not Found' }
            })
        ).toEqual({
            ...INITIAL_STATE,
            error: { code: 'Not Found' },
            result: results.FAIL
        });
    });

    it('Returns Update Branch', () => {
        expect(
            BranchReducer(INITIAL_STATE, {
                type: branchActionType.UPDATE_BRANCH_SUCCESS,
                payload: {
                    branchName: 'branch name'
                }
            })
        ).toEqual({
            ...INITIAL_STATE,
            isEditSuccess: true,
            result: results.SUCCESS
        });
    });

    it('Returns Update Branch Fail', () => {
        expect(
            BranchReducer(INITIAL_STATE, {
                type: branchActionType.UPDATE_BRANCH_FAIL,
                payload: { code: 'Bad Request' }
            })
        ).toEqual({
            ...INITIAL_STATE,
            error: { code: 'Bad Request' },
            result: results.FAIL
        });
    });

    it('Returns Fetch Branch Success', () => {
        const branch = {
            branchName: 'asdasd edit',
            createdTimestamp: '2021-02-20T12:25:14.101212Z',
            email: 'sample@gmail.com',
            id: 1,
            landmark: 'string',
            lastModifiedTimestamp: '2021-02-20T12:25:14.101225Z',
            latitude: '1.0000000000',
            locationCity: 905,
            locationPostalOrZipCode: 1111,
            locationProvinceOrState: 45,
            locationStreet: 'string',
            longitude: '1.0000000000',
            mobile: '9123456789',
            phone: '1234567',
            schedules: [
                {
                    bankingDays: ['Tuesday', 'Wednesday', 'Friday'],
                    bankingHoursFrom: '08:00',
                    bankingHoursTo: '08:00'
                }
            ]
        };

        expect(
            BranchReducer(INITIAL_STATE, {
                type: branchActionType.FETCH_SPECIFIC_BRANCH_SUCCESS,
                payload: branch
            })
        ).toEqual({
            ...INITIAL_STATE,
            specificBranch: branch,
            result: results.SUCCESS
        });
    });

    it('Returns Fetch Branches Fail', () => {
        expect(
            BranchReducer(INITIAL_STATE, {
                type: branchActionType.FETCH_SPECIFIC_BRANCH_FAIL,
                payload: { code: 'Forbidden' }
            })
        ).toEqual({
            ...INITIAL_STATE,
            error: { code: 'Forbidden' },
            message: 'Failed to Retrieve Branch',
            result: results.FAIL
        });
    });
});
