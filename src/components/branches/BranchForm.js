/**
 * @Name: BranchForm
 * @Description: Form component of branches
 * @Props:
 *      onFormSubmit: submit function of the form
 * @Return: View
 * @Author: Frances
 * @Last Update By: Frances
 */
import React, { useRef, useState, useReducer, useEffect } from 'react';
import {
    Grid,
    IconButton,
    Button,
    Checkbox,
    ListItemText,
    MenuItem,
    Select,
    OutlinedInput
} from '@material-ui/core';
import { ArrowBack, AddCircleOutline, InfoOutlined, Close } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { TextValidator, ValidatorForm, SelectValidator } from 'react-material-ui-form-validator';
import { useDispatch, useSelector } from 'react-redux';
import { BranchFormStyles, FormStyles } from '../styles';
import { colors, fontSizes } from '../../assets/styleGuide';
import ErrorMessage from '../ErrorMessage';
import CustomErrorMessage from '../CustomErrorMessage';
import { fetchCities } from '../../actions';

const BranchForm = ({ onFormSubmit }) => {
    const classes = { ...FormStyles(), ...BranchFormStyles() };
    const history = useHistory();
    const dispatch = useDispatch();
    const address = useSelector(state => state.address);
    const branch = useSelector(state => state.branch);

    const formRef = useRef(null);

    const initialState = {
        branchName: '',
        landmark: '',
        email: '',
        phone: '',
        mobile: '',
        longitude: null,
        latitude: null,
        locationStreet: '',
        locationProvinceOrState: '',
        locationCity: '',
        locationPostalOrZipCode: '',
        isFormSubmitted: false
    };

    // set values for reducer
    const [formValues, setFormValues] = useReducer(
        (currentValues, newValues) => ({ ...currentValues, ...newValues }),
        initialState
    );

    const {
        branchName,
        landmark,
        email,
        phone,
        mobile,
        latitude,
        longitude,
        locationStreet,
        locationProvinceOrState,
        locationCity,
        locationPostalOrZipCode,
        isFormSubmitted
    } = formValues;

    // Values for schedule
    const [bankingSched, setBankingSched] = useState([
        { bankingDays: [], bankingHoursFrom: '08:00', bankingHoursTo: '08:00' }
    ]);

    const [bankingSchedError, setBankingSchedError] = useState([
        {
            isBankingDaysError: false,
            isBankingHoursFromError: false,
            isBankingHoursToError: false,
            isBankingTimeRangeError: false
        }
    ]);

    // Select element values
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const provinces = address.provinceList;
    const cities = address.cityList.length > 0 ? address.cityList : [];

    const handleUpdateField = event => {
        const { name, value } = event.target;
        setFormValues({ [name]: value });
    };

    // For Edit
    useEffect(async () => {
        const schedError = [];
        if (
            branch.specificBranch !== undefined &&
            Object.keys(branch.specificBranch).length !== 0
        ) {
            const item = {
                branchName: branch.specificBranch.branchName,
                locationStreet: branch.specificBranch.locationStreet,
                locationProvinceOrState: branch.specificBranch.locationProvinceOrState.id,
                locationCity: branch.specificBranch.locationCity.id,
                locationPostalOrZipCode: branch.specificBranch.locationPostalOrZipCode,
                landmark: branch.specificBranch.landmark,
                email: branch.specificBranch.email,
                phone: branch.specificBranch.phone,
                mobile: branch.specificBranch.mobile,
                latitude: branch.specificBranch.latitude,
                longitude: branch.specificBranch.longitude
            };
            const branchItem = { ...formValues, ...item };
            setFormValues(branchItem);
            setBankingSched(branch.specificBranch.schedules);
            branch.specificBranch.schedules.map(() =>
                schedError.push({
                    isBankingDaysError: false,
                    isBankingHoursFromError: false,
                    isBankingHoursToError: false,
                    isBankingTimeRangeError: false
                })
            );
            setBankingSchedError(schedError);
        }
    }, [branch?.specificBranch]);

    useEffect(async () => {
        setFormValues({ locationProvinceOrState: address.provinceList[0]?.id });
        await dispatch(fetchCities(address.provinceList[0]?.id));
    }, [address.provinceList]);

    useEffect(() => {
        if (
            locationCity === undefined ||
            locationCity === '' ||
            Object.keys(branch.specificBranch).length === 0
        ) {
            setFormValues({ locationCity: address.cityList[0]?.id });
        }
    }, [address.cityList]);

    const handleScheduleChange = (event, index) => {
        setFormValues({ isFormSubmitted: false });
        const { value, name } = event.target;

        const schedulesCopy = [...bankingSched];
        const schedulesErrorCopy = [...bankingSchedError];

        if (name === 'bankingDays') {
            schedulesCopy[index].bankingDays = value;
            schedulesErrorCopy[index].isBankingDaysError = false;
        }
        if (name === 'bankingHoursFrom') {
            schedulesCopy[index].bankingHoursFrom = value;
            schedulesErrorCopy[index].isBankingHoursFromError = false;
            schedulesErrorCopy[index].isBankingTimeRangeError = false;
        }
        if (name === 'bankingHoursTo') {
            schedulesCopy[index].bankingHoursTo = value;
            schedulesErrorCopy[index].isBankingHoursToError = false;
            schedulesErrorCopy[index].isBankingTimeRangeError = false;
        }
        setBankingSched(schedulesCopy);
        setBankingSchedError(schedulesErrorCopy);
    };

    const handleAddSchedule = () => {
        setFormValues({ addButtonClicked: true });
        setFormValues({ isFormSubmitted: false });
        setBankingSched([
            ...bankingSched,
            { bankingDays: [], bankingHoursFrom: '08:00', bankingHoursTo: '08:00' }
        ]);

        setBankingSchedError([
            ...bankingSchedError,
            {
                isBankingDaysError: false,
                isBankingHoursFromError: false,
                isBankingHoursToError: false,
                isBankingTimeRangeError: false
            }
        ]);
    };

    const handleRemoveSchedule = index => {
        const schedulesCopy = [...bankingSched];
        const schedulesErrorCopy = [...bankingSchedError];
        if (index >= 0) {
            schedulesCopy.splice(index, 1);
            schedulesErrorCopy.splice(index, 1);
            setBankingSchedError(schedulesErrorCopy);
            setBankingSched(schedulesCopy);
        }
    };

    const renderSchedule = branchSchedule =>
        branchSchedule.map(({ bankingDays, bankingHoursFrom, bankingHoursTo }, index) => (
            <Grid container style={{ position: 'relative' }}>
                {branchSchedule.length !== 1 && (
                    <Grid
                        item
                        container
                        xs={12}
                        justify="flex-end"
                        className={classes.removeBtn}
                        key={index.id}>
                        <IconButton
                            aria-label="remove-schedule"
                            disableRipple
                            style={{ marginRight: '0.25rem' }}
                            className={classes.backBtn}
                            onClick={() => handleRemoveSchedule(index)}
                            data-testid={`remove-sched-btn-${index}`}>
                            <Close style={{ color: colors.text }} fontSize="small" />
                        </IconButton>
                    </Grid>
                )}

                <Grid item sm={6} xs={12} className={classes.fieldSpacing}>
                    <div className={classes.fieldContainer}>
                        <div className={classes.label}>
                            Schedule <span style={{ color: colors.error }}>*</span>
                        </div>
                        <Select
                            labelId="demo-mutiple-checkbox-label"
                            id="demo-mutiple-checkbox"
                            variant="outlined"
                            error={bankingSchedError[index].isBankingDaysError}
                            multiple
                            name="bankingDays"
                            value={bankingDays}
                            onChange={e => handleScheduleChange(e, index)}
                            input={<OutlinedInput fullWidth className={classes.select} />}
                            renderValue={selected => {
                                if (selected.length === 0) {
                                    return (
                                        <span
                                            style={{
                                                color: colors.placeholderText
                                            }}>
                                            Select Day
                                        </span>
                                    );
                                }

                                return selected.join(', ');
                            }}
                            displayEmpty>
                            <MenuItem value="" disabled>
                                Select Day
                            </MenuItem>
                            {days.map(day => (
                                <MenuItem key={day} value={day}>
                                    <Checkbox
                                        color="primary"
                                        checked={bankingDays?.indexOf(day) > -1}
                                    />
                                    <ListItemText primary={day} />
                                </MenuItem>
                            ))}
                        </Select>
                        <CustomErrorMessage
                            renderCondition={bankingSchedError[index].isBankingDaysError}
                            message={'This field is required.'}
                        />
                    </div>
                </Grid>
                <Grid item container sm={6} xs={12} className={classes.fieldSpacing}>
                    <Grid item xs={12} lg={6} className={classes.rightSpacing}>
                        <div className={classes.fieldContainer}>
                            <div className={classes.label}>
                                From <span style={{ color: colors.error }}>*</span>
                            </div>
                            <TextValidator
                                error={
                                    bankingSchedError[index].isBankingHoursFromError ||
                                    bankingSchedError[index].isBankingTimeRangeError
                                }
                                fullWidth
                                variant="outlined"
                                onChange={e => handleScheduleChange(e, index)}
                                name="bankingHoursFrom"
                                type="time"
                                placeholder="ex. 09611458922"
                                value={bankingHoursFrom}
                            />
                            <CustomErrorMessage
                                renderCondition={bankingSchedError[index].isBankingHoursFromError}
                                message={'This field is required.'}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={12} lg={6} className={classes.leftSpacing}>
                        <div className={classes.fieldContainer}>
                            <div className={classes.label}>
                                To <span style={{ color: colors.error }}>*</span>
                            </div>
                            <TextValidator
                                error={
                                    bankingSchedError[index].isBankingHoursToError ||
                                    bankingSchedError[index].isBankingTimeRangeError
                                }
                                fullWidth
                                variant="outlined"
                                onChange={e => handleScheduleChange(e, index)}
                                name="bankingHoursTo"
                                type="time"
                                placeholder="ex. 09611458922"
                                value={bankingHoursTo}
                            />
                            <CustomErrorMessage
                                renderCondition={bankingSchedError[index].isBankingHoursToError}
                                message={'This field is required.'}
                            />
                            <CustomErrorMessage
                                renderCondition={bankingSchedError[index].isBankingTimeRangeError}
                                message={'Invalid time range.'}
                            />
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        ));

    const handleProvinceChange = event => {
        const { value } = event.target;

        setFormValues({ locationProvinceOrState: value });
        if (event.target.value === '') {
            setFormValues({ locationCity: value });
        } else {
            dispatch(fetchCities(value));
            setFormValues({ locationCity: '' });
        }
    };

    const selectedProvince = locationProvinceOrState
        ? provinces.find(province => province.id === locationProvinceOrState)
        : { provinceName: '' };

    const selectedCity = locationCity
        ? cities.find(city => city.id === locationCity)
        : { cityName: '' };

    const handleSubmitForm = async (event, branchValues, schedule) => {
        const formValidity = await formRef.current.isFormValid();
        // check if there is an error in banking sched
        const hasSchedError = bankingSchedError.filter(
            value =>
                value.isBankingDaysError ||
                value.isBankingHoursFromError ||
                value.isBankingHoursToError ||
                value.isBankingTimeRangeError
        );

        if (formValidity && hasSchedError.length === 0) {
            onFormSubmit(event, branchValues, schedule);
        }
    };

    // Set Schedule error when form is submitted
    useEffect(() => {
        if (isFormSubmitted) {
            const schedError = [...bankingSchedError];
            for (let i = 0; i < bankingSched.length; i++) {
                const { bankingDays, bankingHoursFrom, bankingHoursTo } = bankingSched[i];
                if (bankingDays.length === 0) {
                    schedError[i].isBankingDaysError = true;
                }
                if (bankingHoursFrom === '') {
                    schedError[i].isBankingHoursFromError = true;
                }
                if (bankingHoursTo === '') {
                    schedError[i].isBankingHoursToError = true;
                }
                if (bankingHoursFrom >= bankingHoursTo) {
                    schedError[i].isBankingTimeRangeError = true;
                }
            }
            setBankingSchedError(schedError);
        }
    }, [isFormSubmitted]);

    const title =
        branch?.specificBranch !== undefined && Object.keys(branch.specificBranch).length !== 0
            ? 'Edit'
            : 'Create New';

    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <IconButton
                        aria-label="back"
                        disableRipple
                        onClick={() => history.push('/branches')}
                        className={classes.backBtn}
                        data-testid="back-btn">
                        <ArrowBack style={{ color: colors.text }} />
                    </IconButton>
                    <h3 className={classes.title}>{title} Branch</h3>
                </Grid>
                <Grid item xs={12}>
                    <ValidatorForm
                        data-testid="branch-form"
                        noValidate
                        onSubmit={e => handleSubmitForm(e, formValues, bankingSched)}
                        ref={formRef}>
                        <Grid item sm={5} xs={12} className={classes.fieldSpacing}>
                            <div className={classes.fieldContainer}>
                                <div className={classes.label}>
                                    Name <span style={{ color: colors.error }}>*</span>
                                </div>
                                <TextValidator
                                    fullWidth
                                    variant="outlined"
                                    onChange={handleUpdateField}
                                    name="branchName"
                                    type="text"
                                    placeholder="Enter Branch Name"
                                    validators={['required']}
                                    errorMessages={[ErrorMessage('This field is required.')]}
                                    value={branchName}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={10} className={classes.fieldSpacing}>
                            <div className={classes.fieldContainer}>
                                <div className={classes.label}>
                                    Street address <span style={{ color: colors.error }}>*</span>
                                </div>
                                <TextValidator
                                    fullWidth
                                    variant="outlined"
                                    onChange={handleUpdateField}
                                    name="locationStreet"
                                    type="text"
                                    placeholder="Street name, Blk, Lot and etc."
                                    validators={['required']}
                                    errorMessages={[ErrorMessage('This field is required.')]}
                                    value={locationStreet}
                                />
                            </div>
                        </Grid>
                        <Grid container item xs={12} sm={10}>
                            <Grid item sm={6} xs={12} className={classes.fieldSpacing}>
                                <div className={classes.fieldContainer}>
                                    <div className={classes.label}>
                                        State / Province
                                        <span style={{ color: colors.error }}> *</span>
                                    </div>
                                    <SelectValidator
                                        name="locationProvinceOrState"
                                        onChange={handleProvinceChange}
                                        fullWidth
                                        variant="outlined"
                                        validators={['required']}
                                        value={locationProvinceOrState}
                                        placeholder="Select a province"
                                        errorMessages={[ErrorMessage('This field is required.')]}
                                        className={classes.selectValidator}>
                                        <MenuItem value="" disabled>
                                            Select a province
                                        </MenuItem>
                                        {provinces.map(province => (
                                            <MenuItem key={province.id} value={province.id}>
                                                {province.provinceName}
                                            </MenuItem>
                                        ))}
                                    </SelectValidator>
                                </div>
                            </Grid>
                            <Grid item sm={6} xs={12} className={classes.fieldSpacing}>
                                <div className={classes.fieldContainer}>
                                    <div className={classes.label}>
                                        City / Municipality
                                        <span style={{ color: colors.error }}> *</span>
                                    </div>
                                    <SelectValidator
                                        name="locationCity"
                                        onChange={handleUpdateField}
                                        fullWidth
                                        variant="outlined"
                                        validators={['required']}
                                        value={locationCity}
                                        errorMessages={[ErrorMessage('This field is required.')]}
                                        className={classes.selectValidator}>
                                        <MenuItem value="" disabled>
                                            Select a city
                                        </MenuItem>
                                        {cities.map(city => (
                                            <MenuItem key={city.id} value={city.id}>
                                                {city.cityName}
                                            </MenuItem>
                                        ))}
                                    </SelectValidator>
                                    {locationProvinceOrState === '' ? (
                                        <div
                                            className={classes.customErrorContainer}
                                            style={{ color: colors.text }}>
                                            <InfoOutlined
                                                color="secondary"
                                                style={{ marginRight: '0.25em' }}
                                                fontSize="small"
                                            />
                                            Select a province first
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </Grid>
                        </Grid>
                        <Grid item sm={5} xs={12} className={classes.fieldSpacing}>
                            <div className={classes.fieldContainer}>
                                <div className={classes.label}>
                                    Postal Code / ZIP <span style={{ color: colors.error }}>*</span>
                                </div>
                                <TextValidator
                                    fullWidth
                                    variant="outlined"
                                    onChange={handleUpdateField}
                                    name="locationPostalOrZipCode"
                                    type="text"
                                    placeholder="Enter postal code/zip"
                                    validators={['required', 'matchRegexp:^[0-9]*$']}
                                    errorMessages={[
                                        ErrorMessage('This field is required.'),
                                        ErrorMessage('Invalid format.')
                                    ]}
                                    value={locationPostalOrZipCode}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12} className={classes.fieldSpacing}>
                            <div className={classes.fieldContainer}>
                                <div className={classes.label}>Address Preview:</div>
                                {locationStreet &&
                                locationProvinceOrState &&
                                locationCity &&
                                locationPostalOrZipCode ? (
                                    <div
                                        data-testid="address-text"
                                        className={classes.label}
                                        style={{
                                            fontFamily: 'Inter Regular'
                                        }}>
                                        {`${locationStreet}, ${selectedCity?.cityName}, ${selectedProvince.provinceName}, ${locationPostalOrZipCode}`}
                                    </div>
                                ) : (
                                    <div
                                        data-testid="address-text-preview"
                                        className={classes.addressPreview}>
                                        No available preview yet.
                                    </div>
                                )}
                            </div>
                        </Grid>
                        <Grid container item xs={12} sm={10}>
                            <Grid item sm={6} xs={12} className={classes.fieldSpacing}>
                                <div className={classes.fieldContainer}>
                                    <div className={classes.label}>Landmark</div>
                                    <TextValidator
                                        fullWidth
                                        variant="outlined"
                                        onChange={handleUpdateField}
                                        name="landmark"
                                        type="text"
                                        placeholder="Enter Landmark"
                                        value={landmark}
                                    />
                                </div>
                            </Grid>
                            <Grid item sm={6} xs={12} className={classes.fieldSpacing}>
                                <div className={classes.fieldContainer}>
                                    <div className={classes.label}>
                                        Email <span style={{ color: colors.error }}>*</span>
                                    </div>
                                    <TextValidator
                                        fullWidth
                                        variant="outlined"
                                        onChange={handleUpdateField}
                                        name="email"
                                        type="text"
                                        placeholder="Enter Email Address"
                                        validators={['required', 'isEmail']}
                                        errorMessages={[
                                            ErrorMessage('This field is required.'),
                                            ErrorMessage('Invalid Email Address format.')
                                        ]}
                                        value={email}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} sm={10}>
                            <Grid item sm={6} xs={12} className={classes.fieldSpacing}>
                                <div className={classes.fieldContainer}>
                                    <div className={classes.label}>
                                        Telephone No. <span style={{ color: colors.error }}>*</span>
                                    </div>
                                    <TextValidator
                                        fullWidth
                                        variant="outlined"
                                        onChange={handleUpdateField}
                                        name="phone"
                                        type="text"
                                        placeholder="ex. (044) 766 68 75, (044) 766 68 94"
                                        validators={['required', 'matchRegexp:^[0-9,() ]*$']}
                                        errorMessages={[
                                            ErrorMessage('This field is required.'),
                                            ErrorMessage('Invalid format.')
                                        ]}
                                        value={phone}
                                    />
                                </div>
                            </Grid>
                            <Grid item sm={6} xs={12} className={classes.fieldSpacing}>
                                <div className={classes.fieldContainer}>
                                    <div className={classes.label}>
                                        Mobile No. <span style={{ color: colors.error }}>*</span>
                                    </div>
                                    <TextValidator
                                        fullWidth
                                        variant="outlined"
                                        onChange={handleUpdateField}
                                        name="mobile"
                                        type="text"
                                        placeholder="ex. 09611458922"
                                        validators={['required', 'matchRegexp:^[0-9]*$']}
                                        errorMessages={[
                                            ErrorMessage('This field is required.'),
                                            ErrorMessage('Invalid format.')
                                        ]}
                                        value={mobile}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} sm={10}>
                            {renderSchedule(bankingSched)}
                            <Grid>
                                <Button
                                    onClick={handleAddSchedule}
                                    variant="text"
                                    size="small"
                                    color="secondary"
                                    type="button"
                                    className={classes.backBtn}
                                    disableRipple
                                    style={{ fontSize: fontSizes.text }}
                                    data-testid="add-sched-btn">
                                    <AddCircleOutline className={classes.addBtn} />
                                    Add another schedule
                                </Button>
                            </Grid>
                        </Grid>
                        {/* Schedule End */}
                        <Grid container item xs={12} sm={10}>
                            <Grid item sm={6} xs={12} className={classes.fieldSpacing}>
                                <div className={classes.fieldContainer}>
                                    <div className={classes.label}>
                                        Latitude <span style={{ color: colors.error }}>*</span>
                                    </div>
                                    <TextValidator
                                        fullWidth
                                        variant="outlined"
                                        onChange={handleUpdateField}
                                        name="latitude"
                                        type="number"
                                        placeholder="ex. 14.558445983138848"
                                        validators={['required']}
                                        errorMessages={[ErrorMessage('This field is required.')]}
                                        value={latitude}
                                    />
                                </div>
                            </Grid>
                            <Grid item sm={6} xs={12} className={classes.fieldSpacing}>
                                <div className={classes.fieldContainer}>
                                    <div className={classes.label}>
                                        Longitude <span style={{ color: colors.error }}>*</span>
                                    </div>
                                    <TextValidator
                                        fullWidth
                                        variant="outlined"
                                        onChange={handleUpdateField}
                                        name="longitude"
                                        type="number"
                                        placeholder="ex. 121.0335484553275"
                                        validators={['required']}
                                        errorMessages={[ErrorMessage('This field is required.')]}
                                        value={longitude}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            item
                            xs={12}
                            sm={10}
                            justify="flex-end"
                            className={classes.fieldSpacing}>
                            <div className={classes.formBtnContainer}>
                                <Button
                                    data-testid="submit-btn"
                                    variant="contained"
                                    size="large"
                                    color="primary"
                                    type="submit"
                                    onClick={() => {
                                        setFormValues({ isFormSubmitted: true });
                                    }}
                                    style={{ marginRight: '1.5rem' }}
                                    className={classes.formBtn}>
                                    Save
                                </Button>
                                <Button
                                    data-testid="cancel-btn"
                                    variant="outlined"
                                    size="large"
                                    color="secondary"
                                    type="button"
                                    className={classes.cancelBtn}
                                    onClick={() => history.push('/branches')}>
                                    Cancel
                                </Button>
                            </div>
                        </Grid>
                    </ValidatorForm>
                </Grid>
            </Grid>
        </>
    );
};
export default BranchForm;
