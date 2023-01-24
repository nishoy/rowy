import { useAtom } from "jotai";

import MultiSelect from "@rowy/multiselect";
import { AutocompleteProps, Avatar, Box, Stack } from "@mui/material";

import { projectScope, allUsersAtom } from "@src/atoms/projectScope";
import { IEditorCellProps } from "@src/components/fields/types";

import { createFilterOptions } from "@mui/material/Autocomplete";

export type UserOption = {
  displayName: string;
  photoURL: string;
  email: string;
};

export interface IUserSelectProps {
  options?: UserOption[];
}

export default function UserSelect({
  value,
  onChange,
  onSubmit,
  parentRef,
  column,
  showPopoverCell,
  disabled,
}: IEditorCellProps) {
  const [users] = useAtom(allUsersAtom, projectScope);
  let userValue;
  for (const user of users) {
    if (user.user && user.user?.email === value) {
      userValue = {
        displayName: user.user.displayName,
        photoURL: user.user.photoURL,
        email: value,
      } as UserOption;
    }
  }

  let options: { value: string; label: string; user: UserOption }[] = [];

  let emails = new Set();
  for (const user of users) {
    if (user.user && user.user?.email) {
      if (!emails.has(user.user.email)) {
        emails.add(user.user.email);
        options.push({
          label: user.user.email,
          value: user.user.email,
          user: {
            displayName: user.user.displayName,
            photoURL: user.user.photoURL,
            email: value,
          } as UserOption,
        });
      }
    }
  }

  const filterOptions = createFilterOptions({
    trim: true,
    ignoreCase: true,
    matchFrom: "start",
    stringify: (option: { value: string; label: string; user: UserOption }) =>
      option.user.displayName,
  });

  const renderOption: AutocompleteProps<
    any,
    true,
    false,
    any
  >["renderOption"] = (props, option, { selected }) => {
    return <UserListItem user={option.user} {...props} />;
  };
  return (
    <MultiSelect
      value={userValue?.displayName}
      options={options}
      label={column.name}
      labelPlural={column.name}
      multiple={false}
      onChange={onChange}
      disabled={disabled}
      {...{
        AutocompleteProps: {
          renderOption,
          filterOptions,
        },
      }}
      onClose={() => {
        showPopoverCell(false);
        onSubmit();
      }}
      itemRenderer={(option) => <UserListItem user={option.user} />}
      TextFieldProps={{
        style: { display: "none" },
        SelectProps: {
          open: true,
          MenuProps: {
            anchorEl: parentRef,
            anchorOrigin: { vertical: "bottom", horizontal: "left" },
            transformOrigin: { vertical: "top", horizontal: "left" },
            sx: {
              "& .MuiAutocomplete-listbox .MuiAutocomplete-option[aria-selected=true]":
                {
                  backgroundColor: "transparent",
                },
            },
          },
        },
      }}
    />
  );
}

const UserListItem = ({ user, ...props }: { user: UserOption; sx?: any }) => {
  return (
    <li {...props}>
      <Box sx={[{ position: "relative" }]}>
        <Stack
          spacing={0.75}
          direction="row"
          alignItems="center"
          style={{ width: "100%" }}
        >
          <Avatar
            alt="Avatar"
            src={user.photoURL}
            sx={{
              width: 20,
              height: 20,
              fontSize: "inherit",
              marginRight: "6px",
            }}
          >
            {user.displayName[0]}
          </Avatar>
          <span>{user.displayName}</span>
        </Stack>
      </Box>
    </li>
  );
};
