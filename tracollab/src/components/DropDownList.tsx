import React from 'react';

export default function DropDownList({name, data = [], onChange}) {
    return (
        <div className="relative pr-1 pl-1">
            <select
                id="genre-filter"
                name="genre-filter"
                className="mt-1 mb-1 block w-full h-6 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                onChange={onChange}
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
