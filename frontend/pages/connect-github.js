import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Grid, Spinner, Text } from "@chakra-ui/react";

export function getServerSideProps(context) {
	return {
		props: {
			code: context?.query?.code ?? "",
			state: context?.query?.state ?? "",
		},
	};
}

function MyComponent({ code, state }) {
	const [tooLong, setTooLong] = React.useState(false);
	const Route = useRouter();

	useEffect(() => {
		setTimeout(() => {
			setTooLong(true);
		}, 3000);
		if (!code) {
			console.log("no code");
			Route.push("/");
		}
		if (state === "connect") {
			const token = localStorage.getItem("auth-token");
			if (!token) {
				console.log("no token");
				Route.push("/");
			}
			axios
				.post(
					"/v1/user/connect/github?code=" + code,
					{
						code,
					},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				)
				.then((response) => {
					if (response?.ok) {
						console.log("success");
						Route.push("/settings");
					} else {
						console.log("error while connecting github");
						Route.push("/settings");
					}
				})
				.catch((err) => {
					console.log(err);
					Route.push("/settings");
				});
		} else if (state === "login") {
			axios
				.get("/v1/auth/github?code=" + code)
				.then((response) => {
					if (response.status === 200) {
						console.log("success");
						console.log(response.data);
						localStorage.setItem("auth-token", response.data.token);
						Route.push("/settings");
					} else {
						console.log("error while connecting github");
						Route.push("/");
					}
				})
				.catch((err) => {
					console.log(err);
					Route.push("/");
				});
		}
	}, []);

	return (
		<Grid p="4" h="100vh" w="full" placeContent="center">
			<Spinner size="xl" m="auto" mb={4} />
			<Text textAlign="center">Loading... Do not refresh the page.</Text>
			{tooLong && <Text>If it takes too long, try again later!</Text>}
		</Grid>
	);
}

export default MyComponent;
