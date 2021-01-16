var fs = require("fs");
var pdf = require("html-pdf");
var options = { format: "Letter", timeout: '800000' };

function getHTML(entity, id, elem) {
    var tt = [
        ["", "", "", "", "L", "", ""],
        ["", "", "", "", "U", "", ""],
        ["", "", "", "", "N", "", ""],
        ["", "", "", "", "C", "", ""],
        ["", "", "", "", "H", "", ""]
    ];

    var table = '<br><br><h3 style="color: #fff">' + id + '</h3><br><table class="table table-bordered"><thead class="thead-dark"><tr><th scope="col">Day</th><th scope="col">8:50 - 9:40</th><th scope="col">9:50 - 10:40</th><th scope="col">11:00 - 11:50</th><th scope="col">12:00 - 12:50</th><th scope="col">1:00 - 2:00</th><th scope="col">2:00 - 2:50</th><th scope="col">3:00 - 3:50</th></tr></thead><tbody>';

    for (var ts in entity) {
        if (ts != 'e') {
            var intTS = parseInt(ts);
            var day = Math.trunc(intTS / 10);
            var timeSlot = Math.trunc(intTS % 10);
            // console.log("day: ", day, "timeSlot: ", timeSlot);
            for (var i in entity[ts]) {
                // console.log(entity[ts][i]);
                if (entity[ts][i] != 'e') {
                    tt[day][timeSlot] += elem[i % 3] + entity[ts][i] + "<br>";
                }
            }
        }
    }

    var day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    for (var x = 0; x < tt.length; x++) {
        table += '<tr></tr><th scope="row">' + day[x] + '</th>';
        for (var y = 0; y < tt[0].length; y++) {
            table += '<td style="font-size: smaller">' + tt[x][y] + '</td>';
        }
        table += '</tr>';
    }

    table += '</tbody></table>';

    return table;

}

function HTMLtoPDF(json, id, elem, folder) {
    var str = '<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title><!-- CSS --><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"    integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous"><!-- jQuery and JS bundle w/ Popper.js --><script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"    integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"    crossorigin="anonymous"></script><script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js"    integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script></head>';
    var data = str + '<body class="bg-dark" style="padding: 2%;">' + getHTML(json, id, elem) + "</body></html>";
    // fs.writeFileSync("./temp/tt.html", data, function (err) {
    //     if (err) throw err;
    // });
    // var html = fs.readFileSync('./temp/tt.html', 'utf8');
    pdf.create(data, options).toFile('./public/timetables/' + folder + '/' + id + '.pdf', function (err, res) {
        if (err) return console.log(err);
        console.log(res);
    });
}



function createFacultyTimeTables(myJSON) {
    for (var key in myJSON) {
        if (key != 'e') {
            HTMLtoPDF(myJSON[key], key, ["", "", "Room-"], "faculty");
        }
    }
}

function createSectionTimeTables(myJSON) {
    for (var key in myJSON) {
        if (key != 'e') {
            HTMLtoPDF(myJSON[key], key, ["", "", "Room-"], "section");
        }
    }
}

function createClassRoomTimeTables(myJSON) {
    for (var key in myJSON) {
        if (key != 'e') {
            HTMLtoPDF(myJSON[key], key, ["", "", ""], "classroom");
        }
    }
}

function createLabTimeTables(myJSON) {
    for (var key in myJSON) {
        if (key != 'e') {
            HTMLtoPDF(myJSON[key], key, ["", "", ""], "lab");
        }
    }
}


module.exports = {createFacultyTimeTables, createSectionTimeTables, createClassRoomTimeTables, createLabTimeTables};
