import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import ViewModal from '../ViewModal';

configure({ adapter: new Adapter() });

describe('renders View Modal', () => {
    it('display view modal', () => {
        const openModal = true;
        const closeModal = jest.fn();

        const wrapper = shallow(
            <ViewModal open={openModal} onClose={closeModal} item="Branch">
                <div>View Modal Content</div>
            </ViewModal>
        );
        expect(wrapper.find('[data-testid="view-title-Branch"]').text()).toEqual('View Branch');
        expect(wrapper.find('[data-testid="view-edit-Branch-text"]').text()).toEqual('Edit Branch');
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    describe('trigger close modal', () => {
        const openModal = true;
        const closeModal = jest.fn();

        const wrapper = shallow(
            <ViewModal open={openModal} onClose={closeModal} item="Branch">
                <div>View Modal Content</div>
            </ViewModal>
        );

        it('click close icon', () => {
            const closeBtn = wrapper.find('[data-testid="close-icon-btn"]');
            closeBtn.simulate('click');
            expect(closeModal.mock.calls.length).toBe(1);
        });
    });

    describe('trigger edit button modal', () => {
        const openModal = true;
        const editFn = jest.fn();
        const closeModal = jest.fn();

        const wrapper = shallow(
            <ViewModal open={openModal} onClose={closeModal} item="Branch" onEdit={editFn}>
                <div>View Modal Content</div>
            </ViewModal>
        );

        it('click edit button', () => {
            const editBtn = wrapper.find('[data-testid="edit-button-Branch"]');
            editBtn.simulate('click');
            expect(editFn.mock.calls.length).toBe(1);
        });
    });
});
