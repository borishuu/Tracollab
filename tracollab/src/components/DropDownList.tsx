import React from 'react';

export default function DropDownList({name, data = [], onChange}) {
    return (
        <div className="relative">
            <select
                id="genre-filter"
                name="genre-filter"
                className="mt-1 mb-1 text-lg block w-full h-12 text-lg px-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600"
                onChange={onChange}
                defaultValue={name}
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
