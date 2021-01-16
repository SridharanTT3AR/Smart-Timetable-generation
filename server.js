const express = require("express");
const bodyParser = require("body-parser");
var mysql = require('mysql');
const ejs = require("ejs");
const _ = require("lodash");
const app = express();
require('dotenv').config()
const timetable = require('./timetable');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.PASSWORD,
  multipleStatements: true
});
connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to Database.');
});

var adminNames=[10000000,10000001,10000002,10000003];
var adminname="Pranesh";

connection.query("use smarttimetabling;", function(err, result , fields) {
  if (err) throw err;
});

app.get('/', (req, res) => {
  res.render("index", {
    display: "none",
    id: ''
  });
});

app.get("/users", (req, res) => {
  res.render("users");
});
app.get("/admin", (req, res) => {
  res.render("admin",{name:"Jagadeeshram D"});
});
app.get('/logout', (req, res) => {
  res.redirect('/');
});
app.get('/admin1',(req,res)=>{
    res.render("admin1",{name:adminname});
});
//------------landing-page-----------------  // try to reduce the code , repeation of code
app.post("/getClassTT", (req, res)=> {
  var fileName = req.body.branch + '-' + req.body.sem + '-' + req.body.section;
  res.render("index", {
    display: "block",
    id: "timetables/section/" + fileName + ".pdf"
  })
})

app.post("/getFacultyTT", (req, res)=> {
  var fileName = req.body.fname;
  res.render("index", {
    display: "block",
    id: "timetables/faculty/" + fileName + ".pdf"
  })
})

app.post("/getRoomTT", (req, res)=> {
  var fileName = req.body.building + '-' + req.body.rno;
  res.render("index", {
    display: "block",
    id: "timetables/classroom/" + fileName + ".pdf"
  })
})

app.post("/getLabTT", (req, res)=> {
  var fileName = req.body.building + '-' + req.body.rno;
  res.render("index", {
    display: "block",
    id: "timetables/lab/" + fileName + ".pdf"
  })
})

//---------landing-page-end------------------

app.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  var test=0;
  var admin=false;
  var i=0;

  for (i=0;i<=adminNames.length;i++) {
          if(adminNames[i] == username){
            admin=true;
          }
      }
  connection.query("select password from login where username="+username+";", function(err, result) {
      if(err){
          throw err;
          console.log(err);
        }
      else
        {
           if(result[0].password === password)
              {
                if(admin)
                  {
                      connection.query("select name from admin where id="+username+";", function(err, result) {
                          if (err) throw err;
                          adminname=result[0].name;
                          res.render("admin1",{name:adminname});
                        });
                   }
                else
                   {
                       connection.query("select Name,Dept_Name from faculty where id="+username+";"+"select Domain_Course from CoursesEligible where ID ='"+username+"';",function(err, result) {
                           if (err) throw err;
                           res.render("users",{
                           name:result[0][0].Name,
                           dept:result[0][0].Dept_Name,
                           id:username,
                           domain:result[1]});
                         });
                   }
               }
           else
              {
                res.render("error",{Error:"Wrong password or username",Detailed:"No details"});
             }
        }
      });
});

// -------------------------ADMIN-ROLE--------------------------
app.get("/adminhome",(req, res) => {
    res.render("adminhome",{name:adminname});
});
// -------------ADMIN-EDIT--------------------
app.get("/data/:id",(req, res) => {
  res.sendFile(__dirname+"/public/html/forms/"+req.params.id+".html");
});

app.get("/edit/:id", (req, res) =>{
  var page=req.params.id; // CourseElective
  connection.query("select * from "+page+";", function(err, result) {
    if (err){
      console.log(err);
      res.render("error", {
        Error: "Fetching error",
        Detailed: err.sqlMessage
      });
    }
    else
    {
      res.render(page+"table", {
        Data:result
      });
    }
  });
});

app.get("/delete/:id", (req, res) =>{
  var page=req.params.id.split(',');
  var pagename;
  var sql;
  if(page[1] == "Admin" || page[1] == "Lab" || page[1] == "Classroom"){  // problem with deleting because of FK of lab allocation
      sql="delete from "+page[1]+" where ID="+page[0]+";";
      pagename=page[1];
  }
  else if(page[1] == "Faculty"){
       pagename=page[1];
       sql="delete from CoursesEligible where ID="+page[0]+";"+"delete from "+page[1]+" where ID="+page[0]+";"
  }
  else if(page[1] == "Course"){
    pagename="CourseElective";
    if(page[2]="Elective"){
        sql="delete from Elective where Course_ID='"+page[0]+"';delete from "+page[1]+" where ID='"+page[0]+"';";
    }else{
       sql="delete from "+page[1]+" where ID='"+page[0]+"';";
    }
  }
  else if(page[1] == "Department"){
      sql="delete from "+page[1]+" where Name='"+page[0]+"';";
      pagename=page[1];
  }
  else if(page[3] == "Section"){
      sql="delete from "+page[3]+" where ID='"+page[0]+"' and Dept_Name='"+page[1]+"' and Semester="+page[2]+";";
      pagename=page[3];
  }
  connection.query(sql, function(err, result) {
    if (err){
      console.log(err);
      res.render("error", {
        Error: "Deleting error",
        Detailed: err.sqlMessage
      });
    }
    else
    {
      connection.query("select * from "+pagename+";", function(err, result) {
        if (err){
          console.log(err);
          res.render("error", {
            Error: "Fetching error",
            Detailed: err.sqlMessage
          });
        }
        else
        {
          res.render(pagename+"table", {
            Data:result
          });
        }
      });
    }
  });
});

// ---------ADMIN-ENTRY---------
app.post('/addadmin', (req, res) => {
  var name=req.body.name;
  var email=req.body.email;
  var age=req.body.age;
  var gender=req.body.gender;
  var phoneno=req.body.phone;
  var salary=req.body.salary;
  var role=req.body.adminrole;
  var sql = "INSERT INTO Admin(Email,Name,Age,Gender,Phone_No,Role,Salary) VALUES('"+email+"','"+name+"',"+age+",'"+gender+"','"+phoneno+"','"+role+"',"+salary+");"
  connection.query(sql, function(err, result) {
     if (err){
       console.log(err);
       res.render("error", {
         Error: "Inserting error",
         Detailed: err.sqlMessage
       });
     }
     else{
       console.log(result,"Admin value entered successfully");
       res.redirect('/admin1');
     }
  });
});

app.post('/addcourse', (req, res) => {
  var id=req.body.id;
  var name=req.body.coursename;
  var type=req.body.type;
  var l=req.body.L;
  var p=req.body.P;
  var t=req.body.T;
  var c=req.body.C;
  var electiveid=req.body.electiveID;
  var semster=req.body.semester
  var dept=req.body.deptname;
    var sql = "INSERT INTO Course VALUES('"+id+"','"+name+"','"+type+"','"+l+"','"+t+"','"+p+"','"+c+"','"+ dept+"');"
    var sql1="INSERT INTO Elective VALUES('"+electiveid+"','"+id+"');"
    if(type == "Elective"){
      connection.query(sql+sql1, function(err, result) {
        if (err){
          console.log(err);
          res.render("error", {
            Error: "Inserting error",
            Detailed: err.sqlMessage
          });
        }
        else
        {
          console.log(result[0],result[1],"Course and elective value entered successfully");
          res.redirect('/admin1');
        }
      });
    }
    else{
      connection.query(sql, function(err, result) {
         if (err){
           console.log(err);
           res.render("error", {
             Error: "Inserting error",
             Detailed: err.sqlMessage
           });
         }
         else{
           console.log(result,"Course value entered successfully");
           res.redirect('/admin1');
         }
      });
    }
});


app.post('/adddept', (req, res) => {
  var name=req.body.name;
  var building=req.body.building;
  var hodid=req.body.hodID;
  var exnum=req.body.extNo;
  var sql = "INSERT INTO Department VALUES('"+name+"','"+building+"',"+hodid+","+exnum+");"
  connection.query(sql, function(err, result) {
     if (err){
       console.log(err);
       res.render("error", {
         Error: "Inserting error",
         Detailed: err.sqlMessage
       });
     }
     else{
       console.log(result,"Department value entered successfully");
       res.redirect('/admin1');
     }
  });
});

app.post('/addfaculty', (req, res) => {
  var name=req.body.name;
  var email=req.body.email;
  var age=req.body.age;
  var gender=req.body.gender;
  var phone=req.body.phone;
  var salary=req.body.salary;
  var qualification=req.body.qualification;
  var domain=req.body.domain;
  var designation=req.body.designation;
  var dept=req.body.dept;
  var ID;
  var sql="INSERT INTO Faculty(Email,Name,Age,Gender,Phone_No,Qualification,Salary,Dept_Name,Designation) VALUES('"+email+"','"+name+"',"+age+",'"+gender+"','"+ phone+"','"+ qualification+"',"+ salary+",'"+dept+"','"+designation+"');"
  connection.query(sql, function(err, result) {
       if (err){
         console.log(err);
         res.render("error", {
           Error: "Inserting error",
           Detailed: err.sqlMessage
         });
       }
       else{
         console.log(result,"Faculty value entered successfully");
         ID=result.insertId;
         var courses=domain.split(',');
         courses.forEach((course)=>{
           connection.query("INSERT INTO CoursesEligible VALUES('"+ID+"','"+course+"');", function(err, result) {
                if (err){
                  console.log(err);
                  res.render("error", {
                    Error: "Inserting error",
                    Detailed: err.sqlMessage
                  });
                }
                else{
                  console.log(result,"CoursesEligible value entered successfully");
                }
             });
         });
        res.redirect('/admin1');
       }
    });
});

app.post('/addresource', (req, res) => {  //changes needed
   var resourcetype=req.body.resourcetype;
   var type=req.body.type;
   var building=req.body.building;
   var labIncharge=req.body.labIncharge;
   var projector=req.body.projector;
   var sql;
   //labtype and classtype needs to be added in html
   if(resourcetype == "Classroom")
    {
      sql = "INSERT INTO Classroom(Building,Type) VALUES('"+building+"','"+type+"');"
    }else if(resourcetype == "Lab"){
      sql = "INSERT INTO Lab(Building,Type,Incharge_ID) VALUES('"+building+"','"+type+"','"+labIncharge+"');"
    }
    console.log(sql);
    connection.query(sql, function(err, result) {
         if (err){
           console.log(err);
           res.render("error", {
             Error: "Inserting error",
             Detailed: err.sqlMessage
           });
         }
         else{
           console.log(result,"Resource value entered successfully");
           res.redirect('/admin1');
         }
      });
});

app.post('/addsection', (req, res) => {
  var id=req.body.sectionid;
  var deptname=req.body.deptname;
  var year=req.body.year;
  var strength=req.body.strength;
  var semster=req.body.semester;
  var sql = "INSERT INTO Section VALUES('"+id+"','"+deptname+"',"+semster+","+strength+");"
  connection.query(sql, function(err, result) {
       if (err){
         console.log(err);
         res.render("error", {
           Error: "Inserting error",
           Detailed: err.sqlMessage
         });
       }
       else{
         console.log(result,"Section value entered successfully");
         res.redirect('/admin1');
       }
    });
});

// ----------ADMIN-GENERATE----------
app.get('/generateTT', (req, res) => {
  console.log("generated!!");
  var index=[0,1,2,3];
  var name=['facultyTimeTable','classroomOccupancyChart','sectionTimeTable','labOccupancyChart']
  var sql;
  index.forEach((i)=>{
    sql="SET @myOutput"+i+" = '{';CALL "+name[i]+"(@myOutput"+i+");select @myOutput"+i+" as tt;"
    connection.query(sql, function(err, result) {
      if (err){
        throw err;
        res.render("error", {
          Error: "Procedure error",
          Detailed: err.sqlMessage
        });
      }
      else
      {
        data=result[2][0];
        var resultjson = JSON.parse(data.tt);
        if(i==0){
          timetable.createFacultyTimeTables(resultjson);
        }else if (i==1) {
          timetable.createClassRoomTimeTables(resultjson);
        }else if (i==2) {
          timetable.createSectionTimeTables(resultjson);
        }else if (i==3) {
          timetable.createLabTimeTables(resultjson);
        }
      }
    });
   });
     res.send("GENERATED");
});
//------------ADMIN-REPLACE----------
app.get('/replace',(req,res)=>{
    res.render("replace",{Heading:"",Data:""});
});

app.get('/replacement/:id', (req, res) => {
  var ID=req.params.id;
  var sql="select * from facultyallocation where ID="+ID;
  var flag=0;
  connection.query(sql, function(err, result) {
       if (err){
         console.log(err);
         res.render("error", {
           Error: "Inserting error",
           Detailed: err.sqlMessage
         });
       }
       else{
         var course=result[0].Course_ID; //not for multiple course
         connection.query("select ID from courseseligible where Domain_Course=?",[course] , function(err, result) {
              if (err){
                console.log(err);
                res.render("error", {
                  Error: "Inserting error",
                  Detailed: err.sqlMessage
                });
              }
              else{
                 var facultylist=result;
                 facultylist.forEach((faculty)=>{
                   connection.query("INSERT INTO CoursesEligible VALUES('"+ID+"','"+course+"');", function(err, result) {
                     var sql;
                     if(faculty.ID==ID)
                        return
                     else{
                       connection.query("select * from (select * from facultyallocation where ID=?) as A inner join (select * from facultyallocation where ID=?) as B ON A.Time_Slot=B.Time_Slot and A.Day=B.Day ;", [ID,faculty.ID] , function(err, result) {
                            if (err){
                              console.log(err);
                              res.render("error", {
                                Error: "Inserting error",
                                Detailed: err.sqlMessage
                              });
                            }
                            else{
                               if(result.length == 0){
                                 connection.query("insert into facultyreplacement values(?,?,?);", [ID,faculty.ID,course] , function(err, result) {
                                      if (err){
                                        console.log(err);
                                        res.render("error", {
                                          Error: "Inserting error",
                                          Detailed: err.sqlMessage
                                        });
                                      }
                                      else{
                                           console.log("Replacement added");
                                      }
                                   });
                               }
                            }
                         });
                     }
                     });
                 });
              }
           });
       }
    });
    res.send("success");
});

app.get('/sendreplacementID/:id',(req,res)=>{
    var ID=req.params.id;
    connection.query("select Replacement_Faculty_ID from facultyreplacement where Replacing_Faculty_ID ="+ID , function(err, result) {
         if (err){
           console.log(err);
           res.render("error", {
             Error: "Inserting error",
             Detailed: err.sqlMessage
           });
         }
         else{
          console.log("sending replcement id...");
          res.render("replace",{Heading:"Possible Replacements",Data:result});
         }
      });
});
app.get('/deletereplacement',(req,res)=>{
    connection.query("delete from facultyreplacement;" , function(err, result) {
         if (err){
           console.log(err);
           res.render("error", {
             Error: "Deleting error",
             Detailed: err.sqlMessage
           });
         }
         else{
          console.log("Deleting replcement");
          res.send("Replacements Deleted");
         }
      });
});
//----------ADMIN-DELETEALLOC---------
app.get('/deleteAlloc', (req, res) => {
  console.log("deleted alloc");
  res.send("All allocation deleted");
  connection.query("DELETE FROM facultyallocation;"+"DELETE FROM sectionallocation;"+"DELETE FROM classroomallocation"+"DELETE FROM laballocation", function(err, result) {
       if (err){
         console.log(err);
         res.render("error", {
           Error: "Inserting error",
           Detailed: err.sqlMessage
         });
       }
       else{
         console.log("Allocation Delete!!");
         res.send("All allocation deleted");
       }
    });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
