import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Grid, Spinner, Text } from "@chakra-ui/react";

function MyComponent() {
	const [tooLong, setTooLong] = React.useState(false);
	const Route = useRouter();

	useEffect(() => {
		setTimeout(() => {
			setTooLong(true);
		}, 3000);
		const fragment = window.location.hash.substr(1);
		const params = new URLSearchParams(fragment);
		const accessToken = params.get("access_token");
		const expiresIn = params.get("expires_in");
		const state = params.get("state");

		const token = localStorage.getItem("auth-token");

		if (state === "login") {
			axios
				.get("/v1/auth/google?access_token=" + accessToken)
				.then((res) => {
					console.log(res.data);
					if (res.status === 200) {
						const { token } = res.data;
						localStorage.setItem("auth-token", token);
						Route.push("/settings");
					} else {
						console.log(res.data);
						Route.push("/");
					}
				})
				.catch((err) => {
					console.log(err);
					Route.push("/");
				});
		} else if (state === "connect") {
			axios
				.post(
					"/v1/user/connect/google?access_token=" + accessToken,
					{},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				)
				.then((res) => {
					console.log(res.data);
					if (res.status === 200) {
						//	TODO show success toast!
						Route.push("/settings");
					} else {
						console.log(res.data);
						Route.push("/");
					}
				})
				.catch((err) => {
					console.log(err);
					Route.push("/");
				});
		} else {
			console.log("state is not login");
			Route.push("/");
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
