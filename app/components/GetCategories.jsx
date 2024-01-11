import React, { Suspense, useEffect, useState } from "react";
import Loading from "../loading";

async function getCat() {
	const res = await fetch(
		process.env.NEXT_PUBLIC_APP_BASE_URL + `/api/categories/`,
		{
			method: "GET",
		},
	);
	return await res.json();
}
async function getSubCategory() {
	const res = await fetch(
		process.env.NEXT_PUBLIC_APP_BASE_URL + `/api/subcategories/`,
		{
			method: "GET",
		},
	);
	return await res.json();
}

const GetCategories = ({ isChecked, handleSelectedFilterOptions }) => {
	const [cat, setCat] = useState([]);
	const [subcat, setSubCat] = useState([]);
	const getCategories = getCat();
	const getSubCategories = getSubCategory();
	useEffect(() => {
		const makeRequest = async () => {
			try {
				const [categories, subcategories] = await Promise.all([
					getCategories,
					getSubCategories,
				]);

				setCat(categories.map((category) => category.category));
				setSubCat(subcategories.map((subCategory) => subCategory.subCategory));
			} catch (error) {
				console.log(error);
			}
		};
		makeRequest();
	}, []);
	const filterOptions = [
		{
			id: "categories",
			title: "Categories",
			options: cat,
			type: "checkbox",
		},
		{
			id: "subcategories",
			title: "Sub Categories",
			options: subcat,
			type: "checkbox",
		},
	];
	return (
		<>
			<Suspense fallback={<Loading />}>
				{filterOptions.map(({ id, title, type, options }) => {
					return (
						<div
							className="border-b pb-4"
							key={id}>
							<p className="font-medium mb-4">{title}</p>
							<div className="space-y-2">
								{options.map((value, index) => {
									return (
										<div
											className="flex items-center gap-4"
											key={index}>
											<CheckBoxAndRadioItem
												type={type}
												name={id}
												id={value.toLocaleLowerCase().trim()}
												label={value}
												value={value.toLocaleLowerCase().trim()}
												checked={isChecked(id, value)}
												onChange={handleSelectedFilterOptions}
											/>
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</Suspense>
		</>
	);
};
function CheckBoxAndRadioItem({ id, label, ...props }) {
	return (
		<>
			<input
				id={id}
				className="w-4 h-4 shrink-0"
				{...props}
			/>
			<label
				htmlFor={id}
				className="text-sm">
				{label}
			</label>
		</>
	);
}
export default GetCategories;
