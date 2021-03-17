import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PageHeader, ProductForm } from '../../components';
import { createProduct, fetchCategories } from '../../actions';

const CreateProduct = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const products = useSelector(state => state.products);
    const { createSuccess } = products;

    useEffect(() => {
        dispatch(fetchCategories());
    }, []);

    useEffect(() => {
        createSuccess && history.push('/products');
    }, [createSuccess]);

    const handleCreateProduct = payload => {
        dispatch(createProduct(payload));
    };

    return (
        <div data-testid="create-product-component">
            <PageHeader
                title="Products"
                description="Create and add products by filling out required information below."
                hideCreateButton
            />
            <ProductForm onFormSubmit={handleCreateProduct} />
        </div>
    );
};
export default CreateProduct;
