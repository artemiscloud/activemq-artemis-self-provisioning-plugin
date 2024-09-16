import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForI18n,
} from '@app/test-utils';
import { PreConfirmDeleteModal } from '../PreConfirmDeleteModal/PreConfirmDeleteModal';

describe('PreConfirmDeleteModal', () => {
  const onDeleteButtonClick = jest.fn();
  const onOpenModal = jest.fn();
  const name = 'test-1';

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
    expect(screen.getByText('Delete instance ?')).toBeInTheDocument();
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
    expect(screen.queryByText('Delete instance ?')).not.toBeInTheDocument();
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

    const deleteBtn = comp.getByText('Delete');
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

    const cancelBtn = screen.getByText('Cancel');
    fireEvent.click(cancelBtn);
    expect(onOpenModal).toHaveBeenCalled();
  });

  it('should close the modal by pressing the escape key', async () => {
    const { container } = render(
      <PreConfirmDeleteModal
        onDeleteButtonClick={onDeleteButtonClick}
        isModalOpen={true}
        onOpenModal={onOpenModal}
        name={name}
      />,
    );

    fireEvent.keyDown(container, {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });
    expect(onOpenModal).toHaveBeenCalled();
  });
});
