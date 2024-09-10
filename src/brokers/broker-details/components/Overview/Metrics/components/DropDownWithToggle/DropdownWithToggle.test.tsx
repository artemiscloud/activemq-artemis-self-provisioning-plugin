import { fireEvent, render, waitForI18n } from '@app/test-utils';
import { DropdownWithToggle } from './DropdownWithToggle';

describe('PreConfirmDeleteModal', () => {
  const dropdownItems = [
    {
      key: '5m',
      value: '5m',
      label: 'last 5 minutes',
      isDisabled: false,
    },
    {
      key: '15m',
      value: '15m',
      label: 'last 15 minutes',
      isDisabled: false,
    },
    {
      key: '1h',
      value: '1h',
      label: 'last 1 hour',
      isDisabled: false,
    },
    {
      key: '1d',
      value: '1d',
      label: 'last 1 day',
      isDisabled: false,
    },
  ];

  const onSelectOption = jest.fn();

  it('should renders DropdownWithToggle component and selects an option', async () => {
    const comp = render(
      <DropdownWithToggle
        id="test-dropdown"
        toggleId="test-dropdowntoggle"
        items={dropdownItems}
        value="5m"
        onSelectOption={onSelectOption}
        isLabelAndValueNotSame={true}
      />,
    );
    await waitForI18n(comp);
    const dropdownToggle = comp.getByTestId('dropdown-toggle');
    expect(dropdownToggle).toBeInTheDocument();

    fireEvent.click(dropdownToggle);

    const selectDropdownItem = comp.getByText('last 15 minutes');
    fireEvent.click(selectDropdownItem);

    expect(onSelectOption).toHaveBeenCalledWith('15m', undefined);
  });
});
