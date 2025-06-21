import React from 'react';
// TODO: subtabs for Assert, Math, String, Array, Date, ...
// These are the things I imagine we will have:
//   Constant: true, false, null, 0, type, ...
//   Conditional: if, else, switch, case, comparison, logical operators, ternary, ...
//   Assert: assertEqual, assertNotEqual, assertTrue, assertFalse
//   Math: add, subtract, multiply, divide, mod, div rem, sqrt, pow, distance, ...
//   String: concat, split, substring, length, toUpperCase/Lower, trim, replace, filter, ...
//   Array: push, pop, shift, unshift, slice, splice, map, filter, reduce, find, includes, ...
//   Date: now, today, xDays, xWeeks, x<...>, formattedDate, ...
export const BuilderRHBMenuUtilities = (props: {
  onSelect: (operation: 'Constant' | 'Conditional' | 'Assert' | 'Math' | 'String' | 'Array' | 'Date') => void;
}) => {
  const utilityNodes = [
    { name: "Constant", description: "Constant values" },
    { name: "Conditional", description: "Conditional operations" },
    { name: "Assert", description: "Assertions for failures" },
    { name: "Math", description: "Mathematical operations" },
    { name: "String", description: "String manipulation" },
    { name: "Array", description: "Array operations" },
    { name: "Date", description: "Date and time operations" },
  ];
  return (
    <div className="flex flex-col">
      {utilityNodes.map((node, index) => (
        <button
          key={index}
          className="flex flex-row items-center gap-1 px-1 py-1 hover:bg-[#ffffff30] rounded-md"
          onClick={() => props.onSelect(node.name as any)}
        >
          <span className="text-sm">{node.name}</span>
          <span className="text-xs text-gray-400 truncate ml-1">{node.description || ''}</span>
        </button>
      ))}
    </div>
  );
}
