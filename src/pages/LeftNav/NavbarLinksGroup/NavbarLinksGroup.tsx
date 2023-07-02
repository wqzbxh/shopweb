import { useEffect, useState } from 'react';
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  createStyles,
  rem,
} from '@mantine/core';
import { IconCalendarStats, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import localstorageUnits from '../../../utils/localstorageUnits';

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: 'block',
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

    fontSize: theme.fontSizes.sm,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  link: {
    fontWeight: 500,
    display: 'block',
    textDecoration: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    paddingLeft: rem(31),
    marginLeft: rem(30),
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    borderLeft: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },

  },

  subbox: {
    // fontWeight: 500,
    // marginLeft: rem(33),
    // width:'151px',
    // fontSize: 12
  },
  chevron: {
    transition: 'transform 200ms ease',
  },
}));

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string, menu_name: string }[];
  link: string;
  subActiveIndex: string;
  setActiveIndex?: (index: string) => void;
  setSubActiveIndex?: (index: string) => void;
  callback: () => void;
  isActive?: boolean;
  menu_name: string;
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, links, link, subActiveIndex, menu_name, callback, setActiveIndex, setSubActiveIndex, isActive }: LinksGroupProps) {
  // export function LinksGroup({ icon: Icon, label, initiallyOpened, links,link }: LinksGroupProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { classes, theme } = useStyles();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft;
  useEffect(() => {
    if (initiallyOpened) {
      setOpened(true);
    }
  }, [initiallyOpened]);

  const items = (hasLinks ? links : []).map((link) => {
    let subActiveBool = false;
    if (link.menu_name === subActiveIndex) {
      subActiveBool = true;
    }
    return (
      <Box className={`${classes.subbox} `} style={{ cursor: 'pointer' }} key={link.menu_name}>
        <Box onClick={() => handleSubMenuClick(link)} m={0} p={0}  >
          <Text
            className={` ${subActiveBool ? "navSubBoxActive" : "navSubBox"} ${classes.link}`}
            onClick={(event) => event.preventDefault()}
          >
            {link.menu_name}
          </Text>
        </Box>

      </Box>)
  });


  function handleSubMenuClick(sublink: object): void {
    const subLable = (sublink as any).menu_name;
    const subLink = (sublink as any).link;
    localstorageUnits.savePath({ currentChildrenActivePath: sublink });
    localstorageUnits.savePath({ currentPreChildrenActivePath: sublink });
    localstorageUnits.savePath({ currentActiveIndex: menu_name });
    localstorageUnits.savePath({ currentPreActiveIndex: menu_name });
    const currentUrl = location.pathname;
    localstorageUnits.savePath({ currentUrl: currentUrl });
    setSubActiveIndex && setSubActiveIndex(subLable);
    setActiveIndex && setActiveIndex(menu_name);
    callback();
    navigate(subLink);
  }

  function handleMenuClick(path: string): void {
    const cleanedPath = path.replace('/', ''); // Remove the slope character `/`
    if (cleanedPath) {
      const capitalizedPath = cleanedPath.charAt(0).toUpperCase() + cleanedPath.slice(1); // The first letters, match Label
      localstorageUnits.savePath({ currentActiveIndex: menu_name })
      localstorageUnits.savePath({ currentPreActiveIndex: menu_name })
      const currentUrl = location.pathname;
      localstorageUnits.savePath({ currentUrl: currentUrl })
    }
    setActiveIndex && setActiveIndex(menu_name)
    setSubActiveIndex && setSubActiveIndex('');
    callback();
    navigate(link);
  }

  function handNolinksMenu(flink: string): void {
    setOpened((o) => !o)
    let initiallyOpeneds = {
      menu_name: menu_name,
      opened: !opened,
    }
    setActiveIndex && setActiveIndex(menu_name)
    localstorageUnits.savePath({ initiallyOpeneds: initiallyOpeneds })
    callback();
    navigate(flink);
  }
  return (
    <>


      {hasLinks ? <UnstyledButton onClick={() => handNolinksMenu(link)} className={`navBarMo ${isActive ? "navBar" : ""}   ${classes.control}`}>
        <Group position="apart" spacing={0}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="dark" size={30}>
              <Icon size="1.1rem" />
            </ThemeIcon>
            <Box ml="md">{menu_name}</Box>
          </Box>
          {hasLinks && (
            <ChevronIcon
              className={classes.chevron}
              size="1rem"
              stroke={1.5}
              style={{
                transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)` : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton> : <UnstyledButton onClick={() => handleMenuClick(link)} className={`navBarMo ${isActive ? "navBar" : ""}   ${classes.control}`}>
        <Group position="apart" spacing={0}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="dark" size={30}>
              <Icon size="1.1rem" />
            </ThemeIcon>
            <Box ml="md">{menu_name}</Box>
          </Box>
          {hasLinks && (
            <ChevronIcon
              className={classes.chevron}
              size="1rem"
              stroke={1.5}
              style={{
                transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)` : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      }
      {hasLinks ? <Collapse my={2} in={opened}>{items}</Collapse> : null}
    </>
  );
}

const mockdata = {
  label: 'Releases',
  icon: IconCalendarStats,
  link: '',
  menu_name: '',
  links: [
    { label: 'Upcoming releases', link: '/', menu_name: '' },
    { label: 'Previous releases', link: '/', menu_name: '' },
    { label: 'Releases schedule', link: '/', menu_name: '' },
  ],
};

export function NavbarLinksGroup() {
  return (
    <Box
      sx={(theme) => ({
        minHeight: rem(220),
        padding: theme.spacing.md,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
      })}
    >
      <LinksGroup subActiveIndex={''} callback={function (): void {
        throw new Error('Function not implemented.');
      }} {...mockdata} />
    </Box>
  );
}