import React, { useEffect, useReducer, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, IconButton, MenuItem } from '@material-ui/core';
import { AddCircleOutline, ArrowBack, Close } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { SelectValidator, TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { FormStyles } from '../styles';
import { colors, fontSizes } from '../../assets/styleGuide';
import { fetchCategories } from '../../actions';
import CustomErrorMessage from '../CustomErrorMessage';
import WysiwygField from '../WysiwygField';
import ProductFormStyles from '../styles/products/ProductFormStyles';

const ProductForm = ({ onFormSubmit }) => {
    const classes = { ...FormStyles(), ...ProductFormStyles() };
    const history = useHistory();
    const dispatch = useDispatch();
    const formRef = useRef(null);
    const products = useSelector(state => state.products);
    const { categories } = products;

    useEffect(() => {
        dispatch(fetchCategories());
    }, []);

    useEffect(() => {
        if (categories.length > 0) {
            localDispatch({
                type: 'update',
                fields: {
                    productTypeId: categories[0].id,
                    productTypeIdHasError: false
                }
            });
        }
    }, [categories]);

    const EMPTY_REQUIREMENT = {
        name: '',
        description: '',
        errors: {
            name: false,
            description: false
        }
    };

    const initialState = {
        productName: '',
        productTypeId: null,
        description: '',
        requirements: [{ ...EMPTY_REQUIREMENT }],
        productNameHasError: false,
        productTypeIdHasError: false,
        descriptionHasError: false
    };

    const isValidWysiwygField = fieldValue =>
        fieldValue.replace(/<(.|\n)*?>/g, '').trim().length !== 0;

    const hasFieldErrors = () => {
        let hasError = false;

        if (localState.productName.trim().length === 0) {
            localDispatch({
                type: 'update',
                fields: { productNameHasError: true }
            });
            hasError = true;
        }

        if (localState.productTypeId === null) {
            localDispatch({
                type: 'update',
                fields: { productTypeIdHasError: true }
            });
            hasError = true;
        }

        if (!isValidWysiwygField(localState.description)) {
            localDispatch({
                type: 'update',
                fields: { descriptionHasError: true }
            });
            hasError = true;
        }

        for (let i = 0; i < localState.requirements.length; i++) {
            if (localState.requirements[i].name.trim().length === 0) {
                localDispatch({
                    type: 'requirement_error_update',
                    fields: {
                        index: i,
                        field: 'name',
                        value: true
                    }
                });
                hasError = true;
            }

            if (!isValidWysiwygField(localState.requirements[i].description)) {
                localDispatch({
                    type: 'requirement_error_update',
                    fields: {
                        index: i,
                        field: 'description',
                        value: true
                    }
                });
                hasError = true;
            }
        }

        return hasError;
    };

    const handleSubmitForm = async e => {
        e.preventDefault();

        localDispatch({ type: 'reset_errors' });

        if (!hasFieldErrors()) {
            const formValid = await formRef.current.isFormValid();
            if (formValid) {
                onFormSubmit({
                    name: localState.productName,
                    description: localState.description,
                    productCategory: localState.productTypeId,
                    productRequirements: localState.requirements.map(r => ({
                        name: r.name,
                        description: r.description
                    }))
                });
            }
        }
    };

    const componentReducer = (state, action) => {
        switch (action.type) {
            case 'update':
                return {
                    ...state,
                    ...action.fields
                };
            case 'requirement_update': {
                const { index, field, value } = action.fields;
                const { requirements } = { ...state };
                requirements[index] = {
                    ...requirements[index],
                    [field]: value,
                    errors: {
                        ...requirements[index].errors,
                        [field]: false
                    }
                };
                return { ...state, requirements };
            }
            case 'requirement_error_update': {
                const { index, field, value } = action.fields;
                const { requirements } = { ...state };
                requirements[index] = {
                    ...requirements[index],
                    errors: {
                        ...requirements[index].errors,
                        [field]: value
                    }
                };
                return { ...state, requirements };
            }
            case 'reset_errors':
                return {
                    ...state,
                    productNameHasError: false,
                    descriptionHasError: false,
                    productTypeIdHasError: false,
                    requirements: state.requirements.map(r => ({
                        ...r,
                        errors: {
                            name: false,
                            description: false
                        }
                    }))
                };
            case 'add_requirement':
                return {
                    ...state,
                    requirements: [...state.requirements, { ...EMPTY_REQUIREMENT }]
                };
            case 'remove_requirement': {
                const { index } = action.fields;
                const { requirements } = { ...state };
                const requirementCopy = [...requirements];
                requirementCopy.splice(index, 1);
                return {
                    ...state,
                    requirements: requirementCopy
                };
            }

            default:
                throw new Error('Invalid action type');
        }
    };

    const handleAddRequirement = () => {
        localDispatch({ type: 'add_requirement' });
    };

    const handleRemoveRequirement = index => {
        localDispatch({
            type: 'remove_requirement',
            fields: { index }
        });
    };

    const [localState, localDispatch] = useReducer(componentReducer, initialState);

    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <IconButton
                        aria-label="back"
                        disableRipple
                        onClick={() => history.push('/products')}
                        className={classes.backBtn}
                        data-testid="back-btn">
                        <ArrowBack style={{ color: colors.text }} />
                    </IconButton>
                    <h3 className={classes.title}>Create New Product</h3>
                </Grid>
                <Grid item xs={12}>
                    <ValidatorForm
                        data-testid="products-form"
                        noValidate
                        onSubmit={e => handleSubmitForm(e)}
                        ref={formRef}>
                        <Grid container item xs={12} sm={10}>
                            <Grid item sm={6} xs={12} className={classes.fieldSpacing}>
                                <div className={classes.fieldContainer}>
                                    <div className={classes.label}>
                                        Name<span style={{ color: colors.error }}> *</span>
                                    </div>
                                    <TextValidator
                                        data-testid="product-name"
                                        fullWidth
                                        variant="outlined"
                                        onChange={e => {
                                            localDispatch({
                                                type: 'update',
                                                fields: {
                                                    productName: e.target.value,
                                                    productNameHasError: false
                                                }
                                            });
                                        }}
                                        name="productName"
                                        type="text"
                                        placeholder="Enter Product Name"
                                        value={localState.productName}
                                        error={localState.productNameHasError}
                                    />
                                    <CustomErrorMessage
                                        renderCondition={localState.productNameHasError}
                                        message={'This field is required.'}
                                    />
                                </div>
                            </Grid>
                            <Grid item sm={6} xs={12} className={classes.fieldSpacing}>
                                <div className={classes.fieldContainer}>
                                    <div className={classes.label}>
                                        Product Type
                                        <span style={{ color: colors.error }}> *</span>
                                    </div>
                                    <SelectValidator
                                        data-testid="product-type-id"
                                        name="productTypeId"
                                        onChange={e => {
                                            localDispatch({
                                                type: 'update',
                                                fields: {
                                                    productTypeId: e.target.value,
                                                    productTypeIdHasError: false
                                                }
                                            });
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        value={localState.productTypeId}
                                        error={localState.productTypeIdHasError}
                                        className={classes.selectValidator}>
                                        <MenuItem value="" disabled>
                                            Select Product Type
                                        </MenuItem>
                                        {categories.map(c => (
                                            <MenuItem key={c.id} value={c.id}>
                                                {c.label}
                                            </MenuItem>
                                        ))}
                                    </SelectValidator>
                                    <CustomErrorMessage
                                        renderCondition={localState.productTypeIdHasError}
                                        message={'This field is required.'}
                                    />
                                </div>
                            </Grid>
                        </Grid>

                        <Grid item container sm={10} xs={12} className={classes.fieldSpacing}>
                            <Grid item xs={12}>
                                <div className={classes.label}>
                                    Description
                                    <span style={{ color: colors.error }}> *</span>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <WysiwygField
                                    data-testid="description"
                                    name="description"
                                    onChange={values => {
                                        localDispatch({
                                            type: 'update',
                                            fields: {
                                                description: values,
                                                descriptionHasError: false
                                            }
                                        });
                                    }}
                                    className={classes.quillStyle}
                                    value={localState.description}
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.wysiwygErrorGrid}>
                                <CustomErrorMessage
                                    renderCondition={localState.descriptionHasError}
                                    message={'This field is required'}
                                />
                            </Grid>
                            <Grid xs={12} className={classes.separator} />
                        </Grid>

                        <Grid container item xs={12} sm={10}>
                            {localState.requirements.map((r, index) => (
                                <Grid container style={{ position: 'relative' }}>
                                    {localState.requirements.length > 1 && (
                                        <Grid
                                            item
                                            container
                                            xs={12}
                                            justify="flex-end"
                                            className={classes.removeBtn}
                                            key={index.id}>
                                            <IconButton
                                                aria-label="remove-requirement"
                                                disableRipple
                                                style={{ marginRight: '0.25rem' }}
                                                className={classes.backBtn}
                                                onClick={() => handleRemoveRequirement(index)}
                                                data-testid={`remove-requirement-btn-${index}`}>
                                                <Close
                                                    style={{ color: colors.text }}
                                                    fontSize="small"
                                                />
                                            </IconButton>
                                        </Grid>
                                    )}
                                    <Grid item container sm={12} xs={12}>
                                        <Grid item sm={6} xs={12} className={classes.fieldSpacing}>
                                            <div className={classes.fieldContainer}>
                                                <div className={classes.label}>
                                                    Requirement Name
                                                    <span style={{ color: colors.error }}> *</span>
                                                </div>
                                                <TextValidator
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={e => {
                                                        localDispatch({
                                                            type: 'requirement_update',
                                                            fields: {
                                                                index,
                                                                field: 'name',
                                                                value: e.target.value
                                                            }
                                                        });
                                                    }}
                                                    data-testid={`requirement-name-${index}`}
                                                    name={`requirement-name-${index}`}
                                                    type="text"
                                                    placeholder="Enter Requirement Name"
                                                    error={r.errors.name}
                                                    value={r.name}
                                                />
                                                <CustomErrorMessage
                                                    renderCondition={r.errors.name}
                                                    message={'This field is required.'}
                                                />
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <Grid item container sm={12} xs={12}>
                                        <Grid item sm={6} xs={12}>
                                            <div className={classes.label}>
                                                Requirement Description
                                                <span style={{ color: colors.error }}> *</span>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} className={classes.fieldSpacing}>
                                            <WysiwygField
                                                data-testid={`requirement-description-${index}`}
                                                name="description"
                                                onChange={value => {
                                                    localDispatch({
                                                        type: 'requirement_update',
                                                        fields: {
                                                            index,
                                                            field: 'description',
                                                            value
                                                        }
                                                    });
                                                }}
                                                className={classes.quillStyle}
                                                value={r.description}
                                            />
                                        </Grid>
                                        <Grid item xs={12} className={classes.wysiwygErrorGrid}>
                                            <CustomErrorMessage
                                                renderCondition={r.errors.description}
                                                message={'This field is required'}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>

                        <Grid container item xs={12} sm={10}>
                            <Button
                                onClick={handleAddRequirement}
                                variant="text"
                                size="small"
                                color="secondary"
                                type="button"
                                className={classes.backBtn}
                                disableRipple
                                style={{ fontSize: fontSizes.text }}
                                data-testid="add-requirement-button">
                                <AddCircleOutline className={classes.addBtn} />
                                Add another requirement
                            </Button>
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
                                        localDispatch({
                                            type: 'update',
                                            fields: {
                                                isFormSubmitted: true
                                            }
                                        });
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
                                    onClick={() => history.push('/products')}>
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
export default ProductForm;
