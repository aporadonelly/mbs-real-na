import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { BranchForm, PageHeader } from '../../components';
import { fetchCities, fetchProvinces, fetchSpecificBranch, updateBranch } from '../../actions';

const EditBranch = () => {
    const { id } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const branch = useSelector(state => state.branch);

    useEffect(async () => {
        await dispatch(fetchProvinces());
        await dispatch(fetchSpecificBranch(id));
    }, []);

    useEffect(async () => {
        await dispatch(fetchCities(branch.specificBranch?.locationProvinceOrState?.id));
    }, [branch.specificBranch]);

    useEffect(() => {
        branch.isEditSuccess && history.push('/branches');
    }, [branch.isEditSuccess]);

    const handleEditBranch = (e, updatedBranch, branchSched) => {
        e.preventDefault();

        const {
            branchName,
            locationStreet,
            locationProvinceOrState,
            locationCity,
            locationPostalOrZipCode,
            email,
            phone,
            mobile,
            latitude,
            longitude,
            landmark
        } = updatedBranch;

        const branchPayload = {
            branchName,
            locationStreet,
            locationProvinceOrState,
            locationCity,
            locationPostalOrZipCode: Number(locationPostalOrZipCode),
            email,
            phone,
            mobile,
            latitude,
            longitude,
            landmark,
            schedules: branchSched
        };
        dispatch(updateBranch(branchPayload, id));
    };

    return (
        <div data-testid="create-branch-component">
            <PageHeader
                title="Branches"
                description="Create, view, and edit your bank branches here."
                hideCreateButton
            />
            <BranchForm onFormSubmit={handleEditBranch} />
        </div>
    );
};
export default EditBranch;
