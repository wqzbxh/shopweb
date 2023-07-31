import { useState } from 'react';
import dayjs from 'dayjs';
import { createStyles, UnstyledButton, Text, Paper, Group, rem, Box } from '@mantine/core';
import {
  IconSwimming,
  IconBike,
  IconRun,
  IconChevronDown,
  IconChevronUp,
} from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  root: {
    backgroundImage: `linear-gradient(-60deg, ${theme.colors[theme.primaryColor][4]} 0%, ${
      theme.colors[theme.primaryColor][7]
    } 100%)`,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    display: 'flex',

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  icon: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing.lg,
    color: theme.colors[theme.primaryColor][6],
  },

  stat: {
    minWidth: rem(98),
    paddingTop: theme.spacing.xl,
    minHeight: rem(140),
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: theme.white,
  },

  label: {
    textTransform: 'uppercase',
    fontWeight: 700,
    fontSize: theme.fontSizes.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.colors.gray[6],
    lineHeight: 1.2,
  },

  value: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 700,
    color: theme.black,
  },

  count: {
    color: theme.colors.gray[6],
  },

  day: {
    fontSize: rem(44),
    fontWeight: 700,
    color: theme.white,
    lineHeight: 1,
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  month: {
    fontSize: theme.fontSizes.sm,
    color: theme.white,
    lineHeight: 1,
    textAlign: 'center',
  },

  controls: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: `calc(${theme.spacing.xl} * 2)`,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 0,
      marginBottom: theme.spacing.xl,
    },
  },

  date: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  control: {
    height: rem(28),
    width: '100%',
    color: theme.colors[theme.primaryColor][2],
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    transition: 'background-color 50ms ease',

    [theme.fn.smallerThan('xs')]: {
      height: rem(34),
      width: rem(34),
    },

    '&:hover': {
      backgroundColor: theme.colors[theme.primaryColor][5],
      color: theme.white,
    },
  },

  controlIcon: {
    [theme.fn.smallerThan('xs')]: {
      transform: 'rotate(-90deg)',
    },
  },
}));

const data = [
  { icon: IconRun, label: 'Running' },
  { icon: IconSwimming, label: 'Swimming' },
  { icon: IconBike, label: 'Bike' },
];

export default function Home() {
  const { classes } = useStyles();
  const [date, setDate] = useState(new Date(2021, 9, 24));

  const stats = data.map((stat) => (
    <Paper className={classes.stat} radius="md" shadow="md" p="xs" key={stat.label}>
      <stat.icon size={32} className={classes.icon} stroke={1.5} />
      <div>
        <Text className={classes.label}>{stat.label}</Text>
        <Text fz="xs" className={classes.count}>
          <span className={classes.value}>{Math.floor(Math.random() * 6 + 4)}km</span> / 10km
        </Text>
      </div>
    </Paper>
  ));

  return (
    <Box className='text-center' m={20}>
        <Text c='#666' size={20} fw={500}>天上月，人间月，负笈求学肩上月，登高凭栏眼中月，竹篮打水碎又圆。山间风，水边风，御剑远游脚下风，圣贤书斋翻书风，风吹浮萍有相逢</Text>
    </Box>
  );
}