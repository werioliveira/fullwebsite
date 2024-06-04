import Sidebar from "@/app/components/Sidebar";
import Carousel from "../../components/Carousel";
import NewNav from "../../components/NewNav";

export default function AdminLayout({ children }) {
	return (
		<>
			<NewNav />
			<div className="min-h-screen flex bg-gray-100">
				<Sidebar />
				<div className="w-full">{children}</div>
			</div>
		</>
	);
}
