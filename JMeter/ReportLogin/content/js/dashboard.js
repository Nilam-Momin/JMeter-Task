/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8409090909090909, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home-1"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home-2"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home-0"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home-11"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home-10"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home-15"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home-14"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile-9"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home-13"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home-12"], "isController": false}, {"data": [0.5, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile-7"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home-9"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home-19"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile-8"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home-18"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile-5"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home-7"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home-17"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile-6"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home-8"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home-16"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile-3"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home-5"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile-4"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home-6"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile-1"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home-3"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile-2"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home-4"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile-18"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile-0"], "isController": false}, {"data": [0.5, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile-19"], "isController": false}, {"data": [0.5, 500, 1500, "http:\/\/localhost:60968\/authentication\/authentication\/signin"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile-10"], "isController": false}, {"data": [0.5, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile-11"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile-12"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Home"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile-13"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile-14"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile-15"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile-16"], "isController": false}, {"data": [1.0, 500, 1500, "http:\/\/localhost:5000\/Account\/Profile-17"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 43, 0, 0.0, 361.60465116279073, 4, 3019, 109.0, 1460.4000000000008, 2659.7999999999965, 3019.0, 6.810262907823883, 3243.784119367675, 6.86223075704783], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["http:\/\/localhost:5000\/Home-1", 1, 0, 0.0, 135.0, 135, 135, 135.0, 135.0, 135.0, 135.0, 7.407407407407407, 33.304398148148145, 4.000289351851851], "isController": false}, {"data": ["http:\/\/localhost:5000\/Home-2", 1, 0, 0.0, 125.0, 125, 125, 125.0, 125.0, 125.0, 125.0, 8.0, 30.265625, 4.4296875], "isController": false}, {"data": ["http:\/\/localhost:5000\/Home-0", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 394.7265625, 92.1875], "isController": false}, {"data": ["Test", 1, 0, 0.0, 4092.0, 4092, 4092, 4092.0, 4092.0, 4092.0, 4092.0, 0.24437927663734116, 2502.6554767686953, 5.351762967375367], "isController": true}, {"data": ["http:\/\/localhost:5000\/Home-11", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 26.123046875, 72.021484375], "isController": false}, {"data": ["http:\/\/localhost:5000\/Home-10", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 34.830729166666664, 95.21484375], "isController": false}, {"data": ["http:\/\/localhost:5000\/Home-15", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 24.4140625, 72.8759765625], "isController": false}, {"data": ["http:\/\/localhost:5000\/Home-14", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 39.0625, 115.234375], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile-9", 1, 0, 0.0, 132.0, 132, 132, 132.0, 132.0, 132.0, 132.0, 7.575757575757576, 63.631924715909086, 3.7730823863636362], "isController": false}, {"data": ["http:\/\/localhost:5000\/Home-13", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 21.70138888888889, 63.910590277777786], "isController": false}, {"data": ["http:\/\/localhost:5000\/Home-12", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 20.8984375, 57.8125], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile-7", 1, 0, 0.0, 651.0, 651, 651, 651.0, 651.0, 651.0, 651.0, 1.5360983102918586, 1154.3733798963133, 0.7230462749615976], "isController": false}, {"data": ["http:\/\/localhost:5000\/Home-9", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 41.796875, 116.015625], "isController": false}, {"data": ["http:\/\/localhost:5000\/Home-19", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 19368.61213235294, 2.8722426470588234], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile-8", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 15.248388452914797, 2.1195347533632285], "isController": false}, {"data": ["http:\/\/localhost:5000\/Home-18", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 48.828125, 145.01953125], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile-5", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 2131.701595568783, 2.5059937169312168], "isController": false}, {"data": ["http:\/\/localhost:5000\/Home-7", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 16.075721153846153, 42.51802884615385], "isController": false}, {"data": ["http:\/\/localhost:5000\/Home-17", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 32.552083333333336, 96.6796875], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile", 1, 0, 0.0, 3019.0, 3019, 3019, 3019.0, 3019.0, 3019.0, 3019.0, 0.33123550844650546, 2296.869500973004, 3.404221182510765], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile-6", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 2640.7008495145633, 4.607858009708738], "isController": false}, {"data": ["http:\/\/localhost:5000\/Home-8", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 16.075721153846153, 42.66826923076923], "isController": false}, {"data": ["http:\/\/localhost:5000\/Home-16", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 27.901785714285715, 82.58928571428571], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile-3", 1, 0, 0.0, 2909.0, 2909, 2909, 2909.0, 2909.0, 2909.0, 2909.0, 0.3437607425232039, 266.5733633765899, 0.3404037040220007], "isController": false}, {"data": ["http:\/\/localhost:5000\/Home-5", 1, 0, 0.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 16.0, 62.5, 12.20703125, 34.72900390625], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile-4", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 1018.0951286764705, 27.860753676470587], "isController": false}, {"data": ["http:\/\/localhost:5000\/Home-6", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 17.415364583333332, 46.38671875], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile-1", 1, 0, 0.0, 1663.0, 1663, 1663, 1663.0, 1663.0, 1663.0, 1663.0, 0.6013229104028863, 2.7036041791942274, 0.2953763905592303], "isController": false}, {"data": ["http:\/\/localhost:5000\/Home-3", 1, 0, 0.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 16.0, 62.5, 12.20703125, 34.66796875], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile-2", 1, 0, 0.0, 1656.0, 1656, 1656, 1656.0, 1656.0, 1656.0, 1656.0, 0.6038647342995169, 2.2845429498792273, 0.30488092542270534], "isController": false}, {"data": ["http:\/\/localhost:5000\/Home-4", 1, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 13.020833333333334, 37.044270833333336], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile-18", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 134.02747212441315, 2.33824823943662], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile-0", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 285.5747767857143, 67.3828125], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile-19", 1, 0, 0.0, 1167.0, 1167, 1167, 1167.0, 1167.0, 1167.0, 1167.0, 0.8568980291345331, 3879.050182090831, 0.4251017566409597], "isController": false}, {"data": ["http:\/\/localhost:60968\/authentication\/authentication\/signin", 1, 0, 0.0, 844.0, 844, 844, 844.0, 844.0, 844.0, 844.0, 1.1848341232227488, 0.5681187055687204, 0.5577051244075829], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile-10", 1, 0, 0.0, 143.0, 143, 143, 143.0, 143.0, 143.0, 143.0, 6.993006993006993, 14.621121066433568, 3.4213833041958046], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile-11", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 118.29459313118812, 0.8154135726072608], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile-12", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 15.536862590252706, 1.7909521660649819], "isController": false}, {"data": ["http:\/\/localhost:5000\/Home", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 14437.28251228166, 48.69592658296943], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile-13", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 7.313447840073529, 1.8131031709558822], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile-14", 1, 0, 0.0, 122.0, 122, 122, 122.0, 122.0, 122.0, 122.0, 8.196721311475411, 12.959464651639344, 4.050332991803279], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile-15", 1, 0, 0.0, 109.0, 109, 109, 109.0, 109.0, 109.0, 109.0, 9.174311926605505, 52.510392775229356, 4.596115252293578], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile-16", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 61.894955842391305, 5.392323369565218], "isController": false}, {"data": ["http:\/\/localhost:5000\/Account\/Profile-17", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 140.09986733490567, 1.5661851415094339], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 43, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
