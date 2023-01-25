import { useAtom } from "jotai";

import MultiSelect from "@rowy/multiselect";
import { AutocompleteProps, Avatar, Box, Stack } from "@mui/material";

import { projectScope, allUsersAtom } from "@src/atoms/projectScope";
import { IEditorCellProps } from "@src/components/fields/types";

import { createFilterOptions } from "@mui/material/Autocomplete";
import { useMemo } from "react";
// import { sanitiseValue } from "../SingleSelect/utils";

export type UserDataType = {
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
};

type UserOptionType = {
  label: string;
  value: string;
  user: UserDataType;
};

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

  const options = useMemo(() => {
    let options: UserOptionType[] = [];
    let emails = new Set();
    for (const user of users) {
      if (user.user && user.user?.email) {
        if (!emails.has(user.user.email)) {
          emails.add(user.user.email);
          options.push({
            label: user.user.email,
            value: user.user.email,
            user: user.user,
          });
        }
      }
    }
    return options;
  }, [users]);

  const filterOptions = createFilterOptions({
    trim: true,
    ignoreCase: true,
    matchFrom: "start",
    stringify: (option: UserOptionType) => option.user.displayName || "",
  });

  const renderOption: AutocompleteProps<
    UserOptionType,
    false,
    false,
    false
  >["renderOption"] = (props, option, { selected }) => {
    return <UserListItem user={option.user} {...props} />;
  };

  return (
    <MultiSelect
      value={value || []}
      options={options}
      label={column.name}
      labelPlural={column.name}
      multiple={true}
      onChange={onChange}
      disabled={disabled}
      clearText="Clear"
      doneText="Done"
      {...{
        AutocompleteProps: {
          renderOption,
          filterOptions,
        },
      }}
      onClose={() => {
        onSubmit();
        showPopoverCell(false);
      }}
      // itemRenderer={(option: UserOptionType) => <UserListItem user={option.user} />}
      TextFieldProps={{
        style: { display: "none" },
        SelectProps: {
          open: true,
          MenuProps: {
            anchorEl: parentRef,
            anchorOrigin: { vertical: "bottom", horizontal: "center" },
            transformOrigin: { vertical: "top", horizontal: "center" },
            sx: {
              "& .MuiPaper-root": { minWidth: `${column.width}px !important` },
            },
          },
        },
      }}
    />
  );
}

const UserListItem = ({ user, ...props }: { user: UserDataType }) => {
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
            {user.displayName ? user.displayName[0] : ""}
          </Avatar>
          <span>{user.displayName}</span>
        </Stack>
      </Box>
    </li>
  );
};
