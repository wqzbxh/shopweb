import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { IconCheck, IconLock,IconMail,IconUserBolt, IconX } from "@tabler/icons-react";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import { Notifications, notifications } from '@mantine/notifications';
import { apiLogin, apiRegister, apiSentEmail } from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import localstorageUnits from "../../utils/localstorageUnits";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: "100vh",
    backgroundSize: "cover",
    backgroundImage:
      "url(https://pic.rmb.bdstatic.com/bjh/beautify/b8c682fac89705dbefd76f6501a5ead7.jpeg@c_1,w_2793,h_1974,x_0,y_0)",
  },

  form: {
    borderRight: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: "100vh",
    maxWidth: rem(450),
    paddingTop: rem(80),
      backgroundImage:
    "url(https://picnew13.photophoto.cn/20190123/jianyuejihetuxingpinjieshangwubangonghaibaopptbeijing-32407767_1.jpg)",
    [theme.fn.smallerThan("sm")]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

function Login() {
  const navigate = useNavigate();
  const [type, toggle] = useToggle(["login", "register"]);
  const [reSentEmail, SetSentEmail] = useState(false);
  const form = useForm({
    initialValues: {
      email: "wqzbxh@163.com",
      name: "",
      password: "admin123",
      login_ldap:false,
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

 const { classes } = useStyles();
 const sentEmailRequest = async () => {
      const response = await apiSentEmail(form.values,'POST');
      const result = response.data;
      if (result.code === 200) {
          SetSentEmail(false)
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
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Stop the formal submission of the form default
    // Verification form
    const valid = await form.validate();
    if (!valid.hasErrors) {
        let response ; 
        if(type ==='register'){
           response = await apiRegister(form.values,'POST');
        }else{
            response = await apiLogin(form.values,'POST');
        }

        const result = response.data;
        if (result.code === 200) {
            const username = result.data;
            memoryUtils.user = username;
            localstorageUnits.saveUser(username)
            notifications.show({
                title: 'Hint',
                color: 'green',
                icon: <IconCheck  />,
                message: result.msg,
            })
            navigate('/')
        } else {
          if(result.code===20007){
            SetSentEmail(true)
          }
            //Login failed
            console.log(result)
            notifications.show({
                title: 'Login Error',
                color: 'red',
                icon: <IconX  />,
                message: result.msg,
            })
            
        }
    }
};
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
              春风随我作狮子鸣
        </Title>

        <form onSubmit={handleFormSubmit}>
          <Stack>
            {type === "register" && (
              <TextInput
                label="名称"
                placeholder="名称"
                icon={<IconUserBolt />}
                value={form.values.name}
                size='md'
                onChange={(event) =>
                  form.setFieldValue("name", event.currentTarget.value)
                }
                radius="md"
              />
            )}

            <TextInput
              required
              label="邮箱"
              icon={<IconMail />}
              placeholder="hello@jianlai.dev"
              value={form.values.email}
              size='md'
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "不合法的邮箱"}
              radius="md"
            />

            <PasswordInput
              required
              label="密码"
              icon={<IconLock />}
              size='md'
              placeholder="你的密码"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "密码应至少包含 6 个字符"
              }
              radius="md"
            />

            {type === "register" && (
              <Checkbox
                label="我接受条款和条件"
                checked={form.values.terms}
                onChange={(event) =>
                  form.setFieldValue("terms", event.currentTarget.checked)
                }
              />
            )}
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === "register"
                ? "已有帐户？登录"
                : "没有帐户？注册"}
            </Anchor>
            <Button type="submit" radius="xl">
            {type === "register"
                ? "注册"
                : "登录"}
            </Button>
            {reSentEmail ? 
              <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={()=>sentEmailRequest()}
              size="xs"
            >
              发送新邮件
            </Anchor>
            :''}
          </Group>
        </form>
      </Paper>
    </div>
  );
}

export default Login;
