import React from 'react';

export default function DropDownList({name, data = [], value, onChange}) {
    return (
        <div className="relative">
            <select
                id="filter"
                name="filter"
                className="mt-1 mb-1 pl-2 block w-full h-8 text-lg border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                onChange={onChange}
                defaultValue={value}
            >
                <option value="">{name}</option>
                {data.map((e, index) => (
                    <option key={index} value={e.name}>
                        {e.name}
                    </option>
                ))}
            </select>
        </div>
    );
}