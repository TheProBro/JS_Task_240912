# Chemicals Management Table

This static website provides a user-friendly interface to manage a table of chemicals, displaying key parameters and allowing users to edit, sort, and manage the entries effectively.

## Features

- **Display a Table of Chemicals**: The application showcases a table containing 15 chemicals with relevant parameters.
- **Edit Entries**: Users can modify the values of each parameter directly within the table.
- **Sort Functionality**: The table can be sorted by any column, making it easy to organize the data as needed.
- **Add/Delete Rows**: Users can add new entries to the table or remove existing ones.
- **Move Rows**: Users can position any chemical above another by moving any row up or down.

## Table Structure

The table consists of the following columns for each chemical:

| ID | Chemical Name | Vendor | Density | Viscosity | Packaging | Pack Size | Unit | Quantity |
|----|---------------|--------|---------|-----------|-----------|-----------|------|----------|
| 1  | Acetone       | ABC    | 0.789   | 0.295     | Drum      | 200       | Litres| 100      |
| 2  | Ethanol       | XYZ    | 0.789   | 0.315     | Bottle    | 150       | Litres| 200      |
| ...| ...           | ...    | ...     | ...       | ...       | ...       | ...  | ...      |
| 15 | Methanol      | QWE    | 0.791   | 0.320     | Drum      | 250       | Litres| 300      |

## Design 

the 3 main files governing the functioning are 
- index.js
- index.html
- index.css

js governs dynamic addition of data from a json file, all functions of filters, add/delete, move and dynamic resizing of components

html has the basic layout of the web app structuring the base components of table, its headers, and other options

css styles the web app and adds responsiveness

implemented various functions in the PS via states and basic logic

state management is done via global contants declared on top of the js file, state changes are detected/applied by adding listeners to the target components

major states being used:
- chemicals: stores info for each of the chemical, its selection status, etc
- header flags: stores info of sorting wrt which of the columns
- selected row: stores info about the currently selected chemical

implemented animations of moving up and down by translate and transform properties in css, and putting the the swap of rows in a timeout section to allow for smooth animation


**note:** due to some github page hosting issues, index.js is pasted as is in the script section of the index.html

