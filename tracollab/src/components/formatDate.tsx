import React from 'react';

interface FormattedDateProps {
    dateString: string;
}

// Formatter la date au format jj/mm/aaaa
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

const FormattedDate: React.FC<FormattedDateProps> = ({ dateString }) => {
    return (
        <span>{formatDate(dateString)}</span>
    );
};

export default FormattedDate;
