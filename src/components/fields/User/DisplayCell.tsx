import { IDisplayCellProps } from "@src/components/fields/types";
import { Avatar, ButtonBase, Stack } from "@mui/material";
import { UserOption } from "./EditorCell";
import { ChevronDown } from "@src/assets/icons/ChevronDown";
import { useAtom } from "jotai";
import { allUsersAtom, projectScope } from "@src/atoms/projectScope";

export default function User({
  value,
  showPopoverCell,
  disabled,
  tabIndex,
}: IDisplayCellProps) {
  const [users] = useAtom(allUsersAtom, projectScope);

  let userValue;
  for (const user of users) {
    if (user.user && user.user?.email === value) {
      userValue = {
        displayName: user.user.displayName,
        photoURL: user.user.photoURL,
        email: value,
      } as UserOption;
      break;
    }
  }

  if (!userValue) {
    return (
      <ButtonBase
        onClick={() => showPopoverCell(true)}
        style={{
          width: "100%",
          height: "100%",
          font: "inherit",
          color: "inherit !important",
          letterSpacing: "inherit",
          textAlign: "inherit",
          justifyContent: "flex-end",
        }}
        tabIndex={tabIndex}
      >
        <ChevronDown className="row-hover-iconButton end" />
      </ButtonBase>
    );
  }

  const rendered = (
    <Stack
      spacing={0.75}
      direction="row"
      alignItems="center"
      style={{
        flexGrow: 1,
        overflow: "hidden",
        paddingLeft: "var(--cell-padding)",
      }}
    >
      <Avatar
        alt="Avatar"
        src={userValue.photoURL}
        style={{ width: 20, height: 20 }}
      />
      <span>{userValue.displayName}</span>
    </Stack>
  );

  if (disabled) {
    return rendered;
  }
  return (
    <ButtonBase
      onClick={() => showPopoverCell(true)}
      style={{
        width: "100%",
        height: "100%",
        font: "inherit",
        color: "inherit !important",
        letterSpacing: "inherit",
        textAlign: "inherit",
        justifyContent: "flex-start",
      }}
      tabIndex={tabIndex}
    >
      {rendered}
      <ChevronDown className="row-hover-iconButton end" />
    </ButtonBase>
  );
}
