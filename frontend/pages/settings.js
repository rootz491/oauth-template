import {
	Heading,
	Box,
	Center,
	Text,
	Stack,
	Button,
	useColorModeValue,
	Tag,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { BiLogOutCircle } from "react-icons/bi";
import axios from "axios";
import React from "react";

export default function SocialProfileSimple() {
	//github.com/login/oauth/authorize?client_id=eced670322590ee87dc4&scope=user
	const [user, setUser] = React.useState();
	const [isGithubConnected, setIsGithubConnected] = React.useState(false);
	const [isGoogleConnected, setIsGoogleConnected] = React.useState(false);

	React.useEffect(() => {
		fetchUser();
	}, []);

	const fetchUser = () => {
		const token = localStorage.getItem("auth-token");
		if (!token) {
			window.location.href = "http://localhost:3000/login";
		}
		axios
			.get("/v1/user", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				console.log(res.data);
				setUser(res.data);
				if (res.data?.user?.githubId) {
					setIsGithubConnected(true);
				} else {
					setIsGithubConnected(false);
				}
			})
			.catch((err) => console.log(err));
	};

	const handelGithubConnect = () => {
		window.open(
			"https://github.com/login/oauth/authorize?client_id=eced670322590ee87dc4&scope=user&state=connect",
			"_self"
		);
	};

	function handelGoogleConnect() {
		// Google's OAuth 2.0 endpoint for requesting an access token
		const client_id =
			"536288404542-h35609dc6nb6puke6h0da1noavvuomn4.apps.googleusercontent.com";
		const redirect_uri = "http://localhost:3000/connect-google";
		const response_type = "token";
		const scope = "https://www.googleapis.com/auth/userinfo.email";
		const include_granted_scopes = "true";
		const state = "connect";

		var oauth2Endpoint = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}&include_granted_scopes=${include_granted_scopes}&state=${state}`;

		// Open the OAuth 2.0 endpoint in the popup window
		var oauth2Window = window.open(oauth2Endpoint, "_self");
	}

	const handelGithubDisconnect = () => {
		const token = localStorage.getItem("auth-token");
		if (!token) {
			window.location.href = "http://localhost:3000/login";
		}
		axios
			.delete("/v1/user/connect/github", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				console.log(res.data);
				fetchUser();
			})
			.catch((err) => {
				alert(err.response.data.message);
				console.log(err);
			});
	};

	const handelDisConnectGoogle = () => {
		const token = localStorage.getItem("auth-token");
		if (!token) {
			window.location.href = "http://localhost:3000/login";
		}
		axios
			.delete("/v1/user/connect/google", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				console.log(res.data);
				fetchUser();
			})
			.catch((err) => {
				alert(err.response.data.message);
				console.log(err);
			});
	};

	const handleLogout = () => {
		localStorage.removeItem("auth-token");
		window.location.href = "http://localhost:3000/login";
	};

	return (
		<Center py={6}>
			<Box
				maxW={"380px"}
				w={"full"}
				bg={useColorModeValue("white", "gray.900")}
				boxShadow={"2xl"}
				rounded={"lg"}
				p={6}
				textAlign={"center"}
			>
				<Heading fontSize={"2xl"} fontFamily={"body"}>
					Hello, {user?.user.username}
				</Heading>
				<br />
				<Tag>{user?.user.email} </Tag>

				<Heading fontSize={"2xl"} fontFamily={"body"}>
					Register / Deregister to socials
				</Heading>
				<Stack mt={8} spacing={4}>
					{!isGithubConnected ? (
						<Button
							onClick={handelGithubConnect}
							w={"full"}
							maxW={"md"}
							variant={"outline"}
							bg={useColorModeValue("gray.700", "gray.700")}
							leftIcon={<BsGithub color="white" />}
							_hover={{
								bg: "gray.600",
							}}
						>
							<Center>
								<Text color="white">Connect with Github</Text>
							</Center>
						</Button>
					) : (
						<Button
							onClick={handelGithubDisconnect}
							w={"full"}
							maxW={"md"}
							variant={"outline"}
							bg={useColorModeValue("gray.700", "gray.700")}
							leftIcon={<BsGithub color="white" />}
							_hover={{
								bg: "gray.600",
							}}
						>
							<Center>
								<Text color="white">Disconnect Github</Text>
							</Center>
						</Button>
					)}
					{user?.user?.googleId ? (
						<Button
							w={"full"}
							maxW={"md"}
							onClick={handelDisConnectGoogle}
							variant={"outline"}
							bg={useColorModeValue("white", "gray.700")}
							leftIcon={<FcGoogle />}
						>
							<Center>
								<Text>Disconnect Google </Text>
							</Center>
						</Button>
					) : (
						<Button
							onClick={handelGoogleConnect}
							w={"full"}
							maxW={"md"}
							variant={"outline"}
							bg={useColorModeValue("white", "gray.700")}
							leftIcon={<FcGoogle />}
						>
							<Center>
								<Text>Connect with Google</Text>
							</Center>
						</Button>
					)}

					<Button
						w={"full"}
						maxW={"md"}
						onClick={handleLogout}
						variant={"outline"}
						border="2px"
						borderColor="red.500"
						bg={useColorModeValue("white", "red.700")}
						leftIcon={<BiLogOutCircle />}
						_hover={{
							bg: "red.500",
							color: "white",
						}}
					>
						<Center>
							<Text>Logout </Text>
						</Center>
					</Button>
				</Stack>
			</Box>
		</Center>
	);
}
