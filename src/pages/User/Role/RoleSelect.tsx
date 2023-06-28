import { useListState, randomId } from '@mantine/hooks';
import { Checkbox } from '@mantine/core';
import { MenuItem } from '../../../interface/Irole';

const initialValues = [
  { label: 'Receive email notifications', checked: false, key: randomId() },
  { label: 'Receive sms notifications', checked: false, key: randomId() },
  { label: 'Receive push notifications', checked: false, key: randomId() },
];
interface IndeterminateCheckboxProps{
    items:MenuItem;
}

interface MenuItems {
    id: number;
    menu_name: string;
    menu_tag: string | null;
    icon: string | null;
    menu_link: string;
    menu_label: string;
    pid: number;
    menu_order: number;
    admin_permission_id: number | null;
    level: number;
    children: MenuItems[];
  }
  
  interface InitialValue {
    label: string;
    checked: boolean;
    key: string;
  }
export function IndeterminateCheckbox({items}:IndeterminateCheckboxProps) {
  const [values, handlers] = useListState(initialValues);
  const allChecked = values.every((value) => value.checked);
  const indeterminate = values.some((value) => value.checked) && !allChecked;

  let convertChildrenToInitialValues = (items: MenuItem): InitialValue[] => {
    return items.children.map((child) => ({
      label: child.menu_name,
      checked: false,
      key: String(child.id),
    }));
  };
  
  const itemss = convertChildrenToInitialValues(items).map((value, index) => (
    <Checkbox
      mt="xs"
      ml={33}
      label={value.label}
      key={value.key}
      checked={value.checked}
      onChange={(event) => handlers.setItemProp(index, 'checked', event.currentTarget.checked)}
    />
  ));
  
  
  return (
    <>
      <Checkbox
        checked={allChecked}
        indeterminate={indeterminate}
        label="Receive all notifications"
        transitionDuration={0}
        onChange={() =>
          handlers.setState((current) =>
            current.map((value) => ({ ...value, checked: !allChecked }))
          )
        }
      />
      {itemss}
    </>
  );
}