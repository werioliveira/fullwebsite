import { Suspense } from 'react';
import useSWR from 'swr'
import Loading from '../loading';
const fetcher = (...args) => fetch(...args).then(res => res.json())

const GetCategories = ({ isChecked, handleSelectedFilterOptions }) => {

    const { data: categories, error: categoriesError, isLoading: categoriesIsLoading } = useSWR('/api/categories', fetcher)
    const { data: subcategories, error: subcategoriesError, isLoading: subcategoriesIsLoading } = useSWR('/api/subcategories', fetcher)

    let fetchedCategories
    let fetchedSubCategories
	if(categoriesIsLoading || subcategoriesIsLoading){
		return <Loading/>
	}
    if(!categoriesError && !subcategoriesError){
        fetchedCategories = categories.map((category) => category.category)
        fetchedSubCategories = subcategories.map((subcategory) => subcategory.subCategory)
        const filterOptions = [
            {
                id: "categories",
                title: "Categories",
                options: fetchedCategories,
                type: "checkbox",
            },
            {
                id: "subcategories",
                title: "Sub Categories",
                options: fetchedSubCategories,
                type: "checkbox",
            },
        ];
        return (

                <>
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
		</>
        );
    }
    
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