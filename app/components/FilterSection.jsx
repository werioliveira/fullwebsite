import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const colors = ["Red", "Green", "Blue", "Black", "Brown", "Pink"];
const categories = ["Men Cloth", "Women Cloth", "sapato"];
const sizes = ["S", "m", "L", "XL"];
const sortOrder = ["Newest", "Price Low", "Price High"];

const filterOptions = [
  {
    id: "sort",
    title: "Sorting Order",
    options: sortOrder,
    type: "radio",
  },
  {
    id: "categories",
    title: "Categories",
    options: categories,
    type: "checkbox",
  },
  {
    id: "colors",
    title: "Colors",
    options: colors,
    type: "checkbox",
  },
  {
    id: "sizes",
    title: "Sizes",
    options: sizes,
    type: "checkbox",
  },
];

function checkValidQuery(queries) {
  return queries.filter((query) => query !== "").length > 0;
}

function convertValidStringQueries(queries) {
  let q = "";
  for (let [key, value] of Object.entries(queries)) {
    q = q + `${q === "" ? "" : "&"}${key}=${value}`;
  }
  return q;
}
export function convertStringToQueriesObject(searchParams) {
  let selectedQueries = {};
  searchParams.forEach((values, key) => {
    const queries = values.split(",");
    if (selectedQueries[key]) {
      selectedQueries[key].push(...queries);
    } else {
      selectedQueries[key] = queries;
    }
  });
  return selectedQueries;
}

const FilterSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedFilterQueries, setSelectedFilterQueries] = useState({});
  useEffect(() => {
    const paramsObj = convertStringToQueriesObject(searchParams);
    setSelectedFilterQueries(paramsObj);
  }, [searchParams]);
  function handleSelectedFilterOptions(e) {
    const name = e.target.name;
    const value = e.target.value;
    const type = e.target.type;

    let selectedQueries = selectedFilterQueries;
    if (selectedQueries[name]) {
      if (type === "radio") {
        selectedQueries[name] = [value];
      } else if (selectedQueries[name].includes(value)) {
        selectedQueries[name] = selectedQueries[name].filter(
          (query) => query !== value
        );
        if (!checkValidQuery(selectedQueries[name])) {
          delete selectedQueries[name];
        }
      } else {
        selectedQueries[name].push(value);
      }
    } else if (selectedQueries) {
      selectedQueries[name] = value;
    }
    router.push(`/?${convertValidStringQueries(selectedQueries)}`, {
      scroll: false,
    });
  }
  function isChecked(id, option) {
    return Boolean(
      selectedFilterQueries[id] &&
        selectedFilterQueries[id].includes(option.toLowerCase())
    );
  }
  return (
    <div className="col-span-2 space-y-6 sticky top-12 h-fit">
      {filterOptions.map(({ id, title, type, options }) => {
        return (
          <div className="border-b pb-4" key={id}>
            <p className="font-medium mb-4">{title}</p>
            <div className="space-y-2">
              {options.map((value, index) => {
                return (
                  <div className="flex items-center gap-4" key={index}>
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
    </div>
  );
};

function CheckBoxAndRadioItem({ id, label, ...props }) {
  return (
    <>
      <input id={id} className="w-4 h-4 shrink-0" {...props} />
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
    </>
  );
}

export default FilterSection;
