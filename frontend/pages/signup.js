import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	Stack,
	Link,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Center,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import axios from "axios";
import React from "react";
import { useRouter } from "next/router";

export default function SimpleCard() {
	const router = useRouter();
	const [data, setData] = React.useState({
		email: "",
		password: "",
		username: "",
	});
	const handelChange = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("/v1/auth/signup", data);
			console.log(response);
			router.push("/login");
		} catch (error) {
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
					<Heading fontSize={"4xl"}>Create your account</Heading>
					<Text fontSize={"lg"} color={"gray.600"}>
						to enjoy all of our cool <Link color={"blue.400"}>features</Link> ✌️
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
							<FormLabel>Username</FormLabel>
							<Input
								type="text"
								value={data.username}
								name="username"
								onChange={handelChange}
							/>
						</FormControl>

						<FormControl id="email">
							<FormLabel>Email address</FormLabel>
							<Input
								type="email"
								value={data.email}
								name="email"
								onChange={handelChange}
							/>
						</FormControl>
						<FormControl id="password">
							<FormLabel>Password</FormLabel>
							<Input
								type="password"
								value={data.password}
								name="password"
								onChange={handelChange}
							/>
						</FormControl>
						<Stack spacing={10}>
							<Button
								onClick={handleSubmit}
								bg={"blue.400"}
								color={"white"}
								_hover={{
									bg: "blue.500",
								}}
							>
								Signup
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
								<Text>Signup with Google</Text>
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
								<Text color="white">Signup with Github</Text>
							</Center>
						</Button>
					</Stack>
				</Stack>
			</Stack>
		</Flex>
	);
}
