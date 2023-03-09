import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Center,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub } from 'react-icons/bs';
import React from "react";
import axios from "axios";
import Router from "next/router";

export default function SimpleCard() {
	const [data, setData] = React.useState({
		email: "",
		password: "",
	});

	const handelChange = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};

	const handleSubmit = async () => {
		try {
			const response = await axios.post("/v1/auth/login", data);
			console.log(response);
			//saving the token from the response to the local storage
			localStorage.setItem("auth-token", response.data.token);
			//redirecting to the home page
			Router.push("/settings");
		} catch (error) {
			alert(error.response.data.message);
			console.log(error);
		}
	};

	function googleOauthSignIn() {
		// Google's OAuth 2.0 endpoint for requesting an access token
		const client_id =
			"536288404542-h35609dc6nb6puke6h0da1noavvuomn4.apps.googleusercontent.com";
		const redirect_uri = "http://localhost:3000/connect-google";
		const response_type = "token";
		const scope = "https://www.googleapis.com/auth/userinfo.email";
		const include_granted_scopes = "true";
		const state = "login";

		var oauth2Endpoint = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}&include_granted_scopes=${include_granted_scopes}&state=${state}`;

		// Open the OAuth 2.0 endpoint in the popup window
		var oauth2Window = window.open(oauth2Endpoint, "_self");
	}

	return (
		<Flex
			minH={"100vh"}
			align={"center"}
			justify={"center"}
			bg={useColorModeValue("gray.50", "gray.800")}
		>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"}>Login to your account</Heading>
					<Text fontSize={"lg"} color={"gray.600"}>
						to enjoy all of our cool <Link color={"blue.400"}>features</Link>
					</Text>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					p={8}
				>
					<Stack spacing={4}>
						<FormControl id="email">
							<FormLabel>Email address</FormLabel>
							<Input
								onChange={handelChange}
								name="email"
								type="email"
								value={data.email}
							/>
						</FormControl>
						<FormControl id="password">
							<FormLabel>Password</FormLabel>
							<Input
								onChange={handelChange}
								type="password"
								value={data.password}
								name="password"
							/>
						</FormControl>
						<Stack spacing={10}>
							<Stack
								direction={{ base: "column", sm: "row" }}
								align={"start"}
								justify={"space-between"}
							>
								<Checkbox>Remember me</Checkbox>
								<Link color={"blue.400"}>Forgot password?</Link>
							</Stack>
							<Button
								onClick={() => {
									handleSubmit();
								}}
								bg={"blue.400"}
								color={"white"}
								_hover={{
									bg: "blue.500",
								}}
							>
								Sign in
							</Button>
						</Stack>
					</Stack>
				</Box>
				<Stack spacing={5}>
					<Heading as="h3" size="md" color="gray.500" textAlign="center">
						OR
					</Heading>
					<Stack spacing="4">
						<Button
							w={"full"}
							maxW={"md"}
							variant={"outline"}
							bg={useColorModeValue("white", "gray.700")}
							leftIcon={<FcGoogle />}
							onClick={googleOauthSignIn}
						>
							<Center>
								<Text>Login with Google</Text>
							</Center>
						</Button>
						<Button
							w={"full"}
							maxW={"md"}
							variant={"outline"}
							bg={useColorModeValue("gray.700", "gray.700")}
							leftIcon={<BsGithub color="white" />}
							_hover={{
								bg: "gray.600",
							}}
							onClick={() =>
								window.open(
									"https://github.com/login/oauth/authorize?client_id=eced670322590ee87dc4&scope=user&state=login",
									"_self"
								)
							}
						>
							<Center>
								<Text color="white">Login with Github</Text>
							</Center>
						</Button>
					</Stack>
				</Stack>
			</Stack>
		</Flex>
	);
}
