class Course:
    def __init__(self, Cid, Cl, Cp, Cc):
        self.Cid = Cid
        self.Cl = Cl
        self.Cp = Cp
        self.Cc = Cc

    def __repr__(self):
        return "Course ID:% s P:% s C:% s" % (self.Cid, self.Cp, self.Cc)
