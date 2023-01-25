import { IDisplayCellProps } from "@src/components/fields/types";
import { Avatar, AvatarGroup, ButtonBase, Stack } from "@mui/material";
import { UserDataType } from "./EditorCell";
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

  let userValue: UserDataType[] = [];
  let emails = new Set();

  if (value !== undefined) {
    for (const user of users) {
      if (user.user && user.user?.email && value.includes(user.user.email)) {
        if (!emails.has(user.user.email)) {
          emails.add(user.user.email);
          userValue.push(user.user);
        }
      }
    }
  }

  if (userValue.length === 0) {
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
      {userValue.length > 1 ? (
        <AvatarGroup
          sx={{
            "& .MuiAvatar-root": { width: 24, height: 24, fontSize: 15 },
          }}
          max={5}
        >
          {userValue.map((user: UserDataType) => (
            <Avatar alt={user.displayName} src={user.photoURL} />
          ))}
        </AvatarGroup>
      ) : (
        <>
          <Avatar
            alt="Avatar"
            src={userValue[0].photoURL}
            style={{ width: 20, height: 20 }}
          />
          <span>{userValue[0].displayName}</span>
        </>
      )}
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
