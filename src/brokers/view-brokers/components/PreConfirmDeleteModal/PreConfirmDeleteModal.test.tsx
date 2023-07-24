import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForI18n,
} from '../../../../test-utils';
import { PreConfirmDeleteModal } from '../PreConfirmDeleteModal/PreConfirmDeleteModal';
jest.mock('react-i18next');

const onDeleteButtonClick = jest.fn();
const onOpenModal = jest.fn();
const name = 'test-1';

describe('PreConfirmDeleteModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should modal renders correctly', async () => {
    const comp = render(
      <PreConfirmDeleteModal
        onDeleteButtonClick={onDeleteButtonClick}
        isModalOpen={true}
        onOpenModal={onOpenModal}
        name={name}
      />,
    );
    await waitForI18n(comp);
    expect(screen.getByText('delete_modal_instance_title')).toBeInTheDocument();
  });

  it('should not render the modal when isModalOpen is false', async () => {
    const comp = render(
      <PreConfirmDeleteModal
        onDeleteButtonClick={onDeleteButtonClick}
        isModalOpen={false}
        onOpenModal={onOpenModal}
        name={name}
      />,
    );
    await waitForI18n(comp);
    expect(
      screen.queryByText('delete_modal_instance_title'),
    ).not.toBeInTheDocument();
  });

  it('should delete the instance by clicking on the delete button', async () => {
    const comp = render(
      <PreConfirmDeleteModal
        onDeleteButtonClick={onDeleteButtonClick}
        isModalOpen={true}
        onOpenModal={onOpenModal}
        name={name}
      />,
    );
    await waitForI18n(comp);

    const deleteBtn = comp.getByText('delete');
    await waitFor(() => {
      fireEvent.click(deleteBtn);
    });
    expect(onDeleteButtonClick).toHaveBeenCalled();
  });

  it('should close the modal by clicking on the cancel button', async () => {
    const comp = render(
      <PreConfirmDeleteModal
        onDeleteButtonClick={onDeleteButtonClick}
        isModalOpen={true}
        onOpenModal={onOpenModal}
        name={name}
      />,
    );
    await waitForI18n(comp);

    const cancelBtn = screen.getByText('cancel');
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(
        screen.queryAllByText('delete_modal_instance_title'),
      ).not.toBeInTheDocument();
    });
    expect(onOpenModal).toHaveBeenCalled();
  });

  it('should close the modal by pressing the escape key', async () => {
    const comp = render(
      <PreConfirmDeleteModal
        onDeleteButtonClick={onDeleteButtonClick}
        isModalOpen={true}
        onOpenModal={onOpenModal}
        name={name}
      />,
    );
    await waitForI18n(comp);
    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(
        screen.queryByText('delete_modal_instance_title'),
      ).not.toBeInTheDocument();
    });
    expect(onOpenModal).toHaveBeenCalled();
  });
});
