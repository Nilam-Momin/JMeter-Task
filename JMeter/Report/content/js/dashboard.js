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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "\/success.txt-20"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-21"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-22"], "isController": false}, {"data": [1.0, 500, 1500, "Search MusicAudio"], "isController": false}, {"data": [1.0, 500, 1500, "Search FunLifestyle"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-23"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-24"], "isController": false}, {"data": [1.0, 500, 1500, "Search Skill by Category ProgrammingTech and SubCategory 6"], "isController": false}, {"data": [1.0, 500, 1500, "Search Skill by Category ProgrammingTech and SubCategory 5"], "isController": false}, {"data": [1.0, 500, 1500, "Search Skill by Category ProgrammingTech and SubCategory 4"], "isController": false}, {"data": [1.0, 500, 1500, "Search WritingTranslation"], "isController": false}, {"data": [1.0, 500, 1500, "Search automation"], "isController": false}, {"data": [1.0, 500, 1500, "Search Skill by Category ProgrammingTech and SubCategory 1"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-10"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-11"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-12"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-13"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-14"], "isController": false}, {"data": [1.0, 500, 1500, "\/d2a9f432-5b07-4d1b-8841-29e9d68b59d1Sample%20Work.docx-29"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-15"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-16"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-17"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-18"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-19"], "isController": false}, {"data": [1.0, 500, 1500, "Search Skill by Category WritingTranslation and SubCategory 3"], "isController": false}, {"data": [1.0, 500, 1500, "\/18a85a80-e30e-4a1a-9341-7b6859c20908default-image.jpg-34"], "isController": false}, {"data": [1.0, 500, 1500, "Search ProgrammingTech"], "isController": false}, {"data": [1.0, 500, 1500, "\/27bdf182-b953-47c6-8fa5-42047009c692Sample%20Work.docx-28"], "isController": false}, {"data": [1.0, 500, 1500, "Search programming"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-2"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-4"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-3"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-6"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-5"], "isController": false}, {"data": [1.0, 500, 1500, "\/fe73539b-7ae2-4c9b-be5d-d397cb4f0358Sample%20Work.docx-30"], "isController": false}, {"data": [1.0, 500, 1500, "\/18a85a80-e30e-4a1a-9341-7b6859c20908default-image.jpg-25"], "isController": false}, {"data": [1.0, 500, 1500, "Search Skill by Category GraphicsDesign and SubCategory 1"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-31"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-32"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-33"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-8"], "isController": false}, {"data": [1.0, 500, 1500, "Search testing"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-7"], "isController": false}, {"data": [1.0, 500, 1500, "\/success.txt-9"], "isController": false}, {"data": [1.0, 500, 1500, "Search Skill by Category DigitalMarketing and SubCategory 2"], "isController": false}, {"data": [1.0, 500, 1500, "Search Skill by Category DigitalMarketing and SubCategory 1"], "isController": false}, {"data": [1.0, 500, 1500, "Search Skill by Category DigitalMarketing and SubCategory 3"], "isController": false}, {"data": [1.0, 500, 1500, "\/336292c7-e8af-4767-ba35-55ae337ba11aSample%20Work.docx-27"], "isController": false}, {"data": [1.0, 500, 1500, "\/72c5c4e3-928f-4ebc-9b78-9760df82e854Sample%20Work.docx-26"], "isController": false}, {"data": [1.0, 500, 1500, "Search Skill by Category GraphicsDesign and SubCategory 4"], "isController": false}, {"data": [1.0, 500, 1500, "Search Skill by Category GraphicsDesign and SubCategory 3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 722, 0, 0.0, 20.069252077562325, 2, 244, 19.0, 40.0, 43.0, 77.53999999999996, 29.22603626943005, 65.90037765898235, 7.729525393154955], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/success.txt-20", 15, 0, 0.0, 19.73333333333333, 17, 22, 20.0, 22.0, 22.0, 22.0, 8.064516129032258, 3.205330141129032, 2.3862777217741935], "isController": false}, {"data": ["\/success.txt-21", 15, 0, 0.0, 20.666666666666668, 18, 26, 20.0, 25.4, 26.0, 26.0, 8.064516129032258, 3.205330141129032, 2.3862777217741935], "isController": false}, {"data": ["\/success.txt-22", 15, 0, 0.0, 19.6, 16, 23, 20.0, 22.4, 23.0, 23.0, 8.060182697474476, 3.203607771359484, 2.3456391053197208], "isController": false}, {"data": ["Search MusicAudio", 10, 0, 0.0, 4.7, 3, 6, 5.0, 6.0, 6.0, 6.0, 2.783189535207348, 5.925149596437517, 0.3859501113275814], "isController": false}, {"data": ["Search FunLifestyle", 9, 0, 0.0, 5.0, 3, 10, 5.0, 10.0, 10.0, 10.0, 2.7794935145151327, 5.917281114885732, 0.3908662754786906], "isController": false}, {"data": ["\/success.txt-23", 15, 0, 0.0, 19.666666666666668, 16, 26, 19.0, 23.6, 26.0, 26.0, 8.068854222700375, 3.2070543639053253, 2.3875613569123186], "isController": false}, {"data": ["\/success.txt-24", 15, 0, 0.0, 20.066666666666666, 17, 24, 20.0, 22.200000000000003, 24.0, 24.0, 8.064516129032258, 3.205330141129032, 2.3862777217741935], "isController": false}, {"data": ["Search Skill by Category ProgrammingTech and SubCategory 6", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 708.6588541666666, 50.78125], "isController": false}, {"data": ["Search Skill by Category ProgrammingTech and SubCategory 5", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 531.494140625, 38.0859375], "isController": false}, {"data": ["Search Skill by Category ProgrammingTech and SubCategory 4", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 708.6588541666666, 50.78125], "isController": false}, {"data": ["Search WritingTranslation", 10, 0, 0.0, 9.600000000000001, 3, 54, 5.0, 49.500000000000014, 54.0, 54.0, 3.0413625304136254, 6.4747756995133825, 0.4455120894160584], "isController": false}, {"data": ["Search automation", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 713.8671875, 49.153645833333336], "isController": false}, {"data": ["Search Skill by Category ProgrammingTech and SubCategory 1", 80, 0, 0.0, 3.6125, 2, 8, 3.0, 4.900000000000006, 6.950000000000003, 8.0, 21.984061555372357, 46.737599615278924, 3.349134377576257], "isController": false}, {"data": ["\/success.txt-10", 15, 0, 0.0, 20.866666666666664, 17, 25, 21.0, 23.8, 25.0, 25.0, 8.034279592929833, 3.19331229914301, 2.338100897161221], "isController": false}, {"data": ["\/success.txt-11", 15, 0, 0.0, 19.6, 16, 24, 20.0, 22.200000000000003, 24.0, 24.0, 8.047210300429184, 3.1984517502682404, 2.3811569541309012], "isController": false}, {"data": ["\/success.txt-12", 15, 0, 0.0, 20.4, 17, 28, 20.0, 25.0, 28.0, 28.0, 8.029978586723768, 3.191602817184154, 2.3760581169700212], "isController": false}, {"data": ["\/success.txt-13", 15, 0, 0.0, 20.266666666666666, 17, 26, 20.0, 24.8, 26.0, 26.0, 8.034279592929833, 3.19331229914301, 2.338100897161221], "isController": false}, {"data": ["\/success.txt-14", 15, 0, 0.0, 20.000000000000004, 18, 22, 20.0, 21.4, 22.0, 22.0, 8.029978586723768, 3.191602817184154, 2.3760581169700212], "isController": false}, {"data": ["\/d2a9f432-5b07-4d1b-8841-29e9d68b59d1Sample%20Work.docx-29", 15, 0, 0.0, 40.2, 37, 46, 41.0, 43.6, 46.0, 46.0, 7.780082987551867, 86.06716804979253, 2.9251288576244816], "isController": false}, {"data": ["\/success.txt-15", 15, 0, 0.0, 19.866666666666664, 17, 24, 20.0, 22.200000000000003, 24.0, 24.0, 8.064516129032258, 3.205330141129032, 2.3862777217741935], "isController": false}, {"data": ["\/success.txt-16", 15, 0, 0.0, 21.866666666666664, 18, 28, 21.0, 27.4, 28.0, 28.0, 8.029978586723768, 3.191602817184154, 2.336849237152034], "isController": false}, {"data": ["\/success.txt-17", 15, 0, 0.0, 19.466666666666665, 17, 22, 20.0, 20.8, 22.0, 22.0, 8.064516129032258, 3.205330141129032, 2.3862777217741935], "isController": false}, {"data": ["\/success.txt-18", 15, 0, 0.0, 20.266666666666662, 17, 26, 20.0, 23.0, 26.0, 26.0, 8.064516129032258, 3.205330141129032, 2.3862777217741935], "isController": false}, {"data": ["\/success.txt-19", 15, 0, 0.0, 35.199999999999996, 18, 244, 20.0, 114.40000000000008, 244.0, 244.0, 8.064516129032258, 3.205330141129032, 2.346900201612903], "isController": false}, {"data": ["Search Skill by Category WritingTranslation and SubCategory 3", 80, 0, 0.0, 3.587500000000001, 2, 18, 3.0, 4.0, 5.0, 18.0, 21.99010445299615, 46.750446673996706, 3.41447910940077], "isController": false}, {"data": ["\/18a85a80-e30e-4a1a-9341-7b6859c20908default-image.jpg-34", 15, 0, 0.0, 41.06666666666668, 36, 56, 40.0, 50.6, 56.0, 56.0, 7.755946225439503, 48.209568090744575, 3.0145181618407446], "isController": false}, {"data": ["Search ProgrammingTech", 11, 0, 0.0, 4.181818181818182, 3, 6, 4.0, 6.0, 6.0, 6.0, 4.543577034283354, 9.672849545642297, 0.6522517812887237], "isController": false}, {"data": ["\/27bdf182-b953-47c6-8fa5-42047009c692Sample%20Work.docx-28", 15, 0, 0.0, 49.53333333333333, 37, 96, 41.0, 79.80000000000001, 96.0, 96.0, 7.780082987551867, 86.06716804979253, 2.9251288576244816], "isController": false}, {"data": ["Search programming", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 714.1927083333334, 49.479166666666664], "isController": false}, {"data": ["\/success.txt-2", 15, 0, 0.0, 21.53333333333333, 19, 32, 20.0, 29.0, 32.0, 32.0, 8.029978586723768, 3.191602817184154, 2.3760581169700212], "isController": false}, {"data": ["\/success.txt-1", 15, 0, 0.0, 38.800000000000004, 33, 53, 39.0, 46.400000000000006, 53.0, 53.0, 7.957559681697613, 3.162819131299735, 2.3157742042440317], "isController": false}, {"data": ["\/success.txt-4", 15, 0, 0.0, 22.133333333333333, 19, 34, 20.0, 31.6, 34.0, 34.0, 8.064516129032258, 3.205330141129032, 2.346900201612903], "isController": false}, {"data": ["\/success.txt-3", 15, 0, 0.0, 20.2, 18, 27, 20.0, 25.200000000000003, 27.0, 27.0, 8.064516129032258, 3.205330141129032, 2.3862777217741935], "isController": false}, {"data": ["\/success.txt-6", 15, 0, 0.0, 20.266666666666666, 18, 25, 20.0, 23.8, 25.0, 25.0, 8.051529790660224, 3.200168578904992, 2.3824350845410627], "isController": false}, {"data": ["\/success.txt-5", 15, 0, 0.0, 19.866666666666664, 17, 24, 19.0, 22.8, 24.0, 24.0, 8.051529790660224, 3.200168578904992, 2.3824350845410627], "isController": false}, {"data": ["\/fe73539b-7ae2-4c9b-be5d-d397cb4f0358Sample%20Work.docx-30", 15, 0, 0.0, 41.46666666666666, 38, 47, 41.0, 45.2, 47.0, 47.0, 7.788161993769471, 86.15654205607477, 2.928166374610592], "isController": false}, {"data": ["\/18a85a80-e30e-4a1a-9341-7b6859c20908default-image.jpg-25", 15, 0, 0.0, 74.6, 66, 90, 72.0, 87.0, 90.0, 90.0, 7.828810020876826, 48.66247635046973, 2.9358037578288103], "isController": false}, {"data": ["Search Skill by Category GraphicsDesign and SubCategory 1", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 708.6588541666666, 50.455729166666664], "isController": false}, {"data": ["\/success.txt-31", 15, 0, 0.0, 20.133333333333336, 16, 27, 19.0, 26.4, 27.0, 27.0, 7.874015748031496, 3.129613681102362, 2.2914616141732282], "isController": false}, {"data": ["\/success.txt-32", 15, 0, 0.0, 20.333333333333332, 16, 25, 20.0, 23.200000000000003, 25.0, 25.0, 7.85751702462022, 3.1230560830277634, 2.325027010214772], "isController": false}, {"data": ["\/success.txt-33", 15, 0, 0.0, 19.133333333333333, 16, 24, 19.0, 23.4, 24.0, 24.0, 7.874015748031496, 3.129613681102362, 2.3299089566929134], "isController": false}, {"data": ["\/success.txt-8", 15, 0, 0.0, 20.533333333333335, 18, 26, 20.0, 24.8, 26.0, 26.0, 8.060182697474476, 3.203607771359484, 2.384995466147233], "isController": false}, {"data": ["Search testing", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 534.66796875, 36.1328125], "isController": false}, {"data": ["\/success.txt-7", 15, 0, 0.0, 20.0, 16, 24, 20.0, 23.4, 24.0, 24.0, 8.04289544235925, 3.1967367627345844, 2.3406082439678286], "isController": false}, {"data": ["\/success.txt-9", 15, 0, 0.0, 20.000000000000004, 17, 24, 20.0, 24.0, 24.0, 24.0, 8.047210300429184, 3.1984517502682404, 2.3811569541309012], "isController": false}, {"data": ["Search Skill by Category DigitalMarketing and SubCategory 2", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 531.494140625, 38.330078125], "isController": false}, {"data": ["Search Skill by Category DigitalMarketing and SubCategory 1", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 708.6588541666666, 51.106770833333336], "isController": false}, {"data": ["Search Skill by Category DigitalMarketing and SubCategory 3", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 708.6588541666666, 51.106770833333336], "isController": false}, {"data": ["\/336292c7-e8af-4767-ba35-55ae337ba11aSample%20Work.docx-27", 15, 0, 0.0, 40.53333333333334, 36, 52, 39.0, 50.8, 52.0, 52.0, 8.004268943436498, 88.54722518676627, 3.0094175226787616], "isController": false}, {"data": ["\/72c5c4e3-928f-4ebc-9b78-9760df82e854Sample%20Work.docx-26", 15, 0, 0.0, 41.53333333333333, 38, 50, 42.0, 47.0, 50.0, 50.0, 7.991475759190196, 88.40570058604156, 3.004607585242408], "isController": false}, {"data": ["Search Skill by Category GraphicsDesign and SubCategory 4", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 708.6588541666666, 50.455729166666664], "isController": false}, {"data": ["Search Skill by Category GraphicsDesign and SubCategory 3", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 708.6588541666666, 50.455729166666664], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 722, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
