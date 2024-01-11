import NewNav from "../components/NewNav";
import Carousel from "../components/Carousel";

export default function HomeLayout({ children }) {
	return (
		<>
			<NewNav />
			<Carousel />
			{children}
		</>
	);
}
