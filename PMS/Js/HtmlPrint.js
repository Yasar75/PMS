
function rowMerge() {
    var table = $('#tblhtmlPrint > tbody').children();//Get Table Rows.
    if (table != undefined && table.length > 0) {
        for (var i = table.length - 2; i > 0; i--) {
            var row = table[i].childNodes;//Cells from the current row.
            var previousRow = table[i - 1].childNodes;//Cells from previous to current row

            var rowTextNext = table[i + 1].childNodes; //get the next cell
            var prevRowTextNext = table[i + 1].childNodes;//get the next cell
            var firstElement = false;
            for (var c = 0; c < row.length; c++) {

                if (row[c].textContent == previousRow[c].textContent) {//check the first cell text
                    if (c == 0)
                        firstElement = true;
                    if (c == (row.length - 1))
                        break;

                    if (c == 0)
                        if (rowTextNext[c + 1].textContent != prevRowTextNext[c + 1].textContent)//checking next cell text
                            break;

                    if (firstElement == true) {
                        if (previousRow[c].rowSpan == 1 || previousRow[c].rowSpan == 0) {
                            previousRow[c].rowSpan = row[c].rowSpan + 1;
                            row[c].style.display = "none";
                        }
                    }
                }
                else {
                    if (c == 0 || c == 1)// if first and second element doesn't match break the loop
                        break;
                }
            }
        }
    }

}
