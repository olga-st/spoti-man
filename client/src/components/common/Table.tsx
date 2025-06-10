import React from 'react';

interface TableProps {
    headers: string[];
    children: React.ReactNode;
    className?: string;
}

export const Table: React.FC<TableProps> = ({ headers, children, className = '' }) => {
    return (
        <div className={`bg-gray-800 rounded-lg overflow-hidden w-full ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-700 text-gray-400 uppercase text-sm">
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index} className="p-4 whitespace-nowrap">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {children}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    children: React.ReactNode;
}

export const TableRow: React.FC<TableRowProps> = ({ children, ...props }) => (
    <tr {...props}>
        {children}
    </tr>
);

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    children: React.ReactNode;
    className?: string;
}

export const TableCell: React.FC<TableCellProps> = ({ children, className = '', ...props }) => {
    return (
        <td className={`p-4 whitespace-nowrap ${className}`} {...props}>
            {children}
        </td>
    );
}; 