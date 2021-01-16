class Faculty:
    def __init__(self, Fid):
        self.Fid = Fid
        self.slotfree = self.initialize()
        self.slotfixed = []

    def initialize(self):
        slots = []
        for i in range(1, 31):
            slots.append(i)
        return slots

    def facultyallocation(self):
        return

    def handleclash(self):
        return

    def __repr__(self):
        return "FID:% s " % (self.Fid)
