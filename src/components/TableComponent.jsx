import React from 'react';

const TableComponent = ({ tableData }) => {

  const findMinMax = (tableData) => {
    let minRow = 4999;
    let maxRow = 0;

    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i].length > maxRow) {
        maxRow = tableData[i].length;
      }

      if (tableData[i].length < minRow) {
        minRow = tableData[i].length;
      }
    }
    return minRow === maxRow;
  };

  if (!findMinMax(tableData)) return <h1>Irregular table</h1>;

  const table = React.createElement(
    'table',
    {
      className: 'min-w-full table-auto border border-gray-300 text-left',
    },
    React.createElement(
      'thead',
      { className: 'bg-blue-500 text-white sticky top-0 ' }, 
      React.createElement(
        'tr',
        {},
        tableData[0].map((heading, index) =>
          React.createElement(
            'th',
            {
              key: index,
              className:
                'px-4 py-3 text-sm font-semibold border-b border-gray-300',
            },
            heading
          )
        )
      )
    ),
    React.createElement(
      'tbody',
      {},
      tableData.slice(1).map((row, rowIndex) =>
        React.createElement(
          'tr',
          {
            key: rowIndex,
            className: `${
              rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'
            } hover:bg-gray-200 transition duration-300 `,
          },
          row.map((cell, cellIndex) =>
            React.createElement(
              'td',
              {
                key: cellIndex,
                className:
                  'px-4 py-2 border-b border-gray-300 text-gray-700 text-sm',
              },
              cell
            )
          )
        )
      )
    )
  );

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <div className="max-h-96 overflow-auto shadow-lg border rounded-lg">
        {table}
      </div>
    </div>
  );
};

export default TableComponent;
