import {
  createStyles,
  Header,
  Autocomplete,
  Group,
  Burger,
  rem,
  ActionIcon,
  useMantineColorScheme,
  Menu,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconLogout,
  IconMoonStars,
  IconSearch,
  IconSum,
  IconSun,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiLogout } from "../../api";
import localstorageUnits from "../../utils/localstorageUnits";
import memoryUtils from "../../utils/memoryUtils";
import { Logo } from "../Headernav/Logo";
import { UserButton } from "../LeftNav/UserButton/UserButton";

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },

  inner: {
    height: rem(56),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  links: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  search: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
}));

interface HeaderSearchProps {
  links: { link: string; label: string }[];
}

export default function HeaderSearch({ links }: HeaderSearchProps) {
  
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);
  const { classes } = useStyles();

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </a>
  ));
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  // 退出
    const LogoutHandle = async () => {
      const response = await apiLogout();
      const result = response.data;
      if (result.code === 200 || result.code === 20014) {
          localstorageUnits.saveUser({});
          navigate('/login');
          notifications.show({
              title: 'Hint',
              color: 'green',
              icon: <IconCheck  />,
              message: result.msg,
          })
      } else {
          //Login failed
          notifications.show({
              title: 'Login Error',
              color: 'red',
              icon: <IconX  />,
              message: result.msg,
          })
          
      }
};

const name = memoryUtils.user.name;
  return (
    <Header height="6vh" className={classes.header} mb={0}>
      <div className={classes.inner}>
        <Group>
          <Burger opened={opened} onClick={toggle} size="sm" />
          <Logo width={rem(120)} />
        </Group>
        <Group position="right">
        <Group>
          <Group ml={50} spacing={5} className={classes.links}>
            {items}
          </Group>
          <Autocomplete
            className={classes.search}
            placeholder="Search"
            icon={<IconSearch size="1rem" stroke={1.5} />}
            data={[
              "React",
              "Angular",
              "Vue",
              "Next.js",
              "Riot.js",
              "Svelte",
              "Blitz.js",
            ]}
          />
          
      <Menu  shadow="md" position='bottom'>
      <Menu.Target>
      <Button variant='subtle'>{name}</Button>
        </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component="a" href="#"   icon={<IconUser size={rem(14)} />}>
            个人中心
        </Menu.Item>
        
        <Menu.Item
          icon={<IconLogout size={rem(14)} />}
          onClick={LogoutHandle}
        >
          注销
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
        </Group>
        <Group position="center" my="xl">
          <ActionIcon
            onClick={() => toggleColorScheme()}
            size="lg"
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.yellow[4]
                  : theme.colors.blue[6],
            })}
          >
            {colorScheme === "dark" ? (
              <IconSun size="1.2rem" />
            ) : (
              <IconMoonStars size="1.2rem" />
            )}
          </ActionIcon>
        </Group>
        
        <Group position="center">


    </Group>
         </Group>
      </div>
    </Header>
  );
}
