class Section:
    def __init__(self, Sid, Sdept, Ssem):
        self.Sid = Sid
        self.Sdept = Sdept
        self.Ssem = Ssem
        self.slotfree = self.initialize()
        self.slotfixed = []

    def initialize(self):
        slots = []
        for i in range(1, 31):
            slots.append(i)
        return slots

    def sectionallocation(self):
        return

    def __repr__(self):
        return "Section ID:% s Dept:% s Sem:% s" % (self.Sid, self.Sdept, self.Ssem)
