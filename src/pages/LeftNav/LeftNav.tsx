import { Navbar, ScrollArea, createStyles, rem, useMantineColorScheme } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { UserButton } from './UserButton/UserButton';
import { LinksGroup } from './NavbarLinksGroup/NavbarLinksGroup';
import { Logo } from './Logo';
import localstorageUnits from '../../utils/localstorageUnits';
import { useNavigate } from 'react-router-dom';
import { getIconComponent } from '../../config/menuConfig';
import memoryUtils from '../../utils/memoryUtils';
import { notifications } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';

interface MenuItem {
  icon: React.FC<any>;
  label: string;
  link:string;
  [key:string]:any;
  links?: { label: string; link: string,menu_name:string}[];
}

const convertMenuData = (data: any[]): MenuItem[] => {
  if (!data) {
    return []; // 如果 data 为 undefined 或 null，返回一个空数组或其他默认值
  }

  return data.map((item) => {
    const menuItem: MenuItem = {
      label: item.menu_label,
      menu_name: item.menu_name,
      link:item.menu_link,
      icon: getIconComponent(item.icon), // 你可以根据实际情况提供一个默认的 React 组件
    };

    if (item.children.length > 0) {
      menuItem.links = convertMenuLinks(item.children);
    }

    return menuItem;
  });
};


const convertMenuLinks = (links: any[]): { label: string; link: string,menu_name:string }[] => {
  return links.map((link) => {
    return {
      label: link.menu_label,
      menu_name: link.menu_name,
      link: link.menu_link,
    };
  });
};

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
    zIndex:0
  },

  links: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

interface INavProps {
  callback: () => void;
}
export function Left({ callback }: INavProps) {
  const navigate = useNavigate();
  const userExists = memoryUtils.user;

  const [activeIndex, setActiveIndex] = useState(' '); // The activation status of the management menu item
  const [subActiveIndex, setSubActiveIndex] = useState(' '); // The activation status of the management sub -menu item
  const [initiallyOpeneds, setInitiallyOpeneds] = useState('');
  // 渲染
  useEffect(() => {
    let storagePath = localstorageUnits.getPath();
    if (storagePath && Object.keys(storagePath).length > 0) {
      storagePath.currentActiveIndex
        ? setActiveIndex && setActiveIndex(storagePath.currentActiveIndex)
        : setActiveIndex && setActiveIndex(storagePath.currentPreActiveIndex);
      if (storagePath.currentChildrenActivePath) {
        storagePath.currentChildrenActivePath.menu_name ? setSubActiveIndex && setSubActiveIndex(storagePath.currentChildrenActivePath.menu_name)
          : setSubActiveIndex && setSubActiveIndex(storagePath.currentPreChildrenActivePath.label);
      }
      setInitiallyOpeneds(storagePath.initiallyOpeneds ? storagePath.initiallyOpeneds : []);
    }
  }, []);
  
  React.useEffect(() => {
    const userExists = memoryUtils.user;
    if (!userExists.user_id) {
      notifications.show({
        title: 'Warning',
        color: 'yellow.7',
        icon: <IconX size="1.5rem" />,
        message: 'No user information, please log in',
      });
      navigate('/login');
    }
  }, []);
  const originalData: any[] = localstorageUnits.getUser().menuInfo;
  const mockdata: MenuItem[] = convertMenuData(originalData);
  const { classes } = useStyles();
  // const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);
  // 菜单回调
  const navBread = () => {
    callback()
  }
  const links = mockdata.map((item, index) => {
    let activeBool = false;
    let initiallyOpened = false;
    if (item.menu_name === activeIndex) {
      activeBool = true;
    }
    ;
    if ((initiallyOpeneds as any).opened == true && item.menu_name == (initiallyOpeneds as any).menu_name) { initiallyOpened = true; };
    return (
      <LinksGroup
        menu_name={item.menu_name}
        icon={item.icon}
        label={item.label}
        links={item.links}
        subActiveIndex={subActiveIndex}
        link={item.link}
        initiallyOpened={initiallyOpened}
        setActiveIndex={setActiveIndex}
        setSubActiveIndex={setSubActiveIndex}
        callback={navBread}
        key={item.menu_name}
        isActive={activeBool}
      />
    );
  });
  

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Navbar height="94vh" width={{ sm: 250 }} p="md"  className={classes.navbar}>
      <Navbar.Section grow className={classes.links}  component={ScrollArea}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>
    </Navbar>
  );
}
