import axios from 'axios';
import { branchActionType, CMS_ENDPOINT, SERVER_ADDRESS } from './constants';
import getHeaders from './common';

const ROOT_URL = `${SERVER_ADDRESS}/${CMS_ENDPOINT}/branches/`;

export const createBranch = branch => async dispatch => {
    try {
        const response = await axios.post(`${ROOT_URL}`, branch, await getHeaders());
        dispatch({
            type: branchActionType.CREATE_BRANCH_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        console.log('error', error);
        dispatch({
            type: branchActionType.CREATE_BRANCH_FAIL,
            payload: error
        });
    }
};

export const updateBranchReducer = (prop, value) => ({
    type: branchActionType.UPDATE_BRANCH_REDUCER,
    payload: { prop, value }
});

export const fetchBranches = page => async dispatch => {
    try {
        const response = await axios.get(
            `${ROOT_URL}?page=${page}&sort=-created_timestamp`,
            await getHeaders()
        );
        dispatch({
            type: branchActionType.FETCH_BRANCHES_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        console.log('error', error);
        dispatch({
            type: branchActionType.FETCH_BRANCHES_FAIL,
            payload: error
        });
    }
};

export const fetchSpecificBranch = id => async dispatch => {
    try {
        const response = await axios.get(`${ROOT_URL}${id}/`, await getHeaders());
        dispatch({
            type: branchActionType.FETCH_SPECIFIC_BRANCH_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: branchActionType.FETCH_SPECIFIC_BRANCH_FAIL,
            payload: error
        });
    }
};

export const updateBranch = (branch, id) => async dispatch => {
    try {
        const response = await axios.put(`${ROOT_URL}${id}/`, branch, await getHeaders());
        dispatch({
            type: branchActionType.UPDATE_BRANCH_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        console.log('error', error);
        dispatch({
            type: branchActionType.UPDATE_BRANCH_FAIL,
            payload: error
        });
    }
};

export const deleteBranch = id => async dispatch => {
    try {
        const response = await axios.delete(`${ROOT_URL}${id}/`, await getHeaders());
        dispatch({
            type: branchActionType.DELETE_BRANCH_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        console.log('error', error);
        dispatch({
            type: branchActionType.DELETE_BRANCH_FAIL,
            payload: error
        });
    }
};
