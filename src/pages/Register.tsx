import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import {
  GoogleOutlined,
  TwitterOutlined,
  GithubOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  Flex,
  Stack,
  HStack,
  Text,
  Link,
  FormControl,
  Button,
  ButtonGroup,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { FormikErrors, useFormik } from "formik";

type FormValues = {
  email: string;
  name: string;
  mobile: string;
  password: string;
  confirmPW: string;
};

export default function Register() {
  const [formError, setFormError] = useState<Boolean>(false);

  let navigate = useNavigate();

  const directToLogin = () => {
    navigate("/login");
  };
  const icons = [
    { name: "Google", icon: <GoogleOutlined style={{ fontSize: "1.5rem" }} /> },
    {
      name: "Twitter",
      icon: <TwitterOutlined style={{ fontSize: "1.5rem" }} />,
    },
    { name: "Github", icon: <GithubOutlined style={{ fontSize: "1.5rem" }} /> },
  ];

  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      name: "",
      mobile: "",
      password: "",
      confirmPW: "",
    },
    validate: (data: any) => {
      let errors: FormikErrors<any> = {};

      const fields = ["email", "name", "mobile", "password", "confirmPW"];

      fields.forEach((field: any) => {
        if (!data[field]) {
          errors[field] = `${field.slice(0)} is required`;
        }
      });

      return errors;
    },
    onSubmit: (data) => {},
  });

  const getErrorMsg = useMemo(() => {
    const fields: (keyof FormValues)[] = [
      "confirmPW",
      "password",
      "mobile",
      "name",
      "email",
    ];
    let errorMsg = "";

    fields.forEach((field) => {
      if (formik.touched[field] && formik.errors[field]) {
        errorMsg = `${formik.errors[field]} `;
        setFormError(true);
      }
    });

    return (
      formError && (
        <small className="p-error" style={{ color: "red" }}>
          {errorMsg}
        </small>
      )
    );
  }, [formik.touched, formik.errors, formError]);

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
        height={"580px"}
        width={"450px"}
        borderRadius={10}
        p="1.5rem"
      >
        <form onSubmit={formik.handleSubmit}>
          <Stack marginBottom={"2rem"}>
            <img src={logo} style={{ height: 50 }} />
          </Stack>

          <FormControl>
            <Stack>
              <InputGroup marginBlock="5px">
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

              <InputGroup marginBottom="5px">
                <InputLeftElement pointerEvents="none" color="gray">
                  {<UserOutlined />}
                </InputLeftElement>
                <Input
                  name="name"
                  type="text"
                  placeholder="Full name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </InputGroup>

              <InputGroup marginBottom="5px">
                <InputLeftElement pointerEvents="none" color="gray">
                  {<UserOutlined />}
                </InputLeftElement>
                <Input
                  name="mobile"
                  type="text"
                  placeholder="Mobile"
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                />
              </InputGroup>

              <InputGroup marginBottom="5px">
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

              <InputGroup marginBottom="30px">
                <InputLeftElement pointerEvents="none" color="gray">
                  {<LockOutlined />}
                </InputLeftElement>
                <Input
                  name="confirmPW"
                  type="password"
                  placeholder="Confirm Password"
                  value={formik.values.confirmPW}
                  onChange={formik.handleChange}
                />
              </InputGroup>
              {getErrorMsg}
            </Stack>
          </FormControl>

          <Stack>
            <Button type="submit" backgroundColor="orange.500" color="white">
              Sign in
            </Button>
            <HStack justifyContent={"center"} margin="1rem">
              <Text>Already have an account?</Text>
              <Link color="blue" onClick={directToLogin}>
                Sign in
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
