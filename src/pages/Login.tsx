import React from "react";
import logo from "../assets/logo.svg";
import {
  GoogleOutlined,
  TwitterOutlined,
  GithubOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Form } from "antd";
import {
  Flex,
  Stack,
  HStack,
  Text,
  Link,
  FormControl,
  FormHelperText,
  Button,
  ButtonGroup,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FormikErrors, useFormik } from "formik";

export default function Login() {
  let navigate = useNavigate();
  const directToRegister = () => {
    navigate("/register");
  };

  const icons = [
    { name: "Google", icon: <GoogleOutlined style={{ fontSize: "1.5rem" }} /> },
    {
      name: "Twitter",
      icon: <TwitterOutlined style={{ fontSize: "1.5rem" }} />,
    },
    { name: "Github", icon: <GithubOutlined style={{ fontSize: "1.5rem" }} /> },
  ];

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (data) => {
      let errors: FormikErrors<any> = {};

      if (!data.email) {
        errors.email = "Email is required";
      }

      if (!data.password) {
        errors.password = "Password is required";
      }
      return errors;
    },
    onSubmit: (data) => {},
  });

  const getErrorMsg = () => {
    if (formik.touched.email && formik.errors.email) {
      return (
        <small className="p-error" style={{ color: "red" }}>
          {formik.errors.email}
        </small>
      );
    }

    if (formik.touched.password && formik.errors.password) {
      return (
        <small className="p-error" style={{ color: "red" }}>
          {formik.errors.password}
        </small>
      );
    }

    return null;
  };

  return (
    <Flex
      justifyContent="center"
      backgroundColor="gray.200"
      w={"full"}
      height={"100vh"}
      alignItems="center"
    >
      <Stack
        backgroundColor="white"
        height={"400px"}
        width={"350px"}
        borderRadius={10}
        p="1.5rem"
      >
        <form onSubmit={formik.handleSubmit}>
          <Stack marginBottom={"2rem"}>
            <img src={logo} style={{ height: 50 }} />
          </Stack>

          <FormControl>
            <Stack>
              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray">
                  {<UserOutlined />}
                </InputLeftElement>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
              </InputGroup>

              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray">
                  {<LockOutlined />}
                </InputLeftElement>
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
              </InputGroup>
              {getErrorMsg()}
            </Stack>

            <FormHelperText textAlign="right" marginBottom={"1rem"}>
              <Link>forgot password?</Link>
            </FormHelperText>
          </FormControl>

          <Stack>
            <Button type="submit" backgroundColor="orange.500" color="white">
              Sign in
            </Button>
            <HStack justifyContent={"center"} margin="1rem">
              <Text>Don't have an account?</Text>
              <Link color="blue" onClick={directToRegister}>
                Sign up
              </Link>
            </HStack>
          </Stack>

          <hr />
          <HStack justifyContent={"center"} margin="1rem">
            <ButtonGroup gap="2.5rem">
              {icons.map(({ name, icon }) => (
                <Button key={name} variant="unstyled" color="gray">
                  {icon}
                </Button>
              ))}
            </ButtonGroup>
          </HStack>
        </form>
      </Stack>
    </Flex>
  );
}
