import React from "react";
import NewNav from "./NewNav";
import Carousel from "./Carousel";

const MainLayout = ({ children }) => {
	return (
		<>
			<NewNav />
			<Carousel />
			{children}
		</>
	);
};

export default MainLayout;
