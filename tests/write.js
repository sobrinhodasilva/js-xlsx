/* writing feature test -- look for TEST: in comments */
/* vim: set ts=2: */

/* original data */
var data = [
	[1,2,3],
	[true, false, null, "sheetjs"],
	["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"],
	["baz", null, "qux", 3.14159],
	["hidden"],
	["visible"]
];

var ws_name = "SheetJS";

var wscols = [
	{wch:6}, // "characters"
	{wpx:50}, // "pixels"
	,
	{hidden:true} // hide column
];

/* At 96 PPI, 1 pt = 1 px */
var wsrows = [
	{hpt: 12}, // "points"
	{hpx: 16}, // "pixels"
	,
	{hpx: 24},
	{hidden:true}, // hide row
	{hidden:false}
]

console.log("Sheet Name: " + ws_name);
console.log("Data: "); for(var i=0; i!=data.length; ++i) console.log(data[i]);
console.log("Columns :"); for(i=0; i!=wscols.length;++i) console.log(wscols[i]);



/* require XLSX */
if(typeof XLSX === "undefined") { try { XLSX = require('./'); } catch(e) { XLSX = require('../'); } }

/* blank workbook constructor */
var wb = { SheetNames: [], Sheets: {} };

/* convert an array of arrays in JS to a CSF spreadsheet */
var ws = XLSX.utils.aoa_to_sheet(data, {cellDates:true});

/* TEST: add worksheet to workbook */
wb.SheetNames.push(ws_name);
wb.Sheets[ws_name] = ws;

/* TEST: simple formula */
ws['C1'].f = "A1+B1";
ws['C2'] = {t:'n', f:"A1+B1"};

/* TEST: single-cell array formula */
ws['D1'] = {t:'n', f:"SUM(A1:C1*A1:C1)", F:"D1:D1"};

/* TEST: multi-cell array formula */
ws['E1'] = {t:'n', f:"TRANSPOSE(A1:D1)", F:"E1:E4"};
ws['E2'] = {t:'n', F:"E1:E4"};
ws['E3'] = {t:'n', F:"E1:E4"};
ws['E4'] = {t:'n', F:"E1:E4"};
ws["!ref"] = "A1:E6";

/* TEST: column props */
ws['!cols'] = wscols;

/* TEST: row props */
ws['!rows'] = wsrows;

/* TEST: hyperlink note: Excel does not automatically style hyperlinks */
ws['A3'].l = { Target: "http://sheetjs.com", Tooltip: "Visit us <SheetJS.com!>" };

/* TEST: built-in format */
ws['B1'].z = "0%"; // Format Code 9

/* TEST: custom format */
var custfmt = "\"This is \"\\ 0.0";
ws['C2'].z = custfmt;

/* TEST: page margins */
ws['!margins'] =  { left:1.0, right:1.0, top:1.0, bottom:1.0, header:0.5, footer:0.5 };

console.log("JSON Data:");console.log(XLSX.utils.sheet_to_json(ws, {header:1}));

/* TEST: hidden sheets */
wb.SheetNames.push("Hidden");
wb.Sheets["Hidden"] = XLSX.utils.aoa_to_sheet(["Hidden".split(""), [1,2,3]]);
wb.Workbook = {Sheets:[]};
wb.Workbook.Sheets[1] = {Hidden:1};

/* TEST: properties */
wb.Props = {
	Title: "SheetJS Test",
	Subject: "Tests",
	Author: "Devs at SheetJS",
	Manager: "Sheet Manager",
	Company: "SheetJS",
	Category: "Experimentation",
	Keywords: "Test",
	Comments: "Nothing to say here",
	LastAuthor: "Not SheetJS",
	CreatedDate: new Date(2017,1,19)
}

/* TEST: comments */
ws['A4'].c = [];
ws['A4'].c.push({a:"SheetJS",t:"I'm a little comment, short and stout!\n\nWell, Stout may be the wrong word"});

/* TEST: sheet protection */
ws['!protect'] = {
	password:"password",
	/* enable formatting rows and columns */
	formatRows:0,
	formatColumns:0,
	/* disable editing objects and scenarios */
	objects:1,
	scenarios:1
};

console.log("Worksheet Model:")
console.log(ws);

[
	['sheetjs.xlsx', {bookSST:true}],
	'sheetjs.xlsm',
	'sheetjs.xlsb',
	['sheetjs.xls', {bookType:'biff2'}],
	['sheetjs.xml.xls', {bookType:'xlml'}],
	'sheetjs.ods',
	'sheetjs.fods',
	'sheetjs.slk',
	'sheetjs.csv',
	'sheetjs.txt',
	'sheetjs.prn',
	'sheetjs.dif'
].forEach(function(r) {
	if(typeof r == 'string') {
		/* write file */
		XLSX.writeFile(wb, r);
		/* test by reading back files */
		XLSX.readFile(r);
	} else {
		/* write file */
		XLSX.writeFile(wb, r[0], r[1]);
		/* test by reading back files */
		XLSX.readFile(r[0]);
	}
});
