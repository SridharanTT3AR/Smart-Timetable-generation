import mysql.connector
import random

from faculty import Faculty
from classroom import Classroom
from lab import Lab
from course import Course
from section import Section


def random_slot(freeslot):
    while(len(freeslot) > 0):
        N = random.choice(freeslot)
        low = N - 1
        high = N + 1
        if(low in freeslot):
            return low, N
        elif(high in freeslot):
            return N, high
        else:
            freeslot.remove(N)
    return -1, -1


def getTsDay(s):
    llt = [5, 6, 11, 12, 17, 18, 23, 24, 29, 30]
    if s in llt:
        s+= 1
    dayDict = ["Monday","Tuesday","Wednesday","Thursday","Friday"]
    ts = (s % 7)
    day1 = dayDict[int(s/7)]
    if(ts==0):
        ts = 6

    return ts, day1


def labAllocate(mydb, c, s1, s2, labs, s, f, allocid):

    print(c)

    mycursor = mydb.cursor()

    mycursor.execute("SELECT building, ID FROM lab WHERE Type = 'Computer-1';")

    myresult = mycursor.fetchall()

    for x in myresult:
        flag1 = 0
        for y in labs:
            if y.Lid == x[1]:
                flag1 = 1
                break

        if flag1 == 0:
            l = Lab(x[0], x[1])
            labs.append(l)

    iter1 = 0


    while(iter1 < len(labs)):
        if s1 in labs[iter1].slotfree and s2 in labs[iter1].slotfree:
            labs[iter1].slotfree.remove(s1)
            labs[iter1].slotfree.remove(s2)

            labs[iter1].slotfixed.append(s1)
            labs[iter1].slotfixed.append(s1)

            s.slotfree.remove(s1)
            s.slotfree.remove(s2)

            s.slotfixed.append(s1)
            s.slotfixed.append(s2)

            f.slotfree.remove(s1)
            f.slotfree.remove(s2)

            f.slotfixed.append(s1)
            f.slotfixed.append(s2)

            # print(allocid," ",f)

        # for z in faculties:
        #     print(z)

#         INSERT INTO facultyallocation VALUES(50017, 30000018, 7, 'Tuesday', '15CSE302');
# INSERT INTO sectionallocation VALUES(50017, 'A', 'CSE', 5, 7, 'Tuesday');
# INSERT INTO laballocation VALUES(50017, '800', 'AB2', 7, 'Tuesday');
            ts, day1 = getTsDay(s1)
            ts1 = ts+1

            # print(ts,day1)
            facid = list(f.Fid)
            facid = str(facid[0])

            allocid1 = allocid+1

            print(allocid, " ", facid, " ", ts, " ", day1," ",c.Cid)

            sqlQ = "INSERT INTO facultyallocation1 VALUES("+str(allocid)+","+facid+","+str(ts)+",\'"+day1+"\',\'"+c.Cid+"\');"

            mycursor.execute(sqlQ)
            # mydb.commit()

            print(allocid1, " ", facid, " ", ts, " ", day1," ",c.Cid)

            sqlQ = "INSERT INTO facultyallocation1 VALUES("+str(allocid1)+","+facid+","+str(ts1)+",\'"+day1+"\',\'"+c.Cid+"\');"

            mycursor.execute(sqlQ)
            # mydb.commit()

            print(allocid, " ", s.Sid, " ", s.Sdept," ", s.Ssem," ", ts, " ", day1)

            sqlQ = "INSERT INTO sectionallocation1 VALUES("+str(allocid)+",\'"+s.Sid+"\',\'"+s.Sdept+"\',"+str(s.Ssem)+","+str(ts)+",\'"+day1+"\');"

            mycursor.execute(sqlQ)
            # mydb.commit()

            print(allocid1, " ", s.Sid, " ", s.Sdept," ", s.Ssem," ", ts, " ", day1)

            sqlQ = "INSERT INTO sectionallocation1 VALUES("+str(allocid1)+",\'"+s.Sid+"\',\'"+s.Sdept+"\',"+str(s.Ssem)+","+str(ts1)+",\'"+day1+"\');"

            mycursor.execute(sqlQ)
            # mydb.commit()

            print(allocid, " ", labs[iter1].Lid, " ", labs[iter1].Lbuilding," ", s.Ssem," ", ts, " ", day1)

            sqlQ = "INSERT INTO laballocation1 VALUES("+str(allocid)+",\'"+str(labs[iter1].Lid)+"\',\'"+str(labs[iter1].Lbuilding)+"\',"+str(ts)+",\'"+day1+"\');"

            mycursor.execute(sqlQ)
            # mydb.commit()
            print(allocid1, " ", labs[iter1].Lid, " ", labs[iter1].Lbuilding," ", s.Ssem," ", ts, " ", day1)

            sqlQ = "INSERT INTO laballocation1 VALUES("+str(allocid1)+",\'"+str(labs[iter1].Lid)+"\',\'"+str(labs[iter1].Lbuilding)+"\',"+str(ts1)+",\'"+day1+"\');"

            mycursor.execute(sqlQ)
            mydb.commit()

            allocid += 2

            return allocid

        else:
            iter1 += 1

    return -1


def classroomAllocate(mydb, c, slotc, classrooms, s, f, allocid):

    print(c)

    mycursor = mydb.cursor()

    mycursor.execute("SELECT building, ID FROM classroom WHERE Type = 'Standard';")

    myresult = mycursor.fetchall()

    for x in myresult:
        flag1 = 0
        for y in classrooms:
            if y.Crid == x[1]:
                flag1 = 1
                break
        print(x, " ", x[0])

        if flag1 == 0:
            cr = Classroom(x[0], x[1])
            classrooms.append(cr)

    iter1 = 0
    flags = [0]*c.Cc

    crs = [0]*c.Cc

    while(iter1 < len(classrooms)):

        for q in range(0,len(slotc)):
            print(c,"Q",q,"iter1",iter1,"slotc",slotc,"slotclen",len(slotc))
            if flags[q] == 0 and slotc[q] in classrooms[iter1].slotfree:
                flags[q] = 1
                crs[q] = classrooms[iter1]

        # if f1 == 0 and slotc[0] in classrooms[iter1].slotfree:
        #     f1 = 1
        #     c1 = classrooms[iter1]
        # if f2== 0 and slotc[1] in classrooms[iter1].slotfree:
        #     f2 = 1
        #     c2 = classrooms[iter1]
        # if f3 == 0 and slotc[2] in classrooms[iter1].slotfree:
        #     f3 = 1
        #     c3 = classrooms[iter1]
        tss = [0]*c.Cc
        days = [0]*c.Cc

        facid = list(f.Fid)
        facid = facid[0]

        print("flags",flags)

        if(0 not in flags):
            for cri in range(0,len(crs)):
                crs[cri].slotfree.remove(slotc[cri])
                crs[cri].slotfixed.append(slotc[cri])

                s.slotfree.remove(slotc[cri])
                s.slotfixed.append(slotc[cri])

                f.slotfree.remove(slotc[cri])
                f.slotfixed.append(slotc[cri])

                tss[cri],days[cri] = getTsDay(slotc[cri])

                print(allocid+cri, " ", facid, " ", tss[cri], " ", days[cri]," ",c.Cid)

                sqlQ = "INSERT INTO facultyallocation1(alloc_id, id, time_slot, day, course_id) VALUES(%s, %s, %s, %s, %s);"
                valQ = (allocid+cri, facid, tss[cri], days[cri], c.Cid)

                mycursor.execute(sqlQ, valQ)

                # mydb.commit()
                sqlQ = "INSERT INTO sectionallocation1(alloc_id, id, dept_name, semester, time_slot, day) VALUES(%s, %s, %s, %s, %s, %s);"
                valQ = (allocid+cri, s.Sid, s.Sdept, s.Ssem, tss[cri], days[cri])

                mycursor.execute(sqlQ, valQ)

                # mydb.commit()

                sqlQ = "INSERT INTO classroomallocation1(alloc_id, id, building, time_slot, day) VALUES(%s, %s, %s, %s, %s);"
                valQ = (allocid+cri, crs[cri].Crid, crs[cri].Crbuilding, tss[cri], days[cri])

                mycursor.execute(sqlQ, valQ)

                mydb.commit()

            allocid = allocid+cri+1
            return allocid

        else:
            iter1 += 1

    return -1
            # print(allocid," ",f)

        # for z in faculties:
        #     print(z)

#         INSERT INTO facultyallocation VALUES(50017, 30000018, 7, 'Tuesday', '15CSE302');
# INSERT INTO sectionallocation VALUES(50017, 'A', 'CSE', 5, 7, 'Tuesday');
# INSERT INTO laballocation VALUES(50017, '800', 'AB2', 7, 'Tuesday');



            # ts1, day1 = getTsDay(slotc[0])
            # ts2, day2 = getTsDay(slotc[1])
            # ts3, day3 = getTsDay(slotc[2])

            # print(ts,day1)






def main():

    mydb = mysql.connector.connect(
      host="localhost",
      user="root",
      password="premismyfriend",
      database="smarttimetabling"
    )

    mycursor = mydb.cursor()

    mycursor.execute("SELECT id,dept_name,semester FROM section;")

    myresult = mycursor.fetchall()

    #print(type(myresult))
    #print(myresult)
    sections = []
    for x in myresult:
        s = Section(x[0], x[1], x[2])
        sections.append(s)

    # for y in sections:
    #     print(y)

    odcourses = []
    electives = []
    labcourses = []
    theorycourses = []

    allcourses = []

    mycursor.execute("SELECT id,l,p,c from Course WHERE id IN (SELECT subject_id FROM enrols where dept_name='CSE' and semester = 5 and substr(subject_id,3,3)!='CSE' and length(subject_id)=8);")

    myresult = mycursor.fetchall()

    for x in myresult:
        c = Course(x[0], x[1], x[2], x[3])
        odcourses.append(c)
    # for y in odcourses:
    #     print(y)

    mycursor.execute("SELECT id,l,p,c from Course WHERE id IN (SELECT course_id from elective WHERE e_id IN (SELECT subject_id FROM enrols where dept_name='CSE' and semester = 5 and length(subject_id)=5));")

    myresult = mycursor.fetchall()

    for x in myresult:
        c = Course(x[0], x[1], x[2], x[3])
        electives.append(c)

    # for y in electives:
    #     print(y)

    mycursor.execute("SELECT id,l,p,c from Course INNER JOIN Enrols ON Course.ID = Enrols.Subject_ID WHERE Course.p>0 and enrols.dept_name='CSE' and enrols.semester = 5;")

    myresult = mycursor.fetchall()

    for x in myresult:
        c = Course(x[0], x[1], x[2],x[3])
        labcourses.append(c)
    print("LC",labcourses)

    # for y in labcourses:
    #     print(y)

    mycursor.execute("SELECT id,l,p,c from Course INNER JOIN Enrols ON Course.ID = Enrols.Subject_ID WHERE Course.type IN ('Theory', 'Project based') and enrols.dept_name='CSE' and enrols.semester = 5 and Course.dept_name='CSE';")

    myresult = mycursor.fetchall()

    for x in myresult:
        c = Course(x[0], x[1], x[2], x[3])
        theorycourses.append(c)

    print("TC",theorycourses)


    # for y in theorycourses:
    #     print(y)
    for z in odcourses:
        allcourses.append(z)
    for z in labcourses:
        allcourses.append(z)
    for z in theorycourses:
        allcourses.append(z)

    faculties = []
    classrooms = []
    labs = []

    print(allcourses)
    allocid = 50000

    print("s",sections)

    for s in sections:
        for c in allcourses:
            mycursor.execute("SELECT ID FROM courseseligible where Domain_course = \'" + c.Cid+"\';")

            myresult = mycursor.fetchall()

            fiter = len(faculties)

            for x in myresult:
                flag0 = 0
                for y in faculties:
                    if y.Fid == x:
                        flag0 = 1
                        break

                if flag0 == 0:
                    f = Faculty(x)
                    faculties.append(f)

    # for z in faculties:
    #     print(z)
            iter0 = len(faculties) - fiter
            #print(c.Cp, type(c.Cp))
            if c.Cp == 2:
                while(iter0):
                # PSlots = (S.SlotsFree n T.SlotsFree) - {4,10,16,22,28,6,12,18,24,30}
                    PSlots = list((set(s.slotfree) & set(faculties[fiter].slotfree))-set([4, 10, 16, 22, 28, 6, 12, 18, 24, 30]))

                    while(len(PSlots) > 0):
                        s1, s2 = random_slot(PSlots)

                        if s1 == -1:
                            fiter += 1
                            iter0 -= 1  # handle no teacher possible to allocate

                        else:
                            La = labAllocate(mydb, c, s1, s2, labs, s, f, allocid)

                            if La != -1:
                                allocid = La
                                iter0 = 0
                                break
                            else:
                                PSlots = list(set(PSlots) - set([s1, s2]))

            if c.Cl>0:
                slotc = []
                slotd=[]
                while(iter0):
                    PSlots = list((set(s.slotfree) & set(faculties[fiter].slotfree)))

                    slotc.clear()

                    slotd.clear()
                    iter4 = len(PSlots)
                    iter4 = iter4**2
                    while(len(PSlots) > 0):
                        slotc.clear()

                        slotd.clear()
                        for k in range(c.Cc):

                            while(iter4):
                                m = random.choice(PSlots)
                                ts1, day2 = getTsDay(m)
                                iter4-=1
                                if(day2 not in slotd):
                                    break
                            slotd.append(day2)
                            slotc.append(m)

                        if len(slotc) < c.Cc:
                            fiter += 1
                            iter0 -= 1  # handle no teacher possible to allocate
                        else:
                            Ca = classroomAllocate(mydb, c, slotc, classrooms, s, f, allocid)

                            if Ca != -1:
                                allocid = Ca
                                iter0 = 0
                                break
                            else:
                                PSlots = list(set(PSlots) - set(slotc))




                #print(c)


if __name__ == "__main__":
    main()
